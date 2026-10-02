---
name: raseen-mcp
description: Use a configured Raseen MCP connection to read or update services, save ADL designs, inspect or create Raseen chats, send messages, manage live service sub-agents, and perform requested user administration. Use for Raseen MCP tools and connection setup; use raseen-adl for writing workflow source. Raseen chats are application data, separate from Codex chats.
metadata:
  contributors: hussain7abbas <hussain@iscoded.com>
---

# Raseen MCP

Operate the user's configured Raseen server through its exposed MCP tools. Discover the actual connection and tool schemas first: clients may prefix names with a server identifier. If tools are missing, read [connection setup](references/connection.md) and explain the missing connection. Installing this skill alone does not connect a server.

Read [the tool reference](references/tools.md) for operations needed by the request. The connected server's current schema is authoritative. Credentials belong in client settings or process environment; never copy keys into a skill, workflow, command history, or response.

## Select and inspect

Resolve services with `dashboard_list_services` and then `dashboard_get_service`. Dashboard operations use the actual service **ID**; app thread operations use the service **slug**. Use returned thread/user IDs rather than inventing them. Ask for a selection only if the requested target remains ambiguous after inspection.

Use `structuredContent` where available, otherwise parse the JSON text content. Check `isError` before treating a result as success. Service reads return a `service` envelope, including `service.automationAdl`. Backend ownership, admin roles, key scopes, rate limits, and spend limits remain authoritative.

## Save or edit ADL

Read [ADL persistence](references/adl-workflow.md) for exact payloads and recovery. If `raseen-adl` is installed, use it to prepare and validate source. Without it, save user-supplied source only within the requested scope and state any unverified graph validation.

Read and retain the existing design, then update only `serviceId`, the complete `automationAdl` string, and `confirm: true`. Preserve the current design unless the request entails replacement. A request to save or replace that selected design authorizes the write; drafting alone does not. Read back and compare the exact source. Each service stores one design; a save replaces it. Clear it with `null` only when requested. A save supports dashboard validation/preview and does not start live execution. `dashboard_create_sub_agent` configures a live service sub-agent and must not be used to create an ADL diagram child. There is no service-create or workflow-run tool in this surface.

## Service, chat, and user operations

Read current state before a service change; submit only the fields the user requested and verify those fields afterward. For live sub-agent creation, list existing definitions first and use returned service/model information. Keep live sub-agents separate from ADL nodes.

For Raseen chat, reuse the requested thread when it exists. Creating a thread spends the service's configured coin price. Choose an actual model from `app_list_models` or the user's explicit choice; `app_send_message` requires a model. Attach only existing authorized file IDs; these tools do not upload files. Sending a message invokes the live chat and can run configured sub-agents. Return final text with relevant usage/results rather than claiming an ADL workflow ran.

User administration requires an admin and `users:write`. Resolve the user and exact requested amount, role, or ban terms before submitting a change. Inspect the resulting user state where the tools permit. Revenue is per currency in minor units; preserve currencies and units in summaries.

## Writes and recovery

Every write in this tool surface requires `confirm: true`. It acknowledges an already authorized action; it does not supply missing user authorization or require asking again for a requested change. Read-only requests do not authorize writing, spending coins, or sending messages.

After an unclear outcome, inspect state before retrying. Service updates are state-setting, last-write-wins operations; retry the same authorized update at most once after confirming no conflicting change. Thread/sub-agent creation, coin gifts, and chat messages must not be retried blindly: they can duplicate data, credits, or execution. Recover through the applicable list/get tool; if inspection cannot determine success, report an unverified outcome and resolve it with the user.

Authentication or scope failures require fixing the connection, role, or key rather than resubmitting unchanged writes. Report tool errors accurately and do not claim successful mutation from content alone.
