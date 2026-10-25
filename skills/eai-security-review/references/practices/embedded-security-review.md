# Security review context

Read only for the related operation in the parent skill. This is a scoped, self-contained
summary of the locally maintained `eai-security-review` responsibility, not that skill's entrypoint
or permission to invoke it. Parent snapshot restrictions and project authority apply.

Review the changed trust boundaries, authorization, input validation, output handling, data protection and failure behavior with actual evidence. Preserve least privilege and avoid logging secrets. Establish the applicable project/framework threat model and existing security checks; generic keyword searches are incomplete evidence. Do not conduct live exploitation, load tests, credential access or external submission outside the authorized scope. Report concrete affected scenarios, meaningful severity and verification limits rather than checklist-only compliance.

## Provenance

Replaces an older embedded ECC workflow snapshot with reconciled local guidance. Original
ECC attribution remains in the parent skill's ECC-LICENSE and UPSTREAM.md; selectively
adapted professional practices also retain [Matt Pocock's MIT notice](MATTPOCOCK-LICENSE.txt).
This summary does not require another installed skill or runtime.
