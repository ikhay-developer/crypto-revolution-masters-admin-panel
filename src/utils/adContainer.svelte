<script lang="ts">
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"
    import { createEventDispatcher } from "svelte"

    export let image:string
    export let title:string
    export let link:string
    export let index:string

    let dispatcher = createEventDispatcher()

    let isLoading = true

    let oldImageElement:HTMLImageElement = null

    let anchor:HTMLAnchorElement = null

    let exitButton:HTMLButtonElement = null
 
    let imageElement = new Image()
    imageElement.src = image
    imageElement.style.height = "100%"
    imageElement.style.width = "100%"
    imageElement.style.borderStyle = "solid"
    imageElement.style.borderWidth = "0"
    imageElement.style.borderRadius = "10px"
    imageElement.onload = () => {
        isLoading = false
        if (oldImageElement != null) {
            oldImageElement.replaceWith(imageElement)    
        }
            
    }

    const whenClicked = e =>  {
        e.preventDefault()
        if (anchor != null && exitButton != null) {
            if (!anchor.isSameNode(exitButton) && !exitButton.contains(e.target)) {
                window.open(link)
            }
        }
    }

    const deleteAd = () => {
        isLoading = true
        fetch("https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/ads/1", { 
            method: "DELETE",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            isLoading = false
            if (data.state == "success") {
                dispatcher("delete", index)
            }
        }).catch(_ => {
            isLoading = false
        })
    }
</script>

<main>
    <div style:display="{ isLoading ? "flex" : "none" }" class="loading-spinner">
        <Circle color="#303030" size={45} unit="px" />
    </div>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a 
        bind:this={anchor}
        on:click={whenClicked} 
        {title} 
        style:display="{ !isLoading ? "block" : "none" }" class="container"
    >
        <img bind:this={oldImageElement} src="" alt="">
        <p {title}>{title}</p>
        <button on:click={deleteAd} bind:this={exitButton}>
            <img src="./img/x.svg" alt="">
        </button>
    </a>
</main>

<style lang="less" scoped>
    main {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        a.container {
            --p-underline: none;
            padding: 0;
            width: 100%;
            height: 100%;
            text-decoration: none;
            button {
                position: relative;
                z-index: 2;
                background-color: white;
                border-style: solid;
                height: 38px;
                display: flex;
                padding: 0;
                width: 38px;
                border-width: 0;
                border-radius: 19px;
                left: calc(100% - 46px);
                margin: 0;
                flex-direction: column;
                align-items: center;
                align-content: center;
                justify-content: center;
                flex-wrap: nowrap;
                bottom: calc(100% + 60px);
                box-shadow: 0.75px 0.75px 2px 0px #303030;
                img {
                    height: 18px;
                    width: 18px;
                }
                &:focus {
                    outline: none;
                }
            }
            p {
                position: relative;
                z-index: 2;
                bottom: 70px;
                height: 60px;
                left: 0;
                margin: 0;
                text-decoration: var(--p-underline);
                width: calc(100% - 16px);
                padding-right: 8px;
                padding-left: 8px;
                padding-bottom: 6px;
                font-size: 23px;
                font-weight: 400;
                color: white;
                overflow: hidden;
                border-width: 0;
                border-bottom-right-radius: 10px;
                border-bottom-left-radius: 10px;
                background-color: rgba(0, 0, 0, 0); 
                background-image: linear-gradient(231deg, rgb(1 1 1 / 35%) 50%, rgb(2 2 2 / 17%) 74%);
                text-decoration-thickness: 2px;
                text-overflow: ellipsis;
                white-space: pre-wrap;
                
            }
            &:hover {
                --p-underline: underline;
            }
        }
        div.loading-spinner {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;
            flex-wrap: nowrap;
        }
    }
</style>