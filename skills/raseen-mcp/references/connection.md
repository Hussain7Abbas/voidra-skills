# Raseen connection setup

Use an existing configured Raseen MCP connection when available. Ask for a missing server URL or checkout location only when setup is requested and it cannot be found from context. Do not invent a domain or copy credentials from unrelated accounts.

The operator creates a personal API key in the app profile or dashboard API Keys page. OAuth is not implemented in this release. An ordinary user cannot grant dashboard or user-administration scopes.

| Operation | Required key scope | Account |
|---|---|---|
| App models, thread history, sub-thread results | `app:read` | User or admin, own data |
| Create a thread or send a chat message | `chat:write` | User or admin, own data |
| Read services, live sub-agents, users, usage | `dashboard:read` | Admin |
| Update a service or create a live sub-agent | `dashboard:write` | Admin |
| Gift coins, change a role, ban a user | `users:write` | Admin |

Use the scopes needed for the task. A key's `spendLimitCoins` caps lifetime coins spent creating threads. Key expiry, revocation, ownership, and backend limits still apply.

## Hosted transport

Configure Streamable HTTP at the actual operator-provided MCP URL. Deployment convention is `https://mcp.<domain>/mcp`, with `Authorization: Bearer <personal API key>`. The server's allowed hosts must include its actual hostname. Use the client's secret-storage mechanism; do not render the key in generated instructions or files.

## Local transport

From the real Raseen checkout root, the entry point is:

```sh
bun --env-file=apps/mcp/.env apps/mcp/src/index.ts
```

Set the working directory to that checkout, `MCP_TRANSPORT=stdio`, `API_URL` to the backend origin (without `/api/v1`), and `RASEEN_API_KEY` in the client's secure environment. An existing private env file may provide these values; do not overwrite it with example secrets. Local defaults are backend `http://localhost:4000` and HTTP MCP port 4002.

If tools remain unavailable, explain what is missing. ADL files can still be drafted for dashboard import. Installing a skill is separate from configuring credentials and establishing an MCP connection.
