export interface PluginLocalizedText {
    default: string;
    translations?: Record<string, string>;
}

export interface PluginConfigurationField {
    key: string;
    type: 'text' | 'url' | 'secret';
    required: boolean;
    label: PluginLocalizedText;
    placeholder?: PluginLocalizedText;
}

export type PluginPermission =
    | 'paws.ai.provider.invoke'
    | 'paws.secrets.use'
    | 'paws.conversations.images.read';

export type PluginViewSurface = 'page' | 'left-sidebar' | 'right-panel' | 'modal';

/**
 * A declarative UI contribution. The host resolves the stable view ID to a
 * trusted Adapter; manifests never contain executable code or remote URLs.
 */
export interface PluginViewContribution {
    id: string;
    surface: PluginViewSurface;
    title: PluginLocalizedText;
    icon?: string;
}

export interface PluginManifestV2 {
    schemaVersion: 2;
    hostApiVersion: 1;
    id: string;
    version: string;
    title: PluginLocalizedText;
    description: PluginLocalizedText;
    icon: string;
    featured: boolean;
    installedAction: 'configure' | 'open';
    permissions: PluginPermission[];
    entrypoint: {
        type: 'view';
        viewId: string;
    };
    contributes: {
        views: PluginViewContribution[];
    };
    configuration: {
        notice?: PluginLocalizedText;
        fields: PluginConfigurationField[];
    };
}

export interface RedactedPluginConfiguration {
    configuration: Record<string, string>;
    secretHints: Record<string, string>;
}

export interface PluginPackageDefinition {
    manifest: PluginManifestV2;
    normalizeConfiguration: (configuration: Record<string, string>) => Record<string, string>;
    redactConfiguration: (configuration: Record<string, string>) => RedactedPluginConfiguration;
}

export type PluginManifest = PluginManifestV2;

export function localized(defaultText: string, simplifiedChinese: string, traditionalChinese: string): PluginLocalizedText {
    return {
        default: defaultText,
        translations: {
            'zh-Hans': simplifiedChinese,
            'zh-Hant': traditionalChinese,
        },
    };
}
