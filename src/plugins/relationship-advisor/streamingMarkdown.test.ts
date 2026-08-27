import { describe, expect, it } from 'vitest';

import { prepareRelationshipAdvisorStreamingMarkdown } from './streamingMarkdown.js';

describe('prepareRelationshipAdvisorStreamingMarkdown', () => {
    it('closes incomplete markdown without creating a temporary clickable URL', () => {
        expect(prepareRelationshipAdvisorStreamingMarkdown('先看 **她的态度')).toBe('先看 **她的态度**');
        expect(prepareRelationshipAdvisorStreamingMarkdown('参考 [这段话](https://example.com')).toBe('参考 这段话');
    });
});
