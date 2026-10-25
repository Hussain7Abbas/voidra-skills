# End-to-end evidence

Read only for the related operation in the parent skill. This is a scoped, self-contained
summary of the locally maintained `eai-e2e-testing` responsibility, not that skill's entrypoint
or permission to invoke it. Parent snapshot restrictions and project authority apply.

Select meaningful user journeys and the project's existing runner. Prefer stable semantic selectors, isolated fixtures and explicit waits for observable state over sleeps. State which services are real and which are faked; a mocked UI test cannot prove provider compatibility. Cover important rejection and boundary paths, record actual execution and retain useful diagnostics with secrets redacted. Meet project gates without inventing universal coverage percentages or changing live data.

## Provenance

Replaces an older embedded ECC workflow snapshot with reconciled local guidance. Original
ECC attribution remains in the parent skill's ECC-LICENSE and UPSTREAM.md; selectively
adapted professional practices also retain [Matt Pocock's MIT notice](MATTPOCOCK-LICENSE.txt).
This summary does not require another installed skill or runtime.
