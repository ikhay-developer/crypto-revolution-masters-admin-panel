import { writable } from "svelte/store"

const currentTab = writable("message")

export {
    currentTab
}