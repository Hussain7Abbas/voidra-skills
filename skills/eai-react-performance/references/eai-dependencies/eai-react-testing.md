# React test evidence

Read only for the related operation in the parent skill. This is a scoped, self-contained
summary of the locally maintained `eai-react-testing` responsibility, not that skill's entrypoint
or permission to invoke it. Parent snapshot restrictions and project authority apply.

Use the actual runner and testing library, exercising behavior through accessible interactions where possible. Cover meaningful rendering, events, async states and relevant integration boundaries. Use real providers/router state when they establish the behavior; mocks must not silently replace the contract being verified. Preserve independently expected results, proportionate unit/integration/E2E evidence and project-selected coverage gates. Review inline unless native independent review is available and authorized; no named upstream reviewer agent is required.

## Provenance

Replaces an older embedded ECC workflow snapshot with reconciled local guidance. Original
ECC attribution remains in the parent skill's ECC-LICENSE and UPSTREAM.md; selectively
adapted professional practices also retain [Matt Pocock's MIT notice](MATTPOCOCK-LICENSE.txt).
This summary does not require another installed skill or runtime.
