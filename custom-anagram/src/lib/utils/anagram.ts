const preprocessWords = (words: string[]): Map<string, string[]> => {
    const preprocessed = new Map<string, string[]>();
    words.forEach((word) => {
        const sorted = [...word].sort().join("");
        const current = preprocessed.get(sorted) || [];
        current.push(word);
        preprocessed.set(sorted, current);
    });
    return preprocessed;
};

export const findAnagrams = (phrase: string, words: string[]): string[] => {
    const preprocessed = preprocessWords(words);
    const sortedPhrase = [...phrase].sort().join("");
    return preprocessed.get(sortedPhrase) || [];
};
