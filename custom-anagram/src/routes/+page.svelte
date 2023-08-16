<script lang="ts">
    import { findAnagrams } from "$lib/utils/anagram";
    import { words } from "$lib/data/words";
    import { customWords } from "$lib/data/customWords";

    let phrase = "Diablo";

    let customWordsInput = "";
    customWords.subscribe((value) => {
        customWordsInput = value.join("\n");
    });

    const checkAnagrams = () => {
        let parsedPhrase = phrase.trim().toLowerCase();
        let combinedWords = words.concat(customWordsInput.split("\n"));
        actualWords = findAnagrams(parsedPhrase, combinedWords);
    };

    let actualWords: string[] = [];
    checkAnagrams();
</script>

<div class="container">
    <input type="text" bind:value={phrase} />

    {actualWords.join(", ")}

    <textarea
        bind:value={customWordsInput}
        name="customw-words"
        id=""
        cols="30"
        rows="10"
        on:input={() => customWords.set(customWordsInput.split("\n"))}
    />

    <button on:click={checkAnagrams}>Check</button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
</style>
