<script lang="ts">
    import { findAnagrams } from "$lib/utils/anagram";
    import { words } from "$lib/data/words";
    import { customWords } from "$lib/data/customWords";
    import { Input, Textarea, ButtonGroup, Button } from "flowbite-svelte";
    import toast, { Toaster } from "svelte-french-toast";
    // import hmmm from "../../static/hmmm.png";

    let textareaprops = {
        id: "custom-words",
        name: "custom-words",
        label: "",
        rows: 10,
        columns: 30,
        placeholder: "Add your own custom words, one per line.",
    };

    let phrase = "";

    let customWordsInput = ``;

    customWords.subscribe((value) => {
        customWordsInput = value.join("\n");
    });

    const checkAnagrams = () => {
        let parsedPhrase = phrase.trim().toLowerCase();
        let combinedWords = words.concat(customWordsInput.split("\n"));
        actualWords = findAnagrams(parsedPhrase, combinedWords);
        checkSuccess();
    };

    const checkSuccess = () => {
        if (!phrase) return;
        if (actualWords.length) {
            toast.success("Anagrams found!", { duration: 1000 });
        } else {
            toast.error("No anagrams found.", { duration: 1000 });
        }
    };

    const removeNonAlphanumeric = (str: string) => str.replace(/[^A-Za-z0-9 ]/g, "");

    const convertSpaceToNewline = (str: string) => str.replace(/ /g, "\n");

    let actualWords: string[] = [];
    checkAnagrams();
</script>

<Toaster />
<div class="flex flex-col gap-4 py-6">
    <span class="text-2xl text-center">Anagram checker</span>
    <Input type="text" bind:value={phrase} placeholder="Enter a phrase" size="lg" class="!text-2xl" />

    {actualWords.join(", ")}

    <Textarea {...textareaprops} bind:value={customWordsInput} class="!text-2xl" />
    <div class="flex flex-col gap-4">
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
        <div class="flex !w-full justify-end">
            <ButtonGroup class="items-stretch">
                <Button color="blue" on:click={() => customWords.set(customWordsInput.split("\n"))}>
                    Save Custom Dictionary
                </Button>
                <Button class="flex-0" color="green" on:click={checkAnagrams}>Check Anagrams</Button>
            </ButtonGroup>
        </div>
    </div>
</div>
<div class="absolute bottom-0 right-0 max-w-[2rem]">
    <img src="hmmm.png" alt="" />
</div>
<!-- <style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
    .buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
</style> -->
