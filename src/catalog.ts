import type { PluginPackageDefinition } from './contracts.js';
import { generatedImagesGalleryPlugin } from './plugins/generated-images-gallery/definition.js';
import { relationshipAdvisorPlugin } from './plugins/relationship-advisor/definition.js';

export type {
    PluginConfigurationField,
    PluginLocalizedText,
    PluginManifestV1,
    PluginPackageDefinition,
    RedactedPluginConfiguration,
} from './contracts.js';

export const pluginPackages: readonly PluginPackageDefinition[] = [
    relationshipAdvisorPlugin,
    generatedImagesGalleryPlugin,
];
