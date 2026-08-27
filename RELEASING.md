# Releasing Paws Plugins

[中文说明](RELEASING_CN.md)

## Version contract

- `package.json.version` is the repository package and GitHub Release version.
- Each plugin manifest has its own SemVer version. Change it only when that plugin's installed behavior or configuration contract changes.
- A release tag must be exactly `v<package.json.version>`.
- Published tags are immutable and must never be moved or reused.
- Paws consumes a full commit SHA. A release does not update Paws automatically.

## Release artifacts

Every GitHub Release contains:

- `paws-plugins-<version>.tgz`: the build-time package consumed by a Paws host;
- `catalog.json`: the declarative manifest catalog;
- `release.json`: package, source commit, artifact digests, and plugin versions;
- `SHA256SUMS`: SHA-256 digests for the package, catalog, and release metadata.

GitHub Actions also creates a build-provenance attestation for the package archive.

## Publishing

1. Update the affected plugin manifest versions and `CHANGELOG.md`.
2. Update `package.json.version` for every repository release.
3. Run `pnpm release:artifacts` and verify `release/SHA256SUMS`.
4. Commit and push `main`; wait for CI to pass.
5. Create and push an annotated tag:

   ```bash
   git tag -a vX.Y.Z -m "Paws Plugins vX.Y.Z"
   git push origin vX.Y.Z
   ```

6. Wait for the `Release` workflow and verify every GitHub Release asset and digest.
7. In Paws, update both `@paws/plugins` dependency declarations and `pnpm-lock.yaml` to the release's full commit SHA. Run the Paws cross-package checks before merging.

This workflow intentionally does not publish to npm. Adding npm distribution requires a separate provenance, token, namespace, and revocation decision.
