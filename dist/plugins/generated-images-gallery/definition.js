import { z } from 'zod';
import { localized } from '../../contracts.js';
const configurationSchema = z.object({}).strict();
export const generatedImagesGalleryPlugin = {
    manifest: {
        schemaVersion: 1,
        id: 'generated-images-gallery',
        version: '1.0.0',
        title: localized('Generated Images', '生成图片', '生成圖片'),
        description: localized('Browse images generated in your conversations.', '浏览对话中生成的图片。', '瀏覽對話中生成的圖片。'),
        icon: 'albums-outline',
        featured: true,
        installedAction: 'open',
        entrypoint: { type: 'app-route', routeId: 'generated-images-gallery' },
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
//# sourceMappingURL=definition.js.map