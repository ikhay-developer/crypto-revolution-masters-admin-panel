import { writable } from "svelte/store"

const currentTab = writable("message")

const isNavBarMaximize = writable(true)

const isLogin = writable(false)

export {
    currentTab,
    isNavBarMaximize,
    isLogin
}