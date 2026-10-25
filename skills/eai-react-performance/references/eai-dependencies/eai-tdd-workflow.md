# Test-first behavior

Read only for the related operation in the parent skill. This is a scoped, self-contained
summary of the locally maintained `eai-tdd-workflow` responsibility, not that skill's entrypoint
or permission to invoke it. Parent snapshot restrictions and project authority apply.

Inspect the actual runner and project gates. Plan useful cases, then implement one behavior through an observed relevant RED, minimal GREEN and behavior-preserving refactor. Expected values come from an independent contract/example/property rather than recomputing the implementation. Legitimate focused internal tests, adapter contracts and integration tests protect different risks. Coverage follows project metric/scope/gates, not a universal 80/90/100 percent. Record real evidence; no implicit sibling activation, checkpoint commit or installed reviewer is required.

## Provenance

Replaces an older embedded ECC workflow snapshot with reconciled local guidance. Original
ECC attribution remains in the parent skill's ECC-LICENSE and UPSTREAM.md; selectively
adapted professional practices also retain [Matt Pocock's MIT notice](MATTPOCOCK-LICENSE.txt).
This summary does not require another installed skill or runtime.
