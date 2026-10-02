---
name: raseen-adl
description: Write, explain, review, validate, or edit Raseen Automation Diagram Language (ADL 1) workflows for the Automations designer. Use for agent orchestration, typed ports, caller context, tools, variables, questions, conditions, returns, and bounded retries. Use raseen-mcp for connected service operations; ADL authoring works without MCP and concerns design and preview rather than live execution.
metadata:
  contributors: hussain7abbas <hussain@iscoded.com>
---

# Raseen ADL workflows

Turn the user's intended agent orchestration into an ADL 1 document that the Raseen Automations designer can render and preview. ADL means **Automation Diagram Language**. Users may write “ALD”; use `adl 1` in the document.

## Write or edit a design

Read [the language reference](references/adl-1.md) when writing or reviewing ADL; it contains the exact node properties, connections, context policies, and validation rules.

Start from the example closest to the requested behavior:

- [Agent handoff](assets/agent-handoff.adl): typed inputs and outputs, an isolated child, and a `return` link that sends the child's result back to its caller.
- [Review and approval](assets/review-and-approve.adl): shared child context, multi-input transfer, a typed variable, a tool, an MCQ question, and a chained condition that gates stored output.
- [Bounded retry](assets/bounded-retry.adl): a condition revisits a question answer at most three times, then follows its chosen exit branch.

Adapt labels, instructions, models, tool names, samples, and layout to the request. Example model IDs and tool names are illustrative; prefer the selected service's model and the user's specified integrations. Keep existing IDs, variable names, positions, and connections when they still express the requested design.

Use a single `agent` node kind. A direct agent-output to agent-input link makes the receiver a child of that caller. Specify `context: "isolated"` when the child needs only its own instructions and explicit data; choose `"shared"` when it also needs the active callers' conversation snapshots. Never create a separate sub-agent block or a `parent` property in new ADL.

Declare each receiving port in `inputs` and each agent result in `outputs`, then connect compatible names with `connect source.port -> target.input_name`. Bare targets control when a block runs. Scalar inputs accept one source. Array inputs accept one array source or collect multiple scalar sources. Ordinary outputs may fan out.

When creating an agent output, name its first generated port `{node_id}_output` using the block's unique ADL ID, such as `planner_output`; further generated ports use `_2`, `_3`, and so on. Keep existing custom output names when editing a workflow.

If a descendant agent must send a result back to an earlier caller, declare a separate caller input and use `return child.result -> caller.child_result`. A return carries typed data into the earlier trace/context snapshot without activating that caller again. Use `return` only when an ordinary path already leads from the receiver to the sender; ordinary `connect` links remain acyclic.

For a condition loop, set a positive `maxRetries` on the condition and choose `onRetryLimit: "yes" | "no"` as the branch that exits the loop. Use `repeat descendant.output -> condition.input` to send a later result back for another evaluation. The exit branch must differ from the branch that reaches the repeat source. The designer creates a repeat link automatically when a data connection back to such a condition would otherwise close a cycle.

Prefer explicit inputs for facts a child needs instead of sharing all caller history by default. Shared history excludes callers' system instructions. A condition has one `yes` and one `no` link. When data is available before an approval decision, add a separate decision control link to the receiving block so the data cannot bypass the gate.

Before calling a design complete, check its start/end, reachability, cycles, output capacities, unique variable names, mandatory references, and both condition paths using the reference. A saved draft is not proof of a valid graph. If the Raseen repository is available, `parseAdl` and `validateAdl` from `@raseen/validators` are the authoritative checks. Otherwise inspect these rules and state that dashboard preview validation remains to be checked.

Deliver the complete `.adl` source or file and briefly explain the input flow and context boundaries. Agent/tool `sample` strings are preview results, not actual model/tool calls. Questions pause only the local preview; saving a design does not activate it in live chat.

## Connected designs

When the user requests reading or saving a service design, use the separately installed `raseen-mcp` skill if available. It owns connection discovery, service selection, authorization, full-source saves, and read-back verification. Retrieve the current design before adapting it with this skill. Authoring a draft alone does not authorize a service write.

If that skill or the Raseen tools are unavailable, deliver the complete `.adl` file for **Automations → Import → Apply ADL → Save design** and explain that it has not been saved remotely. Each service stores one design. An ADL child is an `agent` node; creating a separate live service sub-agent is outside diagram authoring.
