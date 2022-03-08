import { writable } from "svelte/store"

const currentTab = writable("message")

const lastTab = writable("message")

const isNavBarMaximize = writable(true)

const isLogin = writable(false)

const addDataOption = writable({
    show: false,
    page: "none",
    input: null,
    output: null
})

export {
    currentTab,
    lastTab,
    isNavBarMaximize,
    isLogin,
    addDataOption
}