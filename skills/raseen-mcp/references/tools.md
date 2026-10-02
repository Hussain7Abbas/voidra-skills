# Raseen MCP tool reference

This describes the repository's current 16-tool surface. Inspect the connected tools before calling them; use their current schemas if the deployment differs. All arguments listed below are required unless marked optional or defaulted. Every write requires `confirm: true`.

## Dashboard reads (`dashboard:read`, admin)

| Tool | Arguments |
|---|---|
| `dashboard_list_services` | None |
| `dashboard_get_service` | `serviceId` |
| `dashboard_list_sub_agents` | `serviceId` |
| `dashboard_list_users` | `page` (default 1), `pageSize` (default 20, 1–100), optional `search` (max 200 chars) |
| `dashboard_get_usage_stats` | None |

Service lists expose `services` containing IDs, names, slugs, and other metadata. A service read exposes `service`, including nullable `automationAdl`. Usage revenue remains broken down by currency in minor units.

## Dashboard writes (`dashboard:write`, admin)

`dashboard_update_service` requires `serviceId` and `confirm`. Send only requested optional fields:

| Field | Value |
|---|---|
| `name` | 1–200 characters |
| `description` | At most 50,000 characters |
| `slug` | Lowercase alphanumeric words separated by single hyphens |
| `isActive`, `allowsNewThreads` | Boolean |
| `threadPriceCoins` | Nonnegative integer |
| `agentPrompt` | String or null |
| `preferredModel` | Nonempty model ID |
| `automationAdl` | Complete ADL source up to 250,000 characters, or null to clear |

`dashboard_create_sub_agent` requires `serviceId`, `name`, `instructions`, `model`, `outputFormat`, and `confirm`. `name` matches `[a-zA-Z][a-zA-Z0-9_]{0,63}`. `instructions` and `model` are nonempty. `outputFormat` is `text`, `json`, or `markdown`. Optional `params` and `outputParams` default to empty arrays:

- Input parameter: `{"name":"topic","type":"string","description":"Research topic","required":true}`.
- Output parameter: `{"name":"summary","type":"string","description":"Research summary"}`.
- Parameter types are `string`, `number`, or `boolean`; these are live sub-agent schemas, separate from ADL's `text`/`array` types.

There is no MCP service-creation or sub-agent-update/delete tool in this surface. Diagram children require ADL source editing, not this live sub-agent tool.

## User writes (`users:write`, admin)

| Tool | Arguments |
|---|---|
| `dashboard_gift_coins` | `userId`, integer `amount` from 1 to 1,000,000, `confirm` |
| `dashboard_set_user_role` | `userId`, `role` as `user` or `admin`, `confirm` |
| `dashboard_ban_user` | `userId`, `confirm`, optional `reason` (max 500 chars), optional integer `expiresInSec` (at least 60) |

Coin gifts are additive and must not be retried blindly. Role and ban updates set state, but their authorization must still match the requested target and change.

## App reads (`app:read`, own data)

| Tool | Arguments |
|---|---|
| `app_list_threads` | `serviceSlug` (1–128 chars) |
| `app_get_thread` | `threadId` |
| `app_list_sub_threads` | `threadId` |
| `app_list_models` | None |

Use `app_get_thread` to inspect message history and token usage. `app_list_sub_threads` returns live sub-agent runs; this is separate from ADL preview. Model lists are grouped by provider.

## Chat writes (`chat:write`, own data)

| Tool | Arguments |
|---|---|
| `app_create_thread` | `serviceSlug` (1–128 chars), `confirm` |
| `app_send_message` | `threadId`, nonempty `content`, nonempty `model`, `confirm`, optional array `fileIds` |

Creating a thread spends its service's coin price. The send-message tool consumes the backend SSE stream itself and returns `text`, `messageId`, `title`, `usage`, `contextLength`, and `subAgents`. Check `isError`; a failed stream may already have persisted effects, so inspect the thread before considering another send.

## Result handling

Successful object results appear in `structuredContent` and as JSON text in `content`. Non-object results are wrapped under `value` in structured content. Failures set `isError: true` with text. Never assume that a populated `content` array means success. Use returned IDs and envelopes; inspect unfamiliar response fields rather than inventing them.
