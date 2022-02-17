<script lang="ts">
    import { isNavBarMaximize } from "../store"
    import { createEventDispatcher, onMount } from "svelte"
    
    let main:HTMLElement

    let dispatcher = createEventDispatcher()

    $:{ 
        if (main != undefined) {
            let screenType = getComputedStyle(main).getPropertyValue("--screen-type")
            if (screenType != "xs") {
                if ($isNavBarMaximize) {
                    if (screenType == "sm")
                        main.style.setProperty("--not-xs-screen-width", "200px")
                    else if (screenType == "md")
                        main.style.setProperty("--not-xs-screen-width", "240px")
                    else if (screenType == "lg")
                        main.style.setProperty("--not-xs-screen-width", "280px")
                    else  if (screenType == "xl")
                        main.style.setProperty("--not-xs-screen-width", "280px")
                } else if (!$isNavBarMaximize) {
                    main.style.setProperty("--not-xs-screen-width", "60px")
                }
            }
        }
    }

    onMount(() => {
        if (main != undefined) {
            let screenType = getComputedStyle(main).getPropertyValue("--screen-type")
            if (screenType != "xs") {
                if ($isNavBarMaximize) {
                    if (screenType == "sm")
                        main.style.setProperty("--not-xs-screen-width", "200px")
                    else if (screenType == "md")
                        main.style.setProperty("--not-xs-screen-width", "240px")
                    else if (screenType == "lg")
                        main.style.setProperty("--not-xs-screen-width", "280px")
                    else  if (screenType == "xl")
                        main.style.setProperty("--not-xs-screen-width", "280px")
                } else if (!$isNavBarMaximize) {
                    main.style.setProperty("--not-xs-screen-width", "60px")
                }
            }
        }
    })

    window.onresize = () => {
        if (main != undefined) {
            let screenType = getComputedStyle(main).getPropertyValue("--screen-type")
            if (screenType != "xs") {
                if ($isNavBarMaximize) {
                    if (screenType == "sm")
                        main.style.setProperty("--not-xs-screen-width", "200px")
                    else if (screenType == "md")
                        main.style.setProperty("--not-xs-screen-width", "240px")
                    else if (screenType == "lg")
                        main.style.setProperty("--not-xs-screen-width", "280px")
                    else  if (screenType == "xl")
                        main.style.setProperty("--not-xs-screen-width", "280px")
                } else if (!$isNavBarMaximize) {
                    main.style.setProperty("--not-xs-screen-width", "60px")
                }
            }
        }
    }

    </script>
    
    <main on:scroll={e => dispatcher("scroll", e)} bind:this={main}>
        <slot></slot>
    </main>
    
    <style lang="less" scoped>
        .nav-not-xs() {
            height: 100%;
            left: var(--not-xs-screen-width);
            top: 0;
            width: calc(100% - var(--not-xs-screen-width));
        }
        main {
            position: fixed;
            align-content: center;
            --screen-type: lg;
            --not-xs-screen-width: 280px;
            @media only screen and (max-width: 600px) {
                & {
                    width: 100%;
                    height: calc(100% - 45px);
                    left: 0;
                    top: 45px;
                    --screen-type: xs;
                }
            }
            @media only screen and (min-width: 600px) {
                & {
                    --screen-type: sm;
                    .nav-not-xs()
                }
            }
            @media only screen and (min-width: 768px) { 
                & {
                    --screen-type: md;
                    .nav-not-xs()
                }
            }
            @media only screen and (min-width: 992px) {
                & {
                    --screen-type: lg;
                    .nav-not-xs()
                }
            }
            @media only screen and (min-width: 1200px) {
                & {
                    --screen-type: xl;
                    .nav-not-xs()
                }
            }
        }
    </style>