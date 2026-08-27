import { z } from 'zod';

import {
    localized,
    type PluginManifestV2,
    type PluginPackageDefinition,
} from '../../contracts.js';

const providerBaseUrlSchema = z.string().trim().url().max(2_000).refine((value) => {
    const url = new URL(value);
    return url.protocol === 'https:'
        && !url.username
        && !url.password
        && !url.search
        && !url.hash;
}, 'Provider URL must be a credential-free HTTPS URL');

const relationshipAdvisorConfigurationSchema = z.object({
    apiKey: z.string().trim().min(1).max(500),
    baseUrl: providerBaseUrlSchema,
    model: z.string().trim().min(1).max(200),
}).strict();

const manifest: PluginManifestV2 = {
    schemaVersion: 2,
    hostApiVersion: 1,
    id: 'relationship-advisor',
    version: '1.1.0',
    title: localized('Relationship Advisor', '狗头军师', '狗頭軍師'),
    description: localized(
        'Analyze conversations and get advice using your configured AI provider.',
        '使用你配置的 AI 提供商分析对话并获取建议。',
        '使用你設定的 AI 供應商分析對話並取得建議。',
    ),
    icon: 'chatbubbles-outline',
    featured: true,
    installedAction: 'configure',
    permissions: [
        'paws.ai.provider.invoke',
        'paws.secrets.use',
        'paws.conversations.images.read',
    ],
    entrypoint: { type: 'view', viewId: 'relationship-advisor.chat' },
    contributes: {
        views: [
            {
                id: 'relationship-advisor.chat',
                surface: 'page',
                title: localized('Relationship Advisor', '狗头军师', '狗頭軍師'),
                icon: 'chatbubbles-outline',
            },
            {
                id: 'relationship-advisor.history',
                surface: 'left-sidebar',
                title: localized('Advisor history', '军师对话记录', '軍師對話記錄'),
                icon: 'chatbubbles-outline',
            },
            {
                id: 'relationship-advisor.configuration',
                surface: 'modal',
                title: localized('Advisor configuration', '军师配置', '軍師設定'),
                icon: 'settings-outline',
            },
        ],
    },
    configuration: {
        notice: localized(
            'Your configuration, including the API key, is encrypted and stored on your Paws server.',
            '包括 API 密钥在内的配置会加密保存在你的 Paws 服务器中。',
            '包括 API 金鑰在內的設定會加密儲存在你的 Paws 伺服器中。',
        ),
        fields: [
            {
                key: 'apiKey',
                type: 'secret',
                required: true,
                label: localized('API key', 'API 密钥', 'API 金鑰'),
                placeholder: localized('Enter API key', '输入 API 密钥', '輸入 API 金鑰'),
            },
            {
                key: 'baseUrl',
                type: 'url',
                required: true,
                label: localized('Provider URL', '提供商地址', '供應商網址'),
                placeholder: { default: 'https://api.openai.com/v1' },
            },
            {
                key: 'model',
                type: 'text',
                required: true,
                label: localized('Model', '模型', '模型'),
                placeholder: { default: 'gpt-4.1-mini' },
            },
        ],
    },
};

export const relationshipAdvisorPlugin: PluginPackageDefinition = {
    manifest,
    normalizeConfiguration(configuration) {
        const parsed = relationshipAdvisorConfigurationSchema.parse(configuration);
        return {
            apiKey: parsed.apiKey,
            baseUrl: parsed.baseUrl.replace(/\/+$/, ''),
            model: parsed.model,
        };
    },
    redactConfiguration(configuration) {
        const parsed = relationshipAdvisorConfigurationSchema.parse(configuration);
        return {
            configuration: {
                baseUrl: parsed.baseUrl,
                model: parsed.model,
            },
            secretHints: {
                apiKey: parsed.apiKey.length > 4 ? parsed.apiKey.slice(-4) : '••••',
            },
        };
    },
};
