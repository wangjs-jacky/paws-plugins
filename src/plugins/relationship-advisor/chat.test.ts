import { describe, expect, it } from 'vitest';

import {
    buildRelationshipAdvisorConversationTitle,
    MAX_RELATIONSHIP_ADVISOR_HISTORY_CHARACTERS,
    relationshipAdvisorChatReducer,
    saveRelationshipAdvisorConversation,
    shouldShowRelationshipAdvisorEmptyState,
    type RelationshipAdvisorChatState,
} from './chat.js';

describe('relationship advisor chat model', () => {
    it('builds one streaming assistant message and commits it on done', () => {
        const initial: RelationshipAdvisorChatState = {
            messages: [],
            activeRequestId: null,
            streamingText: '',
            error: null,
        };
        const started = relationshipAdvisorChatReducer(initial, {
            type: 'start',
            requestId: 'request-1',
            message: { id: 'user-1', role: 'user', text: '她只回了哈哈', createdAt: 1, imageCount: 0 },
        });
        const delta = relationshipAdvisorChatReducer(started, {
            type: 'event',
            event: { requestId: 'request-1', type: 'delta', text: '先别追问。' },
        });
        const done = relationshipAdvisorChatReducer(delta, {
            type: 'event',
            event: { requestId: 'request-1', type: 'done' },
            completedAt: 2,
        });

        expect(done.messages.at(-1)).toEqual({
            id: 'assistant-request-1',
            role: 'assistant',
            text: '先别追问。',
            createdAt: 2,
            imageCount: 0,
        });
        expect(shouldShowRelationshipAdvisorEmptyState(done)).toBe(false);
    });

    it('compacts titles and enforces the local history budget', () => {
        expect(buildRelationshipAdvisorConversationTitle([
            { id: 'user-1', role: 'user', text: '  她突然问我\n周末有没有空  ', createdAt: 1, imageCount: 0 },
        ])).toBe('她突然问我 周末有没有空');

        const oversized = 'x'.repeat(MAX_RELATIONSHIP_ADVISOR_HISTORY_CHARACTERS);
        const saved = saveRelationshipAdvisorConversation([], {
            id: 'large',
            title: 'Large',
            createdAt: 1,
            updatedAt: 2,
            messages: [
                { id: 'old', role: 'user', text: oversized, createdAt: 1, imageCount: 0 },
                { id: 'new', role: 'assistant', text: 'latest', createdAt: 2, imageCount: 0 },
            ],
        });

        expect(saved[0]?.messages.map(({ id }) => id)).toEqual(['new']);
    });
});
