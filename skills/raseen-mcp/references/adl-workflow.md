# Save and read ADL through MCP

For ADL language authoring, use `raseen-adl` when installed. This reference handles the saved service design; it does not define another workflow language.

Use the tools of the customer's configured **Raseen** MCP connection. A client may prefix their names with its server identifier; select the corresponding tools by their exposed names and schemas.

## Connection requirements

An administrator creates a personal API key in the dashboard API Keys page, with `dashboard:read` and `dashboard:write`. Ordinary user keys cannot receive dashboard scopes. The user configures that secret in their MCP client; do not request or include it in workflow source. OAuth is not implemented in this release.

- Hosted connections use Streamable HTTP at the operator-provided MCP URL (deployment convention: `https://mcp.<domain>/mcp`) and `Authorization: Bearer <personal API key>`.
- A local checkout can run `bun apps/mcp/src/index.ts` from its repository root with `MCP_TRANSPORT=stdio`, `API_URL` set to the backend origin, and `RASEEN_API_KEY` configured in the process environment. The backend URL is an origin, without `/api/v1`.

Do not invent a customer's domain or local checkout path. If connection details are missing, ADL can still be delivered as a file for dashboard import.

## Tool calls

Resolve the service:

```json
{"name":"dashboard_list_services","arguments":{}}
```

The structured result is `{"services":[{"id":"...","name":"...","slug":"..."}]}` with other service metadata. Read one actual returned ID:

```json
{"name":"dashboard_get_service","arguments":{"serviceId":"ID_FROM_LIST"}}
```

The structured result is `{"service":{"id":"...","automationAdl":null}}` or the current source string, plus service metadata. Read `service.automationAdl`, not a top-level `automationAdl`. MCP also returns the result as JSON text for clients without structured-result support.

Save the full document as a **string**. This complete small example is valid ADL; replace the service ID with the one actually selected:

```json
{
  "name": "dashboard_update_service",
  "arguments": {
    "serviceId": "ID_FROM_LIST",
    "automationAdl": "adl 1\nworkflow \"Greeting\"\nnode start start {\"label\":\"Start\",\"position\":{\"x\":0,\"y\":0}}\nnode done end {\"label\":\"Done\",\"position\":{\"x\":280,\"y\":0},\"value\":\"Hello\"}\nconnect start.next -> done\n",
    "confirm": true
  }
}
```

`confirm: true` is mandatory and acknowledges the authorized write. It is not part of ADL. With a structured tool argument, supply real newline characters in the source string; JSON serialization handles transport escaping. Do not send a JSON graph, markdown fences, or text with literal `\n` characters replacing document line breaks.

Each service stores one design. Saving replaces that source; it does not create another workflow record or alter live prompts/sub-agent definitions. There is no MCP service-creation or workflow-execution tool in this release. If no intended service exists, the administrator creates/selects it in the dashboard first. `dashboard_create_sub_agent` is unrelated to drawing a child node.

After a successful update, use `dashboard_get_service` to verify the exact source. Then direct the user to their dashboard's `/automations?service=ACTUAL_ID` for graph validation and interactive preview. Use an actual known dashboard origin before presenting an absolute link.

## Errors and retries

- Check `isError` on tool results; receiving content does not imply success. Missing/false confirmation is rejected. Invalid ADL syntax, unsupported node properties, or oversize source are rejected by the backend.
- Authentication errors require fixing the connection/key; forbidden errors require the correct admin role/scopes. Do not retry those writes unchanged.
- A successful save can still contain graph errors because incomplete designs are allowed. Do not describe it as preview-validated until graph validation has passed.
- If a write times out or the result is unclear, read the design before retrying. If it matches, the save succeeded. If it still equals the earlier source, retry the identical authorized update once when the failure is transient. If it contains a different change, stop and resolve the conflict. If read-back also fails, report the outcome as unverified rather than repeatedly writing.
- Updates are last-write-wins; there is no revision check, merge, or rollback history on the server. Re-read before overwriting after a long editing interval. Keep/export the prior source when a requested replacement needs recovery.
- Send `automationAdl: null` only for a requested clear operation, never as a fallback for invalid source.
