export interface GeneratedImageEntry {
    id: string;
    sessionId: string;
    sessionTitle: string;
    messageId: string;
    ref: string;
    name: string;
    createdAt: number;
    prompt?: string;
    batchId?: string;
    localPath?: string;
    width?: number;
    height?: number;
    thumbhash?: string;
}
export interface GeneratedImageMessage {
    id: string;
    createdAt: number;
    kind: string;
    tool?: {
        name: string;
        input: unknown;
    };
}
export declare function isGeneratedImageFileInput(input: unknown): boolean;
export declare function collectGeneratedImagesFromMessages(sessionId: string, title: string, messages: GeneratedImageMessage[]): GeneratedImageEntry[];
