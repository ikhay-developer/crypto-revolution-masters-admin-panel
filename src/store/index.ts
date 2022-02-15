import { writable } from "svelte/store"

const currentTab = writable("message")

const isNavBarMaximize = writable(true)

export {
    currentTab,
    isNavBarMaximize
}