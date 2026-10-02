# ADL 1 language reference

## Syntax and limits

```text
adl 1
workflow "Workflow name"
node NODE_ID KIND {"label":"Label","position":{"x":0,"y":0}, ...}
connect SOURCE_ID.OUTPUT -> TARGET_ID
connect SOURCE_ID.OUTPUT -> TARGET_ID.INPUT
return DESCENDANT_ID.OUTPUT -> ANCESTOR_ID.INPUT
repeat DESCENDANT_ID.OUTPUT -> CONDITION_ID.INPUT
```

The node line is a grammar sketch. Replace `...` with that kind's properties. Complete documents are in `../assets/`.

Each declaration occupies one physical line. Node configuration is strict JSON: double-quoted keys and strings, escaped text newlines such as `\n`, and no trailing commas. The first non-comment line is `adl 1`; declare one `workflow`. Keywords and identifiers are case-sensitive. Blank lines, LF/CRLF, and whole-line `#` comments are allowed. Inline comments and executable expressions are not.

- Node IDs, port names, and variable names match `[A-Za-z][A-Za-z0-9_]{0,63}` and cannot be `constructor`, `prototype`, or `__proto__`.
- Node IDs are unique. Port names are unique within their input or output list. `saveAs` names are unique across the workflow.
- Maximum: 200 nodes, 400 links, 20 inputs or outputs per node, and 250,000 JavaScript characters of source.
- Workflow names and labels are 1–200 characters. Prompt, value, sample, model, and tool strings are at most 10,000 characters. Positions are finite x/y values from -100000 through 100000.
- Layout is part of ADL and round-trips through the visual designer. Labels and instructions may use any language; syntax remains English.

The parser accepts incomplete drafts. The designer's graph validation decides whether a parsed draft is ready for preview.

## Types and ports

ADL values use four types: `"text"`, `"number"`, `"boolean"`, and `"array"`. A port is a strict object:

```json
{"name":"request","type":"text"}
```

Nodes that accept named inputs use an optional `inputs` array. New agent nodes also use an `outputs` array with at least one port. The designer names an agent's first generated output `{node_id}_output` (for example, `planner_output`), then `{node_id}_output_2` and so on. The stable unique node ID supplies the name, even when the display label changes. Duplicating a node regenerates only outputs with those default names; custom output names remain unchanged. Older ADL without these fields keeps a legacy text port named `input` and a text output named `next`.

An output may fan out to many targets. A scalar input (`text`, `number`, or `boolean`) accepts exactly one source. An `array` input accepts either one array output or multiple scalar outputs; multiple scalar values are collected in link declaration order. An array output cannot be mixed with another source on the same array input.

Source and target types must match except that any scalar type may feed an array input. Start has only the control output `next` and cannot send data to a named input. Tool and question output is `next:text`; a typed variable output is `next` with its selected type. Conditions output `yes:boolean` and `no:boolean`. End has no output.

## Node properties

Every node requires `label` and `position: {"x": number, "y": number}`. The declaration supplies `id` and `kind`; do not repeat them in JSON. Unknown fields are rejected. Properties are required unless marked optional.

| Kind | Additional properties | Preview behavior |
|---|---|---|
| `start` | None | One entry point; control output `next` |
| `agent` | `model`, `prompt`, `sample`; optional `inputs`, `outputs`, `saveAs`, `context` | Receives named data and exposes each declared output; `sample` supplies the local preview result |
| `tool` | `tool`, `input`, `sample`; optional `inputs`, `saveAs` | Connected data overrides manual `input`; returns sample text on `next` |
| `variable` | `saveAs`, `value`; optional `valueType` | Stores connected typed input or an unbound literal/template; outputs it on `next` |
| `question` | `prompt`, `mode`, `options`; optional `inputs`, `saveAs` | Shows connected data, pauses for an answer, and returns text on `next` |
| `condition` | `value`, `equals`; optional `inputs`, `conditions`, `maxRetries`, `onRetryLimit` | Evaluates the condition chain and activates `yes` or `no`; bounded repeats can revisit it |
| `end` | `value`; optional `inputs` | Emits connected data or its value and finishes its branch |

Agent model/instructions, tool name, and question prompt must be nonblank. A question `mode` is `"text"` or `"mcq"`; `options` is always present and normally `[]` for text. MCQ requires 2–20 distinct nonblank strings. Text answers are nonblank and at most 10,000 characters.

`context` applies only to agents and is `"isolated"` or `"shared"`. Start, condition, and end cannot use `saveAs`. Tool/model names are design metadata in this release; preview does not call them.

`valueType` defaults to legacy text behavior when omitted. New variable nodes should set it explicitly. A typed variable has one input named `input`; its canvas label shows `saveAs` and the chosen type.

## Conditions

New conditions declare at least one row in `conditions`:

```json
"inputs":[{"name":"score","type":"number"},{"name":"title","type":"text"}],
"conditions":[
  {"input":"score","operator":"larger","value":"5"},
  {"input":"title","operator":"contains","value":"urgent","join":"and"}
]
```

