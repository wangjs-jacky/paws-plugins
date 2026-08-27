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

export interface PluginManifestV1 {
    schemaVersion: 1;
    id: string;
    version: string;
    title: PluginLocalizedText;
    description: PluginLocalizedText;
    icon: string;
    featured: boolean;
    installedAction: 'configure' | 'open';
    entrypoint: {
        type: 'app-route';
        routeId: string;
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
    manifest: PluginManifestV1;
    normalizeConfiguration: (configuration: Record<string, string>) => Record<string, string>;
    redactConfiguration: (configuration: Record<string, string>) => RedactedPluginConfiguration;
}

export function localized(defaultText: string, simplifiedChinese: string, traditionalChinese: string): PluginLocalizedText {
    return {
        default: defaultText,
        translations: {
            'zh-Hans': simplifiedChinese,
            'zh-Hant': traditionalChinese,
        },
    };
}
