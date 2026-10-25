# Frontend patterns

Read only for the related operation in the parent skill. This is a scoped, self-contained
summary of the locally maintained `eai-frontend-patterns` responsibility, not that skill's entrypoint
or permission to invoke it. Parent snapshot restrictions and project authority apply.

Preserve the project's component/state architecture. Keep state at the narrowest useful owner, derive values where practical, and make effects synchronize external state rather than duplicate derivable values. Use semantic UI and actual framework conventions. Profile before adding memoization or caching; preserve correctness, loading/error/empty states, accessibility and documented APIs. Independent data access can be concurrent when ordering and failure semantics permit. Do not impose another project's layout or state library.

## Provenance

Replaces an older embedded ECC workflow snapshot with reconciled local guidance. Original
ECC attribution remains in the parent skill's ECC-LICENSE and UPSTREAM.md; selectively
adapted professional practices also retain [Matt Pocock's MIT notice](MATTPOCOCK-LICENSE.txt).
This summary does not require another installed skill or runtime.