Each row selects a named input, an operator, and a comparison value. Rows after the first use optional `join: "and" | "or"`; omission means `and`. Evaluation proceeds from top to bottom.

- `equal`: exact string representation equality.
- `contains`: substring match for text; for arrays, an item must have the same string representation.
- `larger` / `smaller`: numeric comparison and therefore require a `number` input.

The legacy `value`/`equals` pair remains required for source compatibility and is used only when `conditions` is omitted. Every condition has exactly one `yes` link and one `no` link, two ordinary outgoing links total.

`maxRetries` is an integer from 0 to 100. A positive value permits a later node to send a value back to the condition with `repeat`. `onRetryLimit` selects `"yes"` or `"no"` when retries are exhausted; it must be the branch that exits the loop. The default is `"no"`. New conditions in the designer start with a limit of 3. A repeat link does not count as a third condition output.

## Data, control, returns, and joins

`connect planner.plan -> child.task` transfers typed data and establishes dependency. `connect planner.plan -> child` is a control-only link: it controls activation and order without transferring the value.

A node waits for all ordinary incoming sources to complete or be skipped, then runs at most once. If it has control-only incoming links, at least one control must be active; otherwise an active data link activates it. Inactive branch descendants are skipped. All active branches settle before preview completes. This is deterministic local simulation, not parallel external execution.

Use a return link when a descendant must answer an earlier agent:

```text
return specialist.result -> planner.specialist_result
```

The target input must exist, types and capacity rules still apply, and an ordinary path must already lead from the return target to the return source. The returned value is added to the earlier node's received inputs and preview trace after the descendant finishes. It does not rerun or reactivate that earlier node, and it is excluded from dependency/cycle analysis. An ordinary `connect` data link drawn from descendant to ancestor is automatically stored as `return`; a control-only back edge is rejected.

Ordinary execution links remain acyclic. There is exactly one start, at least one end, and every node must be reachable from start through ordinary links. No self-links, dangling endpoints, incoming start links, duplicate links, or end outputs are allowed.

A repeat link connects one descendant output to a condition input:

```text
repeat followup.next -> check.answer
```

The condition must have `maxRetries > 0`; its loop branch must reach the repeat source, and the other branch must be selected in `onRetryLimit`. One repeat link is allowed per condition. During preview, each active repeat replaces the original value on that condition input and reevaluates the condition and its descendants. When the maximum is reached and the loop still continues, preview bypasses the comparison result and takes `onRetryLimit`. Every condition still has only `yes` and `no` outputs. Dragging a data connection from a descendant back to a retry-enabled condition creates `repeat`; returning data to an earlier agent still creates `return`.

Connected input labels in the designer display the upstream output name and cannot be renamed there. Internal port identifiers remain stable in ADL; an array input receiving several outputs displays their names together. Every diagram link displays its source output name. Each declared input has a small triangular handle; the separate Run after target is an invisible hit area at the upper-left edge of the node header, so one declared input appears as one triangle. Output handles remain small circles.

When data is already available before an approval branch, add a separate condition control link to the consumer. Otherwise its data links can activate it before approval. The review asset demonstrates a gated multi-input agent.

## Variables and references

`saveAs: "name"` exposes a visited node's summarized result as `{{name}}`. A variable node requires `saveAs`. A named output is referenced as `{{node_id.output_name}}`; legacy `{{node_id.output}}` resolves the node's summarized result. Whitespace inside braces is accepted.

References expand once in agent prompts/samples, manual tool inputs, manual values, condition comparison values, and legacy equality strings. They do not expand in labels, identifiers, model/tool IDs, or MCQ options. A referenced producer must be upstream and guaranteed to run whenever the consumer runs. Declaration order alone does not establish availability. Self-references, optional branch values read after an unconditional merge, missing ports/names, arbitrary object paths, and executable expressions are invalid.

Use data links for optional branch values. Conditional activation analysis is bounded; simplify a graph if validation reports excessive complexity. User text containing `{{...}}` is not recursively expanded.

## Caller context

There is one `agent` kind. A direct, non-return agent-output to agent-input link makes the receiver a child of that caller. Agents may have several callers, and an agent can be both a child and a caller.

- `"isolated"` (the default for a linked child): its own instructions and explicit data; no inherited conversation messages.
- `"shared"`: merges active callers' inherited conversation, explicit inputs, and outputs, with duplicates removed. Caller system instructions, skipped callers, unrelated siblings, later messages, and return links are excluded.

Sharing is a snapshot, not mutable shared memory. Isolation does not hide data explicitly passed through ports or references. An agent without a direct agent caller uses active upstream question/agent/tool history. Preview exposes resolved instructions, caller IDs, received inputs, return values, and inherited messages.

Do not write `subagent` or `parent` in new source. Legacy declarations are migrated to ordinary agents with an inferred input link and isolated context by default.

## Design versus execution

Server saving validates syntax and node shape; incomplete graphs can be stored as drafts. The dashboard validates graph rules before preview. Agent and tool samples are local preview data, never provider or integration calls. Questions, answers, variables, bounded condition retries, and return traces reset when preview restarts or closes. ADL has no unbounded loops, scheduling, external effects, provider execution, or durable paused runs.
