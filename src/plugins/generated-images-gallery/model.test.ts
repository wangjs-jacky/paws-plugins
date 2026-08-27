import { describe, expect, it } from 'vitest';

import { collectGeneratedImagesFromMessages } from './model.js';

function createFileMessage(id: string, input: Record<string, unknown>) {
    return {
        kind: 'tool-call',
        id,
        createdAt: id === 'newer' ? 2_000 : 1_000,
        tool: { name: 'file', input },
    };
}

describe('generated images gallery model', () => {
    it('collects generated images with prompt and image metadata', () => {
        const entries = collectGeneratedImagesFromMessages('session-1', 'Sketch Session', [
            createFileMessage('newer', {
                ref: 'blob://generated',
                name: 'generated.png',
                source: 'generated',
                prompt: 'draw a mountain',
                batchId: 'batch-1',
                localPath: '/Users/jacky/.happy/generated-images/batch-1/generated.png',
                image: { width: 1200, height: 900, thumbhash: 'abc' },
            }),
        ]);

        expect(entries).toEqual([expect.objectContaining({
            id: 'session-1:newer',
            ref: 'blob://generated',
            prompt: 'draw a mountain',
            width: 1200,
            height: 900,
            thumbhash: 'abc',
        })]);
    });

    it('keeps only recognized legacy GPT Image 2 file events', () => {
        const entries = collectGeneratedImagesFromMessages('session-1', 'Legacy Session', [
            createFileMessage('older', {
                ref: 'blob://legacy',
                name: 'gpt-image-2-legacy.png',
                image: { width: 800, height: 600 },
            }),
            createFileMessage('plain', {
                ref: 'blob://plain',
                name: 'photo.jpg',
                image: { width: 800, height: 600 },
            }),
        ]);

        expect(entries.map(({ id }) => id)).toEqual(['session-1:older']);
    });
});
