<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte"
    
    export let placeholder = "search"

    export let searchWidth = "300px"

    let searchBar:HTMLDivElement = null

    const dispatcher = createEventDispatcher()

    onMount(() => {
        if (searchBar != null)
            searchBar.style.width = searchWidth
    })

    let searchValue:string = String()

    $:imgSrc = searchValue != String() ? "./img/x.svg":"./img/search.svg"
</script>

<div class="search-bar-container" bind:this={searchBar}>
    <div class="search-bar">
        <img 
            src={imgSrc} 
            alt="search" 
            on:click={_ => {
                if (searchValue != String()) {
                    searchValue = String()
                }
            }}
        >
        <input on:input={_ => dispatcher("input", searchValue)} type="text" bind:value={searchValue} {placeholder}>
    </div>
</div>

<style scoped lang="less">
    div.search-bar-container {
        height: fit-content;
        border-style: solid;
        border-width: 1px;
        border-bottom-width: 0px;
        border-color: #d6d6d6;
        background-color: #eeeeee;
        div.search-bar {
            width: calc(100% - 30px);
            height: 33px;
            padding: 5px;
            padding-left: 15px;
            padding-right: 15px;
            border-style: solid;
            border-width: 0;
            font-size: 20px;
            border-bottom-width: 1px;
            border-color: #d6d6d6;
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            align-content: center;
            justify-content: flex-start;
            img {
                width: 18px;
                height: 18px;
                margin-right: 8px;
            }
            input {
                width: calc(100% - 33px);
                height: 33px;
                color: #424242;
                border-style: none;
                font-size: 15px;
                background-color: transparent;
                &:focus {
                    outline: none;
                }
            }
        }
    }
</style>