<script lang="ts">
    import { onMount } from "svelte"
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"
    import { currentTab } from "../../store"
    import NoConnectionPage from "../../utils/noConnectionPage.svelte"
    import Searchbar from "../../utils/searchbar.svelte"
    import Tabwapper from "../../utils/tabwapper.svelte"
    import UserDataContainer from "../../utils/userDataContainer.svelte"

    interface UserData {
        username: string,
        id: string,
        email: string
    }

    let coinLength = 100

    var lastScrollTop = 0

    let userDataList:Array<UserData> = []

    let placeholder:string = "Search"

    let hasResponseError:boolean = false

    let hasLoadedData = false

    let isLoading = false

    let searchValue:string = String()

    $: {
        if ($currentTab != "users") {
            placeholder = "Search"
            searchValue = String()
            hasResponseError = false
            hasLoadedData = false
            isLoading = false
            userDataList = []
        }
    }

    const loadData = () => {
        if ($currentTab == "users" && !hasLoadedData) {
            isLoading = true
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }
            fetch("https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/users", { 
                method: "GET",
                headers: headersList
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                hasLoadedData = true
                hasResponseError = false
                isLoading = false
                userDataList = data
                userDataListReactive = [...(Array.from(userDataList).splice(0, coinLength))]
            })
            .catch(_ => {
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

    onMount(loadData)

    const loadDataWhenOnline = () => {
        if (!hasLoadedData && window.navigator.onLine && hasResponseError)
            hasResponseError = false
        if ($currentTab == "users" && !isLoading && window.navigator.onLine && !hasLoadedData)
            loadData()
        requestAnimationFrame(loadDataWhenOnline)
    }

    const whenScrolled = (ev:Event) => {
        var st = (ev.target as HTMLElement).scrollTop
        if (st > lastScrollTop){
            coinLength += 0.5
            coinLength = Math.round(coinLength)
            coinLength = coinLength >= userDataList.length ? userDataList.length : coinLength
        } else {
            coinLength -= 1
            coinLength = coinLength <= 75 ? 75 : coinLength
        }
        lastScrollTop = lastScrollTop = st <= 0 ? 0 : st
    }

    $:userDataListReactive = [...(Array.from(userDataList).splice(0, coinLength).filter(value => value.email.toLowerCase().search(searchValue.toLowerCase()) >= 0 || value.username.toLowerCase().search(searchValue.toLowerCase()) >= 0))]
    
    requestAnimationFrame(loadDataWhenOnline)
</script>

<Tabwapper show={$currentTab == "users"}>
    <main on:scroll={whenScrolled}>
        {#if hasLoadedData && $currentTab == "users"}
            <div class="scroll-space"></div>
            <header>
                <Searchbar on:input={ev => searchValue = ev.detail} {placeholder} searchWidth={"calc(100% - 4px)"} />
                <div class="head">
                    <p>Username</p>
                    <p>Email</p>
                </div>
                <div class="user-summary">
                    Showing {userDataListReactive.length} of {userDataList.length} user{userDataListReactive.length > 1 ? "s": ""}
                </div>
            </header>
            <footer>
                {#if userDataListReactive.length > 0}
                    {#each userDataListReactive as  userData}
                        <UserDataContainer email={userData.email} username={userData.username} />
                    {/each}
                {:else if userDataListReactive.length == 0}
                    <div class="no-user">
                        No users found
                    </div>
                {/if}
            </footer>
        {:else if !hasLoadedData && $currentTab == "users"}
            <div class="loading-spinner">
                {#if !hasResponseError}
                    <Circle color="#303030" size={90} unit="px" />
                {:else}
                    <NoConnectionPage />
                {/if}
            </div>
        {/if}
    </main>
</Tabwapper>

<style scoped lang="less">
    main {
        height: calc(100% - 20px);
        width: 100%;
        overflow: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        align-content: flex-start;
        padding-bottom: 20px;
        div.scroll-space {
            width: 100%; 
            height: 25px; 
            background-color: white;
            position: -webkit-sticky;
            padding: 0;
            position: sticky;
            align-self: flex-end;
            top: 0px;
        }
        div.loading-spinner {
            height: calc(100% - 80px);
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;
            flex-wrap: nowrap;
        }
        footer {
            height: fit-content;
            width: calc(65% - 4px); 
            padding-bottom: 10px;
            div.no-user {
                width: calc(100% - 34px);
                height: 30px;
                padding: 7.5px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-content: center;
                align-items: center;
                padding-left: 15px;
                padding-right: 15px;
                border-style: solid;
                border-width: 1px;
                border-top-width: 0px;
                border-color: #d6d6d6;
            }
            @media only screen and (max-width: 600px) {
                & {
                    width: calc(95% - 4px);
                }
            } 
        }
        header {
            position: -webkit-sticky;
            width: calc(65% - 4px);
            position: sticky;
            align-self: flex-end;
            top: 25px;
            div.head {
                width: calc(100% - 34px);
                padding: 10px;
                padding-left: 15px;
                padding-right: 15px;
                border-style: solid;
                border-width: 1px;
                border-top-width: 0px;
                border-color: #d6d6d6;
                background-color: #eeeeee;
                display: flex;
                p {
                    font-weight: 600;
                    padding: 0;
                    margin: 0;
                    width: 50%;
                }
            }
            div.user-summary {
                height: 40px;
                display: flex;
                font-style: italic;
                width: calc(100% - 28px);
                flex-direction: row;
                background-color: #eeeeee;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
                padding-left: 12px;
                padding-right: 12px;
                border-style: solid;
                border-width: 1px;
                border-top-width: 0px;
                border-color: #d6d6d6;
            }
            @media only screen and (max-width: 600px) {
                & {
                    width: calc(95% - 4px);
                }
            }
        }
    }
</style>