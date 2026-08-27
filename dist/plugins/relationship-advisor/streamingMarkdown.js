import remend from 'remend';
export function prepareRelationshipAdvisorStreamingMarkdown(markdown) {
    return remend(markdown, { linkMode: 'text-only' });
}
//# sourceMappingURL=streamingMarkdown.js.map