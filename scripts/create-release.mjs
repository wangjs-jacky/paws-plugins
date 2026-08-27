import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
    createReleaseMetadata,
    formatChecksums,
    sha256,
    validateRelease,
} from './releaseMetadata.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const outputDirectory = path.join(repositoryRoot, 'release');
const validateOnly = process.argv.includes('--validate-only');

async function readJson(filename) {
    return JSON.parse(await fs.readFile(path.join(repositoryRoot, filename), 'utf8'));
}

function gitCommit() {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
        cwd: repositoryRoot,
        encoding: 'utf8',
    }).trim();
}

const packageJson = await readJson('package.json');
const catalogModule = await import(pathToFileURL(path.join(repositoryRoot, 'dist/catalog.js')).href);
const manifests = catalogModule.pluginPackages.map(({ manifest }) => manifest);
const tag = process.env.RELEASE_TAG || `v${packageJson.version}`;
const commit = process.env.RELEASE_COMMIT || gitCommit();
const plugins = validateRelease({
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    tag,
    commit,
    manifests,
});

if (validateOnly) {
    process.stdout.write(`Validated ${tag}: ${plugins.map(({ id, version }) => `${id}@${version}`).join(', ')}\n`);
    process.exit(0);
}

await fs.rm(outputDirectory, { recursive: true, force: true });
await fs.mkdir(outputDirectory, { recursive: true });

const catalog = {
    schemaVersion: 1,
    releaseVersion: packageJson.version,
    plugins: manifests,
};
const catalogFilename = 'catalog.json';
const catalogContent = `${JSON.stringify(catalog, null, 2)}\n`;
await fs.writeFile(path.join(outputDirectory, catalogFilename), catalogContent);

execFileSync('pnpm', ['pack', '--pack-destination', outputDirectory], {
    cwd: repositoryRoot,
    stdio: 'inherit',
});

const packageFilenames = (await fs.readdir(outputDirectory)).filter((filename) => filename.endsWith('.tgz'));
if (packageFilenames.length !== 1) {
    throw new Error(`Expected one package artifact, found ${packageFilenames.length}`);
}
const packageFilename = packageFilenames[0];
const packageContent = await fs.readFile(path.join(outputDirectory, packageFilename));
const catalogDigest = sha256(catalogContent);
const packageDigest = sha256(packageContent);
const releaseMetadata = createReleaseMetadata({
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    tag,
    commit,
    plugins,
    packageArtifact: { filename: packageFilename, sha256: packageDigest },
    catalogArtifact: { filename: catalogFilename, sha256: catalogDigest },
});
const releaseFilename = 'release.json';
const releaseContent = `${JSON.stringify(releaseMetadata, null, 2)}\n`;
await fs.writeFile(path.join(outputDirectory, releaseFilename), releaseContent);
await fs.writeFile(path.join(outputDirectory, 'SHA256SUMS'), formatChecksums([
    { filename: catalogFilename, sha256: catalogDigest },
    { filename: packageFilename, sha256: packageDigest },
    { filename: releaseFilename, sha256: sha256(releaseContent) },
]));

process.stdout.write(`Created ${tag} artifacts in ${outputDirectory}\n`);
