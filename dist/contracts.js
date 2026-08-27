export function localized(defaultText, simplifiedChinese, traditionalChinese) {
    return {
        default: defaultText,
        translations: {
            'zh-Hans': simplifiedChinese,
            'zh-Hant': traditionalChinese,
        },
    };
}
//# sourceMappingURL=contracts.js.map