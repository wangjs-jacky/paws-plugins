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

    it('declares host API permissions and UI contributions without executable entrypoints', () => {
        const advisor = pluginPackages.find(({ manifest }) => manifest.id === 'relationship-advisor');
        const gallery = pluginPackages.find(({ manifest }) => manifest.id === 'generated-images-gallery');

        expect(advisor!.manifest).toMatchObject({
            schemaVersion: 2,
            hostApiVersion: 1,
            permissions: [
                'paws.ai.provider.invoke',
                'paws.secrets.use',
                'paws.conversations.images.read',
            ],
            entrypoint: { type: 'view', viewId: 'relationship-advisor.chat' },
            contributes: {
                views: expect.arrayContaining([
                    expect.objectContaining({ id: 'relationship-advisor.chat', surface: 'page' }),
                    expect.objectContaining({ id: 'relationship-advisor.history', surface: 'left-sidebar' }),
                    expect.objectContaining({ id: 'relationship-advisor.configuration', surface: 'modal' }),
                ]),
            },
        });
        expect(gallery!.manifest).toMatchObject({
            schemaVersion: 2,
            hostApiVersion: 1,
            permissions: ['paws.conversations.images.read'],
            entrypoint: { type: 'view', viewId: 'generated-images-gallery.browser' },
            contributes: {
                views: expect.arrayContaining([
                    expect.objectContaining({ id: 'generated-images-gallery.browser', surface: 'page' }),
                    expect.objectContaining({ id: 'generated-images-gallery.session-images', surface: 'right-panel' }),
                ]),
            },
        });

        for (const plugin of pluginPackages) {
            expect(JSON.stringify(plugin.manifest)).not.toMatch(/javascript:|https?:\/\/.*\.(m?js|tsx?)/i);
            const viewIds = plugin.manifest.contributes.views.map((view) => view.id);
            expect(new Set(viewIds).size).toBe(viewIds.length);
            expect(viewIds).toContain(plugin.manifest.entrypoint.viewId);
        }
    });
});
