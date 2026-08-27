import { createHash } from 'node:crypto';

const semverPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const pluginIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function invariant(condition, message) {
    if (!condition) throw new Error(message);
}

export function validateRelease({ packageName, packageVersion, tag, commit, manifests }) {
    invariant(packageName === '@paws/plugins', `Unexpected package name: ${packageName}`);
    invariant(semverPattern.test(packageVersion), `Invalid package version: ${packageVersion}`);
    invariant(tag === `v${packageVersion}`, `Release tag ${tag} must equal v${packageVersion}`);
    invariant(/^[0-9a-f]{40}$/.test(commit), 'Release commit must be a full lowercase Git SHA');
    invariant(Array.isArray(manifests) && manifests.length > 0, 'Release catalog must contain plugins');

    const ids = new Set();
    for (const manifest of manifests) {
        invariant(manifest?.schemaVersion === 2, 'Every plugin must use manifest schemaVersion 2');
        invariant(pluginIdPattern.test(manifest.id), `Invalid plugin ID: ${String(manifest.id)}`);
        invariant(!ids.has(manifest.id), `Duplicate plugin ID: ${manifest.id}`);
        invariant(semverPattern.test(manifest.version), `Invalid version for plugin ${manifest.id}`);
        ids.add(manifest.id);
    }

    return manifests.map(({ id, version }) => ({ id, version }));
}

export function sha256(content) {
    return createHash('sha256').update(content).digest('hex');
}

export function createReleaseMetadata({
    packageName,
    packageVersion,
    tag,
    commit,
    plugins,
    packageArtifact,
    catalogArtifact,
}) {
    return {
        schemaVersion: 1,
        package: {
            name: packageName,
            version: packageVersion,
            filename: packageArtifact.filename,
            sha256: packageArtifact.sha256,
        },
        catalog: {
            filename: catalogArtifact.filename,
            sha256: catalogArtifact.sha256,
        },
        source: {
            repository: 'https://github.com/wangjs-jacky/paws-plugins',
            tag,
            commit,
        },
        plugins,
    };
}

export function formatChecksums(entries) {
    return [...entries]
        .sort((left, right) => left.filename.localeCompare(right.filename))
        .map(({ filename, sha256: digest }) => `${digest}  ${filename}`)
        .join('\n') + '\n';
}
