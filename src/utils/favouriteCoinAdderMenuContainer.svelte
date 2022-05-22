<script lang="ts">
    import { createEventDispatcher } from "svelte"

    export let image:string
    export let name:string
    export let favouriteCoins:Array<string>
    export let coinToAdd:string

    const dispatcher = createEventDispatcher()

    const whenClick = () => {
        dispatcher("AddingCoin")
        if (coinToAdd != null) {
            if (!favouriteCoins.includes(coinToAdd)) {
                let coinIndex = favouriteCoins.findIndex((value) => name.toLowerCase() == value.toLowerCase())
                let newFavouriteCoins = Array.from(favouriteCoins)
                newFavouriteCoins[coinIndex] = coinToAdd.toLowerCase()
                fetch("https://crypto-revolution-masters.onrender.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/favourite-coin", { 
                    method: "POST",
                    body: JSON.stringify(newFavouriteCoins),
                    headers: {
                        "Accept": "*/*",
                        "Content-Type": "application/json"
                    }
                }).then(function(response) {
                    return response.text()
                }).then(function() {
                    dispatcher("coinAdded", newFavouriteCoins)
                })
                .catch(function() {
                    dispatcher("coinNotAdded")
                })
            }            
        }
    }
</script>

<main>
    <button on:click={whenClick} class="container">
        <img src={image} alt="">
        <span>
            {name}
        </span>
    </button>
</main>

<style lang="less" scoped>
    main {
        width: 100%;
        button.container {
            padding: 5px;
            padding-left: 7px;
            padding-right: 7px;
            width: calc(100%);
            height: 35px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-content: center;
            align-items: center;
            justify-content: flex-start;
            border-style: solid;
            border-width: 0;
            border-bottom-width: 1px;
            border-color: #d6d6d6;
            background-color: white;
            &:focus {
                outline: none;
            }
            &:hover {
                background-color: rgba(250, 250, 250, 0.45);
            }
            span {
                text-align: left;
                font-size: 15px;
                width: calc(100% - 30px);
                overflow: hidden;
                text-overflow: ellipsis;
                word-wrap: break-word;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            }
            img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
            }
        }
    }
</style>