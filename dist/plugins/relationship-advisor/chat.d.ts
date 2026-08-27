export type RelationshipAdvisorEvent = {
    requestId: string;
    type: 'accepted';
} | {
    requestId: string;
    type: 'delta';
    text: string;
} | {
    requestId: string;
    type: 'done';
} | {
    requestId: string;
    type: 'error';
    error: string;
};
export interface RelationshipAdvisorChatMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    createdAt: number;
    imageCount: number;
}
export interface RelationshipAdvisorChatState {
    messages: RelationshipAdvisorChatMessage[];
    activeRequestId: string | null;
    streamingText: string;
    error: string | null;
}
export type RelationshipAdvisorChatAction = {
    type: 'start';
    requestId: string;
    message: RelationshipAdvisorChatMessage;
    appendMessage?: boolean;
} | {
    type: 'cancel-before-start';
    requestId: string;
} | {
    type: 'fail-before-start';
    requestId: string;
    error: string;
} | {
    type: 'event';
    event: RelationshipAdvisorEvent;
    completedAt?: number;
} | {
    type: 'reset';
    messages: RelationshipAdvisorChatMessage[];
};
export interface RelationshipAdvisorConversation {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    messages: RelationshipAdvisorChatMessage[];
}
export declare const MAX_RELATIONSHIP_ADVISOR_CONVERSATIONS = 30;
export declare const MAX_RELATIONSHIP_ADVISOR_MESSAGES = 50;
export declare const MAX_RELATIONSHIP_ADVISOR_HISTORY_CHARACTERS = 250000;
export declare function shouldShowRelationshipAdvisorEmptyState(state: RelationshipAdvisorChatState): boolean;
export declare function relationshipAdvisorChatReducer(state: RelationshipAdvisorChatState, action: RelationshipAdvisorChatAction): RelationshipAdvisorChatState;
export declare function createRelationshipAdvisorConversation(id: string, title: string, now?: number): RelationshipAdvisorConversation;
export declare function buildRelationshipAdvisorConversationTitle(messages: RelationshipAdvisorChatMessage[], fallback?: string): string;
export declare function saveRelationshipAdvisorConversation(conversations: RelationshipAdvisorConversation[], conversation: RelationshipAdvisorConversation): RelationshipAdvisorConversation[];
export declare function limitRelationshipAdvisorConversations(conversations: RelationshipAdvisorConversation[]): RelationshipAdvisorConversation[];
export declare function removeRelationshipAdvisorConversation(conversations: RelationshipAdvisorConversation[], conversationId: string): RelationshipAdvisorConversation[];
