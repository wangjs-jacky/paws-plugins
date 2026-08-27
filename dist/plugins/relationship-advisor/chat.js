export const MAX_RELATIONSHIP_ADVISOR_CONVERSATIONS = 30;
export const MAX_RELATIONSHIP_ADVISOR_MESSAGES = 50;
export const MAX_RELATIONSHIP_ADVISOR_HISTORY_CHARACTERS = 250_000;
export function shouldShowRelationshipAdvisorEmptyState(state) {
    return state.messages.length === 0 && !state.activeRequestId && !state.error;
}
export function relationshipAdvisorChatReducer(state, action) {
    if (action.type === 'reset') {
        return { messages: action.messages, activeRequestId: null, streamingText: '', error: null };
    }
    if (action.type === 'start') {
        return {
            messages: action.appendMessage === false ? state.messages : [...state.messages.slice(-49), action.message],
            activeRequestId: action.requestId,
            streamingText: '',
            error: null,
        };
    }
    if (action.type === 'cancel-before-start' || action.type === 'fail-before-start') {
        if (state.activeRequestId !== action.requestId)
            return state;
        return {
            messages: state.messages.filter((message) => message.id !== `user-${action.requestId}`),
            activeRequestId: null,
            streamingText: '',
            error: action.type === 'fail-before-start' ? action.error : null,
        };
    }
    if (action.event.requestId !== state.activeRequestId)
        return state;
    if (action.event.type === 'accepted')
        return state;
    if (action.event.type === 'delta')
        return { ...state, streamingText: state.streamingText + action.event.text };
    if (action.event.type === 'error') {
        const partialMessage = state.streamingText
            ? {
                id: `assistant-${action.event.requestId}`,
                role: 'assistant',
                text: state.streamingText,
                createdAt: action.completedAt ?? Date.now(),
                imageCount: 0,
            }
            : null;
        return {
            ...state,
            messages: partialMessage ? [...state.messages.slice(-49), partialMessage] : state.messages,
            activeRequestId: null,
            streamingText: '',
            error: action.event.error,
        };
    }
    const assistantMessage = state.streamingText
        ? {
            id: `assistant-${action.event.requestId}`,
            role: 'assistant',
            text: state.streamingText,
            createdAt: action.completedAt ?? Date.now(),
            imageCount: 0,
        }
        : null;
    return {
        messages: assistantMessage ? [...state.messages.slice(-49), assistantMessage] : state.messages,
        activeRequestId: null,
        streamingText: '',
        error: null,
    };
}
export function createRelationshipAdvisorConversation(id, title, now = Date.now()) {
    return { id, title, createdAt: now, updatedAt: now, messages: [] };
}
export function buildRelationshipAdvisorConversationTitle(messages, fallback = '') {
    const source = messages.find((message) => message.role === 'user' && message.text.trim())?.text ?? fallback;
    const compact = source.replace(/\s+/g, ' ').trim();
    if (!compact)
        return fallback;
    return compact.length > 36 ? `${compact.slice(0, 36).trimEnd()}...` : compact;
}
export function saveRelationshipAdvisorConversation(conversations, conversation) {
    return limitRelationshipAdvisorConversations([conversation, ...conversations.filter(({ id }) => id !== conversation.id)]
        .sort((left, right) => right.updatedAt - left.updatedAt)
        .slice(0, MAX_RELATIONSHIP_ADVISOR_CONVERSATIONS));
}
export function limitRelationshipAdvisorConversations(conversations) {
    let remaining = MAX_RELATIONSHIP_ADVISOR_HISTORY_CHARACTERS;
    return conversations.slice(0, MAX_RELATIONSHIP_ADVISOR_CONVERSATIONS).map((conversation) => {
        remaining = Math.max(0, remaining - conversation.title.length);
        const messages = [];
        for (const message of conversation.messages.slice(-MAX_RELATIONSHIP_ADVISOR_MESSAGES).reverse()) {
            if (message.text.length > remaining) {
                remaining = 0;
                break;
            }
            messages.push(message);
            remaining -= message.text.length;
        }
        return { ...conversation, messages: messages.reverse() };
    });
}
export function removeRelationshipAdvisorConversation(conversations, conversationId) {
    return conversations.filter(({ id }) => id !== conversationId);
}
//# sourceMappingURL=chat.js.map