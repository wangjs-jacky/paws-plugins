import { describe, expect, it } from 'vitest';

import {
    createReleaseMetadata,
    formatChecksums,
    sha256,
    validateRelease,
} from './releaseMetadata.mjs';

const manifests = [
    { schemaVersion: 1, id: 'relationship-advisor', version: '1.0.0' },
    { schemaVersion: 1, id: 'generated-images-gallery', version: '1.0.0' },
];

describe('release metadata', () => {
    it('accepts a matching repository tag and returns plugin versions', () => {
        expect(validateRelease({
            packageName: '@paws/plugins',
            packageVersion: '0.1.0',
            tag: 'v0.1.0',
            commit: 'a'.repeat(40),
            manifests,
        })).toEqual([
            { id: 'relationship-advisor', version: '1.0.0' },
            { id: 'generated-images-gallery', version: '1.0.0' },
        ]);
    });

    it('rejects mismatched tags, duplicate IDs, and invalid plugin versions', () => {
        const release = {
            packageName: '@paws/plugins',
            packageVersion: '0.1.0',
            tag: 'v0.2.0',
            commit: 'b'.repeat(40),
            manifests,
        };
        expect(() => validateRelease(release)).toThrow('must equal v0.1.0');
        expect(() => validateRelease({
            ...release,
            tag: 'v0.1.0',
            manifests: [manifests[0], manifests[0]],
        })).toThrow('Duplicate plugin ID');
        expect(() => validateRelease({
            ...release,
            tag: 'v0.1.0',
            manifests: [{ ...manifests[0], version: 'latest' }],
        })).toThrow('Invalid version');
    });

    it('builds deterministic checksums and machine-readable metadata', () => {
        const metadata = createReleaseMetadata({
            packageName: '@paws/plugins',
            packageVersion: '0.1.0',
            tag: 'v0.1.0',
            commit: 'c'.repeat(40),
            plugins: [{ id: 'relationship-advisor', version: '1.0.0' }],
            packageArtifact: { filename: 'plugins.tgz', sha256: sha256('package') },
            catalogArtifact: { filename: 'catalog.json', sha256: sha256('catalog') },
        });

        expect(metadata.source.tag).toBe('v0.1.0');
        expect(metadata.plugins).toEqual([{ id: 'relationship-advisor', version: '1.0.0' }]);
        expect(formatChecksums([
            { filename: 'plugins.tgz', sha256: 'b' },
            { filename: 'catalog.json', sha256: 'a' },
        ])).toBe('a  catalog.json\nb  plugins.tgz\n');
    });
});
