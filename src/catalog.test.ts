import { describe, expect, it } from 'vitest';

import { pluginPackages } from './catalog.js';

describe('plugin catalog', () => {
    it('contains stable unique plugin IDs', () => {
        const ids = pluginPackages.map(({ manifest }) => manifest.id);

        expect(ids).toEqual(['relationship-advisor', 'generated-images-gallery']);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('normalizes relationship advisor configuration without exposing its secret', () => {
        const plugin = pluginPackages.find(({ manifest }) => manifest.id === 'relationship-advisor');
        expect(plugin).toBeDefined();

        const configuration = plugin!.normalizeConfiguration({
            apiKey: '  sk-secret-1234  ',
            baseUrl: 'https://api.example.com/v1/',
            model: ' example-chat ',
        });
        const publicConfiguration = plugin!.redactConfiguration(configuration);

        expect(configuration).toEqual({
            apiKey: 'sk-secret-1234',
            baseUrl: 'https://api.example.com/v1',
            model: 'example-chat',
        });
        expect(publicConfiguration).toEqual({
            configuration: {
                baseUrl: 'https://api.example.com/v1',
                model: 'example-chat',
            },
            secretHints: { apiKey: '1234' },
        });
        expect(JSON.stringify(publicConfiguration)).not.toContain('sk-secret');
    });

    it('rejects unknown configuration fields', () => {
        const gallery = pluginPackages.find(({ manifest }) => manifest.id === 'generated-images-gallery');

        expect(() => gallery!.normalizeConfiguration({ source: 'javascript:alert(1)' })).toThrow();
    });
});
