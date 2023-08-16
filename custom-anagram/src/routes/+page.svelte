<script lang="ts">
    import { findAnagrams } from "$lib/utils/anagram";
    import { words } from "$lib/data/words";
    import { customWords } from "$lib/data/customWords";

    let phrase = "Diablo";

    let customWordsInput = ``;
    customWords.subscribe((value) => {
        // customWordsInput = value.join("\n");
    });

    const checkAnagrams = () => {
        let parsedPhrase = phrase.trim().toLowerCase();
        let combinedWords = words.concat(customWordsInput.split("\n"));
        actualWords = findAnagrams(parsedPhrase, combinedWords);
    };

    const removeNonAlphanumeric = (str: string) => str.replace(/[^A-Za-z0-9 ]/g, "");

    const convertSpaceToNewline = (str: string) => str.replace(/ /g, "\n");

    let actualWords: string[] = [];
    checkAnagrams();
</script>

<div class="container">
    <input type="text" bind:value={phrase} />

    {actualWords.join(", ")}

    <textarea bind:value={customWordsInput} name="custom-words" id="" cols="30" rows="10" />

    <div class="">
        <button on:click={() => (customWordsInput = removeNonAlphanumeric(customWordsInput))}>Remove non alpha</button>
        <button on:click={() => (customWordsInput = convertSpaceToNewline(customWordsInput))}>Space to newline</button>
        <button on:input={() => customWords.set(customWordsInput.split("\n"))}>
            <strong>Add Words To List</strong>
        </button>
        <button class="check" on:click={checkAnagrams}><strong>Check</strong></button>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
</style>
