<script lang="ts">
    import { findAnagramPhrases } from "$lib/utils/anagram";
    import { customWords } from "$lib/data/customWords";
    import { Input, Textarea, ButtonGroup, Button, Label, Fileupload } from "flowbite-svelte";
    import toast, { Toaster } from "svelte-french-toast";
    import trie from "trie-prefix-tree";

    $: wordTrie = trie($customWords);

    let textareaprops = {
        id: "custom-words",
        name: "custom-words",
        label: "",
        rows: 10,
        columns: 30,
        placeholder: "Add your own custom words, one per line.",
    };

    let phrase = "";
    $: parsedPhrase = phrase.trim().toLowerCase();

    let customWordsInput = ``;
    let wordsFound: string[] = [];
    let phrasesFound: {
        words: string[];
        remaining: string[];
    }[] = [];

    customWords.subscribe((value) => {
        customWordsInput = value.join("\n");
    });

    const checkAnagramsPhrases = () => {
        wordsFound = wordTrie.getSubAnagrams(parsedPhrase);
        phrasesFound = findAnagramPhrases(parsedPhrase.replaceAll(" ", ""), $customWords);
        checkSuccess();
    };

    const checkSuccess = () => {
        if (!phrasesFound) return;
        if (!phrasesFound.length) {
            toast.error("No combinations found.", { duration: 1000 });
        }
    };

    const removeNonAlphanumeric = (str: string) => str.replace(/[^A-Za-z0-9 \n]/g, "");

    const convertSpaceToNewline = (str: string) => str.replace(/ /g, "\n");

    $: if (phrasesFound) console.log(phrasesFound);
    let files;

    $: if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            customWords.set(content.split("\n").filter((word) => word.trim().length > 1));
        };
        reader.readAsText(files[0]);
    }
</script>

<Toaster />
<div class="flex flex-col flex-shrink h-full max-w-3xl gap-4 py-6">
    <div class="flex flex-col gap-4">
        <span class="text-2xl text-center">Custom Wordlist Checker (wip)</span>
        <Input type="text" bind:value={phrase} placeholder="Enter a phrase" size="lg" class="!text-2xl" />
        <div class="p-4 space-y-2 bg-slate-300 rounded-xl">
            <Label>Replace wordlist from txt file (one entry per line)</Label>
            <Fileupload bind:files />
        </div>
    </div>
    <!-- {actualWords.join(", ")} -->
    <Textarea {...textareaprops} bind:value={customWordsInput} class="!text-2xl" />
    <div class="flex flex-col flex-none gap-2">
        <div class="flex flex-col">
            <Label>Format helpers</Label>
            <div class="flex">
                <ButtonGroup>
                    <Button on:click={() => (customWordsInput = removeNonAlphanumeric(customWordsInput))}>
                        Remove non-alphanumeric
                    </Button>
                    <Button on:click={() => (customWordsInput = convertSpaceToNewline(customWordsInput))}>
                        Space to newline
                    </Button>
                </ButtonGroup>
            </div>
        </div>
        <div class="flex justify-end">
            <Button color="blue" size="sm" on:click={() => customWords.set(customWordsInput.split("\n"))}>
                Save Changes
            </Button>
        </div>
    </div>
    <Button
        color="green"
        on:click={() => {
            checkAnagramsPhrases();
        }}
    >
        <span class="text-lg">Check</span>
    </Button>
    <div class="flex flex-col flex-shrink gap-4">
        <div class="flex flex-wrap gap-4 p-4 rounded bg-slate-100">
            {#if wordsFound.length}
                <span>{wordsFound.length} Words Found:</span>
                {#each wordsFound as word}
                    <div class="flex flex-wrap gap-2">
                        <span>{word}</span>
                    </div>
                {/each}
            {/if}
        </div>

        <div class="flex flex-wrap gap-4 p-4 rounded bg-slate-100">
            {#if phrasesFound.filter((p) => !p.remaining.length).length}
                <span>{phrasesFound.filter((p) => !p.remaining.length).length} Exact Combinations Found:</span>
                <div class="flex flex-wrap gap-4">
                    {#each phrasesFound.filter((p) => !p.remaining.length) as phrase, i}
                        <div class="flex gap-2 px-2 bg-gray-200 rounded">
                            {#each phrase.words as word}
                                <span>{word}</span>
                            {/each}
                            <div class="flex">
                                {#each phrase.remaining as remaining}
                                    <span class="text-red-300">{remaining}</span>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <div class="flex flex-wrap gap-4 p-4 rounded bg-slate-100">
            {#if phrasesFound.filter((p) => p.remaining.length).length}
                <span>{phrasesFound.filter((p) => p.remaining.length).length} Combinations with extra chars:</span>
                <div class="flex flex-wrap gap-4">
                    {#each phrasesFound.filter((p) => p.remaining.length) as phrase, i}
                        <div class="flex gap-2 px-2 bg-gray-200 rounded">
                            {#each phrase.words as word}
                                <span>{word}</span>
                            {/each}
                            <div class="flex">
                                {#each phrase.remaining as remaining}
                                    <span class="text-red-300">{remaining}</span>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
<div class="absolute bottom-0 right-0 max-w-[2rem]">
    <img src="hmmm.png" alt="" />
</div>
