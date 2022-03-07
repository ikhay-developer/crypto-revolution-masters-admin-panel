<script lang="ts">
    import { onMount } from "svelte"
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"
    import { currentTab, lastTab } from "../../store"
    import CoinDataContainer from "../../utils/coinDataContainer.svelte"
    import FavouriteCoinDataContainer from "../../utils/favouriteCoinDataContainer.svelte"
    import FavouriteCoinAdderMenuContainer from "../../utils/favouriteCoinAdderMenuContainer.svelte"
    import NoConnectionPage from "../../utils/noConnectionPage.svelte"

    interface FavouriteCoinData {
        name: string
        symbol: string
        image: string
        current_price: number
        market_cap: number
        market_cap_rank: number
        price_change_percentage_24h: number
        price_change_percentage_1h_in_currency: number
    }

    interface CoinData extends FavouriteCoinData {
        is_add_to_favourite: boolean
    }

    let coinList:Array<CoinData> = Array<CoinData>()

    let favouriteCoins:Array<string> = Array<string>()

    let favouriteCoinList:Array<FavouriteCoinData> = Array<FavouriteCoinData>()

    let minCoinLength = 100

    let maxCoinLength = 1000

    let coinLength = 100

    var lastScrollTop = 0

    let searchValue = String()

    let isLoading = false

    let hasResponseError:boolean = false

    let hasLoadedData = false

    let showTab:"favourite coin"|"coin" = "coin"

    let favouriteCoinAdderMenu:HTMLDivElement = null

    let tableBody:HTMLDivElement = null

    let shouldShowFavouriteCoinAdderMenu:boolean = false

    let isAdding:boolean = false

    let coinToAdd:string = null

    let infoPageData = {
        message: "Bitcoin",
        show: false
    }

    $: {
        if ($currentTab != "favourite") {
            searchValue = String()
        }
    }

    const updateData = () => {
        if ($currentTab == "favourite" && hasLoadedData) {
            fetch("https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/favourite-coin-data", { 
            method: "GET",
            headers:  {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }
            }).then(function(response) {
                return response.json()
            }).then(function(data) {
                
                if (data.state == "success") {
                    if (data.data["coin list"].length > 0) {
                        favouriteCoinList = data.data["favourite coin list"].map((value: { [x: string]: any; }) => ({
                            name: value["name"],
                            symbol: value["symbol"],
                            image: value["image"],
                            current_price:  value["current_price"],
                            market_cap: value["market_cap"],
                            market_cap_rank: value["market_cap_rank"],
                            price_change_percentage_24h: value["price_change_percentage_24h"],
                            price_change_percentage_1h_in_currency: value["price_change_percentage_1h_in_currency"]
                        }))
                        coinList = data.data["coin list"].map((value: { [x: string]: any; }) => ({
                            name: value["name"],
                            symbol: value["symbol"],
                            image: value["image"],
                            current_price:  value["current_price"],
                            market_cap: value["market_cap"],
                            market_cap_rank: value["market_cap_rank"],
                            price_change_percentage_24h: value["price_change_percentage_24h"],
                            price_change_percentage_1h_in_currency: value["price_change_percentage_1h_in_currency"],
                            is_add_to_favourite: value["is_add_to_favourite"]
                        }))
                        favouriteCoins = data.data["favourite coin list"].map((value: { [x: string]: any; }) => (value["name"].toLowerCase()))
                    }
                }
            })
        }
    }

    const loadData = () => {
        if (!hasLoadedData) {
            isLoading = true
            fetch("https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/favourite-coin-data", { 
            method: "GET",
            headers:  {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }
            }).then(function(response) {
                return response.json()
            }).then(function(data) {
                if (data.state == "success") {
                    hasLoadedData = true
                    hasResponseError = false
                    isLoading = false
                    favouriteCoinList = data.data["favourite coin list"].map((value: { [x: string]: any; }) => ({
                        name: value["name"],
                        symbol: value["symbol"],
                        image: value["image"],
                        current_price:  value["current_price"],
                        market_cap: value["market_cap"],
                        market_cap_rank: value["market_cap_rank"],
                        price_change_percentage_24h: value["price_change_percentage_24h"],
                        price_change_percentage_1h_in_currency: value["price_change_percentage_1h_in_currency"]
                    }))
                    coinList = data.data["coin list"].map((value: { [x: string]: any; }) => ({
                        name: value["name"],
                        symbol: value["symbol"],
                        image: value["image"],
                        current_price:  value["current_price"],
                        market_cap: value["market_cap"],
                        market_cap_rank: value["market_cap_rank"],
                        price_change_percentage_24h: value["price_change_percentage_24h"],
                        price_change_percentage_1h_in_currency: value["price_change_percentage_1h_in_currency"],
                        is_add_to_favourite: value["is_add_to_favourite"]
                    }))
                    favouriteCoins = data.data["favourite coin list"].map((value: { [x: string]: any; }) => (value["name"].toLowerCase()))
                } else {
                    throw new Error()
                }
            }).catch(_ => {
                isLoading = false
                hasResponseError = true
                hasLoadedData = false
            })
        } else {
            hasLoadedData = false
            hasResponseError = false
            isLoading = false
        }
    }

    $: { loadData() }

    const loadDataWhenOnline = () => {
        if (!hasLoadedData && window.navigator.onLine && hasResponseError)
            hasResponseError = false
        if ($currentTab == "favourite" && !isLoading && window.navigator.onLine && !hasLoadedData)
            loadData()
        requestAnimationFrame(loadDataWhenOnline)
    }

    requestAnimationFrame(loadDataWhenOnline)

    onMount(() => {
        loadData()
        setInterval(() => {
            updateData()
        }, 300000)
    })

    const whenScrolled = (ev:Event) => {
        if (shouldShowFavouriteCoinAdderMenu) {
            shouldShowFavouriteCoinAdderMenu = false
        }
        var st = (ev.target as HTMLElement).scrollTop
        if (st > lastScrollTop){
            coinLength += 0.5
            coinLength = Math.round(coinLength)
            coinLength = coinLength >= maxCoinLength ? maxCoinLength : coinLength
        } else {
            coinLength -= 1
            coinLength = coinLength <= minCoinLength ? minCoinLength : coinLength
        }
        lastScrollTop = lastScrollTop = st <= 0 ? 0 : st
    }

    window.addEventListener("contextmenu", () => {
        if (shouldShowFavouriteCoinAdderMenu) {
            shouldShowFavouriteCoinAdderMenu = false
        }
    })

    window.addEventListener("click", (e) => {
        if ($currentTab == "favourite" && favouriteCoinAdderMenu != null && shouldShowFavouriteCoinAdderMenu) {
            let target = e.target as HTMLElement
            if (!isAdding && !(target.isSameNode(favouriteCoinAdderMenu) || favouriteCoinAdderMenu.contains(target))) {
                shouldShowFavouriteCoinAdderMenu = false
            }
            isAdding = false
        }
        
    })

    const toAddCoin = (e) => {
        if (favouriteCoinAdderMenu != null && tableBody != null) {
            favouriteCoinAdderMenu.style.left = `${e.detail.x}px`
            let height = e.detail.y + tableBody.scrollTop
            let scrollheight = tableBody.offsetHeight + tableBody.scrollTop
            if ((height + 376) >=  scrollheight)
                favouriteCoinAdderMenu.style.top = `${height - 306}px`
            else
                favouriteCoinAdderMenu.style.top = `${height}px`
            shouldShowFavouriteCoinAdderMenu = true
            isAdding = true
            coinToAdd = e.detail.name
        }
    }

    const whenCoinAdded = (e) => {
        favouriteCoins = e.detail
        coinList = coinList.map((value: { [x: string]: any; }) => ({
            name: value["name"],
            symbol: value["symbol"],
            image: value["image"],
            current_price:  value["current_price"],
            market_cap: value["market_cap"],
            market_cap_rank: value["market_cap_rank"],
            price_change_percentage_24h: value["price_change_percentage_24h"],
            price_change_percentage_1h_in_currency: value["price_change_percentage_1h_in_currency"],
            is_add_to_favourite: favouriteCoins.includes(value["name"].toLowerCase())
        }))
        let favouriteCoinListMap:Map<string, FavouriteCoinData> = new Map<string, FavouriteCoinData>()
        coinList
        .filter((value) => favouriteCoins.includes(value.name.toLowerCase()))
        .map((value) => ({
            name: value["name"],
            symbol: value["symbol"],
            image: value["image"],
            current_price:  value["current_price"],
            market_cap: value["market_cap"],
            market_cap_rank: value["market_cap_rank"],
            price_change_percentage_24h: value["price_change_percentage_24h"],
            price_change_percentage_1h_in_currency: value["price_change_percentage_1h_in_currency"]
        }))
        .forEach(value => {
            favouriteCoinListMap.set(value.name.toLowerCase(), value)
        })
        favouriteCoinList = []
        favouriteCoins.forEach(value => {
            favouriteCoinList.push(favouriteCoinListMap.get(value.toLowerCase()))
        })
        favouriteCoins = favouriteCoinList.map(({name}) => name.toLocaleLowerCase())
        infoPageData.message = `${infoPageData.message} added to favourite`
        infoPageData.show = true
        setTimeout(() => infoPageData.show = false, 2450)
    }

    $:favouriteCoinAdderMenuReactive = [...(Array.from(favouriteCoinList).map(({image, name, symbol}) => ({image, name, symbol})))]

    $:favouriteCoinListReactive =  [...(Array.from(favouriteCoinList).splice(0, coinLength).filter(value => value.name.toLowerCase().search(searchValue.replaceAll("\\", "").toLowerCase()) >= 0 || value.symbol.toLowerCase().search(searchValue.replaceAll("\\", "").toLowerCase()) >= 0))]
    
    $:coinListReactive = [...(Array.from(coinList).splice(0, coinLength).filter(value => value.name.toLowerCase().search(searchValue.replaceAll("\\", "").toLowerCase()) >= 0 || value.symbol.toLowerCase().search(searchValue.replaceAll("\\", "").toLowerCase()) >= 0))]
