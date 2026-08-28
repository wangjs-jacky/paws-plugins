import { z } from 'zod';

import { localized, type PluginPackageDefinition } from '../../contracts.js';

const configurationSchema = z.object({}).strict();

export const generatedImagesGalleryPlugin: PluginPackageDefinition = {
    manifest: {
        schemaVersion: 2,
        hostApiVersion: 1,
        id: 'generated-images-gallery',
        version: '1.1.1',
        title: localized('Generated Images', '生成图片', '生成圖片'),
        description: localized(
            'Browse images generated in your conversations.',
            '浏览对话中生成的图片。',
            '瀏覽對話中生成的圖片。',
        ),
        icon: 'albums-outline',
        featured: true,
        installedAction: 'open',
        permissions: ['paws.conversations.images.read'],
        entrypoint: { type: 'view', viewId: 'generated-images-gallery.browser' },
        contributes: {
            views: [
                {
                    id: 'generated-images-gallery.browser',
                    surface: 'page',
                    title: localized('Generated Images', '生成图片', '生成圖片'),
                    icon: 'albums-outline',
                },
                {
                    id: 'generated-images-gallery.session-images',
                    surface: 'right-panel',
                    title: localized('Session images', '会话图片', '對話圖片'),
                    icon: 'images-outline',
                },
            ],
        },
        configuration: { fields: [] },
    },
    normalizeConfiguration(configuration) {
        configurationSchema.parse(configuration);
        return {};
    },
    redactConfiguration() {
        return { configuration: {}, secretHints: {} };
    },
};
