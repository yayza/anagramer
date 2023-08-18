export const findCombinations = (inputString: string, wordList: string[]) => {
    const results = new Set<string>();

    const addResult = (usedWords: string[], remainingLetters: string[]) => {
        if (usedWords.length < 2) return;

        results.add(
            JSON.stringify({
                words: [...usedWords].sort(),
                remaining: remainingLetters,
            })
        );
    };

    const findWords = (remainingLetters: string[], usedWords: string[]) => {
        addResult(usedWords, remainingLetters);

        if (remainingLetters.length === 0) {
            return;
        }

        for (const word of wordList) {
            if (usedWords.includes(word)) continue;

            const newRemainingLetters = [...remainingLetters];
            let canUseWord = true;

            for (const char of word) {
                const index = newRemainingLetters.indexOf(char);
                if (index === -1) {
                    canUseWord = false;
                    break;
                }
                newRemainingLetters.splice(index, 1);
            }

            if (canUseWord) {
                findWords(newRemainingLetters, [...usedWords, word]);
            }
        }
    };

    findWords(inputString.split(""), []);

    return Array.from(results).map((result) => JSON.parse(result));
};