</script>
<main style:display={$currentTab == "favourite" ? "block": "none"}>
    <nav>
        <div class="container">
            <img on:click={_ => {
                $currentTab = $lastTab
                $lastTab = "favourite"
            }} id="back-btn" src="./img/arrow-left-short.svg" alt="">
            <input type="text" placeholder={showTab == "coin" ? "Search coins" : "Search favourite coins"} bind:value={searchValue}>
            <img on:click={_ => searchValue = String()} style:display={searchValue.length > 0 ? "block" : "none"} id="exit" src="./img/x.svg" alt="">
        </div>
    </nav>
    
    {#if hasLoadedData && $currentTab == "favourite"}  
        <div class="no-coin-page" style:display={(showTab == "coin" && coinListReactive.length > 0) ? "none" : (showTab == "favourite coin" && favouriteCoinListReactive.length > 0) ? "none" : "flex" }>
            <img src="./img/coin.svg" alt="no coin">
            <span>No coin found</span>
        </div>
        <div style:display={infoPageData.show ? "flex" : "none"} class="info-tab">
            <span>
                {infoPageData.message}
            </span>
            <button on:click={_ => infoPageData.show = false}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-x" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                    <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
                </svg>
            </button>
        </div>
        <div bind:this={tableBody}  on:scroll={whenScrolled} class="table-body" style:display={(showTab == "coin" && coinListReactive.length > 0) ? "block" : (showTab == "favourite coin" && favouriteCoinListReactive.length > 0) ? "block" : "none" }>
            <div bind:this={favouriteCoinAdderMenu} style:display={shouldShowFavouriteCoinAdderMenu ? "block": "none"} class="fav-coin-adder-menu">
                <div class="header">
                    <span>
                        Replace with
                    </span>
                </div>
                <div class="footer">
                    {#each favouriteCoinAdderMenuReactive as coinData, idx (coinData.symbol)}
                        <FavouriteCoinAdderMenuContainer 
                            on:coinAdded={whenCoinAdded}
                            on:coinNotAdded={_ => {
                                infoPageData.message = `Couldn't add ${infoPageData.message} to favourite`
                                infoPageData.show = true
                                setTimeout(() => infoPageData.show = false, 2450)
                            }}
                            on:AddingCoin={_ => {
                                infoPageData.message = coinToAdd
                                shouldShowFavouriteCoinAdderMenu = false
                                coinToAdd = null
                            }}
                            bind:coinToAdd={coinToAdd}
                            bind:favouriteCoins={favouriteCoins}
                            name={coinData.name} 
                            image={coinData.image} 
                        />
                    {/each}
                </div>
            </div>
            <header>
                <div class="head">
                    <div class="fixed-head">
                        <p id="rank">#</p>
                        <p id="name">Coin</p>
                    </div>
                    <p id="price">Price</p>
                    <p id="change">1h%</p>
                    <p id="change">24h%</p>
                    <p id="mkt-cap">Mkt cap</p>
                </div>
            </header>
            <footer>
                {#if showTab == "coin"}
                    {#each coinListReactive as coinData, idx (coinData.symbol)}
                        <CoinDataContainer on:toadd={toAddCoin} {...coinData}/>
                    {/each}
                {:else if showTab == "favourite coin" }
                    {#each favouriteCoinListReactive as coinData, idx (coinData.symbol)}
                        <FavouriteCoinDataContainer {...coinData}/>
                    {/each}
                {/if}
            </footer>
        </div>
        <button on:click={_ => showTab = showTab == "coin" ? "favourite coin" : "coin"} id="set">
            <img src={showTab == "coin" ? "./img/star-fill.svg" : "./img/coin.svg"} alt="">
        </button>
    {:else if !hasLoadedData && $currentTab == "favourite"}
        <div class="loading-spinner">
            {#if !hasResponseError}
                <Circle color="#303030" size={90} unit="px" />
            {:else}
                <NoConnectionPage />
            {/if}
        </div>
    {/if}
</main>
<style lang="less" scoped>
    main {
        width: 100%;
        height: 100%;
        z-index: 5;
        position: fixed;
        top: 0;
        left: 0;
        background-color: white;
        padding-bottom: 125px;
        @media only screen and (max-width: 600px) {
            & {
                align-items: flex-start;
            }
        }
        div.fav-coin-adder-menu {
            z-index: 2;
            position: absolute;
            display: none;
            div.header {
                height: 25px;
                width: 180px;
                padding: 5px;
                padding-left: 30px;
                padding-right: 10px;
                border-style: solid;
                border-width: 1px;
                border-color: #d6d6d6;
                background-color: #fafafa;
                display: flex;
                font-weight: 600;
                span {
                    align-self: center;
                }
            }
            div.footer {
                width: 220px;
                height: calc(35px * 7);
                border-style: solid;
                border-width: 1px;
                border-top-width: 0;
                border-color: #d6d6d6;
                background-color: white;
            }
        }
        div.no-coin-page {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            flex-direction: column;
            flex-wrap: nowrap;
            img {
                height: 125px;
                width: 125px;
            }
            span {
                color: #757575;
                padding: 5px;
                margin-top: 7px;
                font-weight: bolder;
                font-size: 35px;
            }
        }
        button#set {
            position: fixed;
            z-index: 2;
            background-color: white;
            left: calc(100% - 90px);
            top: calc(100% - 90px);
            border-style: solid;
            height: 65px;
            display: flex;
            padding: 0;
            width: 65px;
            border-width: 1px;
            border-radius: 35px;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;
            flex-wrap: nowrap;
            box-shadow: 1px 1px 1px 1px #e0e0e0;
            img {
                height: 28px;
                width: 28px;
            }
            &:focus {
                outline: none;
            }
        }
        div.loading-spinner {
            height: calc(100%);
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;
            flex-wrap: nowrap;
        }
        div.info-tab {
            width: calc(100% - 30px);
            display: flex;
            position: fixed;
            left: 0;
            top: 70px;
            height: 25px;
            padding: 15px;
            padding-top: 10px;
            padding-bottom: 10px;
            z-index: 3;
            background-color: #303030;
            flex-direction: row;
            flex-wrap: nowrap;
            align-content: center;
            justify-content: space-between;
            align-items: center;
            span {
                color: white;
                font-size: 15.5px;
                font-weight: 600;
            }
            button {
                background-color: transparent;
                border-style: none;
                &:focus {
                    outline: none;
                }
            }
        }
        div.table-body {
            height: calc(100%);
            width: 100%;
            overflow: auto;
            position: relative;
            footer {
                width: 100%;
                height: fit-content;
                display: flex;
                flex-direction: column;
                align-items: center;
                height: fit-content;
                @media only screen and (max-width: 600px) {
                    & {
                        align-items: flex-start;
                    }
                }
            }
            header {
                display: flex;
                flex-direction: column;
                align-items: center;
                height: fit-content;
                width: 100%;
                @media only screen and (max-width: 600px) {
                    & {
                        align-items: flex-start;
                    }
                }
                
                div.head {
                    width: 100%;
                    padding: 0;
                    border-style: solid;
                    border-width: 1px;
                    margin-top: 20px;
                    border-color: #d6d6d6;
                    background-color: #fafafa;
                    display: flex;
                    div.fixed-head {
                        width: calc(65px+100px);
                        display: flex;
                        position: sticky;
                        left: 0;
                        background-color: #fafafa;
                        border-style: solid;
                        border-width: 0;
                        border-color: #d6d6d6;
                        p {
                            &#rank {
                                width: 65px;
                                text-align: center;
                            }
                            &#name {
                                width: 100px;
                                text-align: left;
                            }
                        }
                        @media only screen and (max-width: 600px) {
                            & {
                                width: calc(65px+100px);
                                border-right-width: 1px;
                                p#name {
                                    width: 100px
                                }
                            }
                        }
                        @media only screen and (min-width: 992px) {
                            & {
                                width: calc(65px+180px);
                                p#name {
                                    width: 180px
                                }
                            }
                        }
                        @media only screen and (min-width: 1200px) {
                            & {
                                width: calc(65px+240px);
                                p#name {
                                    width: 240px
                                }
                            }
                        }
                    }
                    p {
                        font-weight: 600;
                        padding: 0;
                        margin: 0;
                        height: 48px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        &#price {
                            width: 125px;
                            padding-right: 10px;
                            text-align: right;
                        }
                        &#change {
                            width: 100px;
                            padding-right: 10px;
                            text-align: right;
                        }
                        &#mkt-cap {
                            width: 180px;
                            padding-right: 15px;
                            text-align: right;
                        }
                    }
                    @media only screen and (max-width: 600px) {
                        & {
                            margin-top: 0px;
                            border-top-width: 0px;
                            width: 560px
                        }
                    }
                    @media only screen and (min-width: 600px) {
                        & {
                            width: calc(100% - 30px)
                        }
                    }
                    @media only screen and (min-width: 768px) {
                        & {
                            width: 620px;
                        }
                    }
                    @media only screen and (min-width: 992px) {
                        & {
                            width: 640px
                        }
                    }
                    @media only screen and (min-width: 1200px) {
                        & {
                            width: 700px
                        }
                    }
                }
            }
        }
        
        nav {
            width: 100%;
            height: 70px;
            display: flex;
            border-width: 0;
            border-bottom-width: 1px;
            border-style: solid;
            border-color: #e0e0e0;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            div.container {
                display: flex;
                height: 100%;
                padding-left: 15px;
                padding-right: 15px;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
                input {
                    padding-top: 7px;
                    padding-bottom: 7px;
                    font-size: 17.5px;
                    color: #383737;
                    width: calc(100% - 65px);
                    height: 30px;
                    border: none;
                    &:focus {
                        outline: none;
                    }

                }
                img#back-btn {
                    height: 35px;
                    width: 35px;
                    margin-left: -10px;
                }
                img#exit {
                    display: none;
                    height: 15px;
                    width: 15px;
                    margin-left: 10px;
                }
                @media only screen and (max-width: 600px) {
                    & {
                        width: 100%
                    }
                }
                @media only screen and (min-width: 600px) {
                    & {
                        width: calc(100% - 30px)
                    }
                }
                @media only screen and (min-width: 768px) {
                    & {
                        width: 620px;
                    }
                }
                @media only screen and (min-width: 992px) {
                    & {
                        width: 640px
                    }
                }
                @media only screen and (min-width: 1200px) {
                    & {
                        width: 700px
                    }
                }
            }
        }
    }
</style>