# Measured React performance

Read only for the related operation in the parent skill. This is a scoped, self-contained
summary of the locally maintained `eai-react-performance` responsibility, not that skill's entrypoint
or permission to invoke it. Parent snapshot restrictions and project authority apply.

Establish the user-visible symptom and a comparable baseline using the existing profiler/measurement tools. Trace rendering, data/network work and bundle cost before choosing an optimization. Consider state ownership, unnecessary effects, expensive computation and actual scheduling before adding memoization, virtualization or caching. Compare under equivalent data/device/environment conditions and preserve behavior/accessibility. Report measured improvement and remaining uncertainty; do not promise a performance gain from a pattern alone.

## Provenance

Replaces an older embedded ECC workflow snapshot with reconciled local guidance. Original
ECC attribution remains in the parent skill's ECC-LICENSE and UPSTREAM.md; selectively
adapted professional practices also retain [Matt Pocock's MIT notice](MATTPOCOCK-LICENSE.txt).
This summary does not require another installed skill or runtime.
