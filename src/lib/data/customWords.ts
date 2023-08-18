import { writable } from "svelte/store";
import { browser } from "$app/environment";

const defaultValue = "[]";
const initialValue = browser
    ? JSON.parse(window.localStorage.getItem("custom-anagram-words") ?? defaultValue)
    : JSON.parse(defaultValue);

export const customWords = writable<string[]>(initialValue);

customWords.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem("custom-anagram-words", JSON.stringify(value));
    }
});
