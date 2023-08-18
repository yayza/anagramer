export const preprocessWords = (words: string[]): Map<string, string[]> => {
    const anagramMap = new Map<string, string[]>();
    words.forEach((word) => {
        const sortedWord = [...word].sort().join("");
        if (word.length <= sortedWord.length) {
            const anagrams = anagramMap.get(sortedWord) || [];
            anagrams.push(word);
            anagramMap.set(sortedWord, anagrams);
        }
    });
    return anagramMap;
};

export const findAnagrams = (phrase: string, words: string[]): string[] => {
    const preprocessed = preprocessWords(words);
    const sortedPhrase = [...phrase].sort().join("");
    return preprocessed.get(sortedPhrase) || [];
};

export function findCombinations(input, words) {
    const memo = new Map();

    function helper(remaining) {
        if (remaining === "") return [[]];
        if (memo.has(remaining)) return memo.get(remaining);

        const combinations = [];
        for (const word of words) {
            let newRemaining = remaining;
            let canUseWord = true;

            for (const char of word) {
                const index = newRemaining.indexOf(char);
                if (index !== -1) {
                    newRemaining = newRemaining.slice(0, index) + newRemaining.slice(index + 1);
                } else {
                    canUseWord = false;
                    break;
                }
            }

            if (canUseWord) {
                const subCombinations = helper(newRemaining);
                for (const subCombination of subCombinations) {
                    combinations.push([word, ...subCombination]);
                }
            }
        }

        memo.set(remaining, combinations);
        return combinations;
    }

    return helper(input);
}

export const getCombinations = (words: string[], input: string) => {
    const results: string[][] = [];

    const helper = (current: string[], remainingChars: string[]) => {
        if (remainingChars.length === 0 && current.join("").length === input.length) {
            results.push(current);
            return;
        }

        for (let word of words) {
            const newRemainingChars = [...remainingChars];
            let valid = true;

            // Check if this word can be used
            for (let char of word) {
                const index = newRemainingChars.indexOf(char);
                if (index === -1) {
                    valid = false;
                    break;
                }
                newRemainingChars.splice(index, 1);
            }

            if (valid) {
                helper([...current, word], newRemainingChars);
            }
        }
    };

    helper([], input.split(""));

    return results;
};

class TrieNode {
    isWord: boolean;
    children: Map<string, TrieNode>;

    constructor() {
        this.isWord = false;
        this.children = new Map();
    }
}

const insertWord = (root: TrieNode, word: string): void => {
    let node = root;
    for (const char of word) {
        if (!node.children.has(char)) {
            node.children.set(char, new TrieNode());
        }
        node = node.children.get(char)!;
    }
    node.isWord = true;
};

const buildTrie = (words: string[]): TrieNode => {
    const root = new TrieNode();
    for (const word of words) {
        insertWord(root, word);
    }
    return root;
};

export const findAnagramPhrases = (phrase: string, words: string[]) => {
    const results: { words: string[]; remaining: string[] }[] = [];
    const uniqueCombinations = new Set<string>();

    const backtrack = (currentWords: string[], remainingChars: Record<string, number>) => {
        const sortedWords = [...currentWords].sort().join(",");
        if (!uniqueCombinations.has(sortedWords)) {
            uniqueCombinations.add(sortedWords);
            const remaining = Object.keys(remainingChars).reduce(
                (acc, char) => acc + char.repeat(remainingChars[char]),
                ""
            );
            results.push({ words: currentWords, remaining: remaining.split("") });
        }

        for (const word of words) {
            let validWord = true;
            const newRemainingChars = { ...remainingChars };
            for (const char of word) {
                if (newRemainingChars[char] > 0) {
                    newRemainingChars[char]--;
                } else {
                    validWord = false;
                    break;
                }
            }
            if (validWord) {
                backtrack([...currentWords, word], newRemainingChars);
            }
        }
    };

    const charCount = Array.from(phrase).reduce((acc, char) => {
        acc[char] = (acc[char] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    backtrack([], charCount);

    return results;
};
