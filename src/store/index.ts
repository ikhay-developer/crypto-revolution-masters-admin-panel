import { writable } from "svelte/store"

const currentTab = writable("message")

const isNavBarMaximize = writable(true)

const isLogin = writable(true)

const addDataOption = writable({
    show: false,
    page: "none",
    input: {
        id: 1
    },
    output: null
})

export {
    currentTab,
    isNavBarMaximize,
    isLogin,
    addDataOption
}