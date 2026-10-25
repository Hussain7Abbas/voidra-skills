# Runner Bun

Illustrative syntax only. Use the actual project contracts and runner; mocks do not prove provider compatibility.

### Bun Native Test Pattern (`bun:test`)

When the project uses Bun's built-in runner (see [Step 0](#step-0-detect-the-test-runner)), import from `bun:test` and run with `bun test` — not `bun run test`. The API is Jest-like, so `describe` / `it` / `expect` and most matchers carry over. See the `bun-runtime` skill for runtime, install, and bundler details.

```typescript
import { describe, it, expect, mock } from 'bun:test'
import { searchMarkets } from './search'

describe('searchMarkets', () => {
  it('returns an empty list for an empty query', async () => {
    expect(await searchMarkets('')).toEqual([])
  })

  it('sorts results by similarity score', async () => {
    const results = await searchMarkets('election')
    expect(results).toEqual([...results].sort((a, b) => b.score - a.score))
  })
})
```

```bash
bun test              # run once (RED/GREEN gate)
bun test --watch      # watch mode during development
bun test --coverage   # coverage report
```

- Mock modules with `mock.module(...)` / `mock(...)` from `bun:test` instead of `jest.mock(...)`.
- Configure coverage thresholds in `bunfig.toml` under `[test]` (e.g. `coverageThreshold`) rather than the Jest `coverageThresholds` config block.

