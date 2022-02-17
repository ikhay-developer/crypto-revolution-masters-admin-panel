<script lang="ts">
    import { onMount } from "svelte"
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"
    import { currentTab } from "../../store"
    import NoConnectionPage from "../../utils/noConnectionPage.svelte"
    import Tabwapper from "../../utils/tabwapper.svelte"

    interface AuthDataOption { 
        username:string, 
        password:string 
    }

    let hasResponseError:boolean = false

    let hasLoadedData = false

    let authData:AuthDataOption

    let username = String()

    let password = String()

    let isLoading = false

    let isEditingtAuthData = 0

    $:isAuthDataChange = hasLoadedData ? username != authData.username || password != authData.password : false

    $: {
        if ($currentTab != "settings") {
            hasResponseError = false
            hasLoadedData = false
            authData.password = String()
            authData.username = String()
            username = String()
            password = String()
            isLoading = false
            isEditingtAuthData = 0            
        }
    }
    
    const loadData = () => {
        if ($currentTab == "settings" && !hasLoadedData) {
            isLoading = true
            let headersList = {
                "Accept": "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json"
            }
            fetch("https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/auth", { 
                method: "GET",
                headers: headersList
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.state == "success") {
                    authData = data.data
                    hasLoadedData = true
                    hasResponseError = false
                    username = authData.username
                    password = authData.password
                    isLoading = false
                } else {
                    throw new Error()
                }
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

    const loadDataWhenOnline = () => {
        if (!hasLoadedData && window.navigator.onLine && hasResponseError)
            hasResponseError = false
        if ($currentTab == "settings" && !isLoading && window.navigator.onLine && !hasLoadedData)
            loadData()
        requestAnimationFrame(loadDataWhenOnline)
    }

    const saveNewAuthData = (newUsername:string, newPassword:string) => {
        isEditingtAuthData = 1

        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
            "username": newUsername,
            "password": newPassword
        });

        fetch("https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/auth", { 
        method: "PUT",
        body: bodyContent,
        headers: headersList
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            if (data.state == "success") {
                username = data.data["username"]
                password = data.data["password"]
                authData = data.data
                isEditingtAuthData = 3
                setTimeout(_ => {
                    isEditingtAuthData = 0
                }, 2000)
                
            } else {
                throw new Error()
            }
        }).catch(_ => {
            isEditingtAuthData = 4
            setTimeout(_ => {
                isEditingtAuthData = 0
            }, 2000)
        })
    }

    requestAnimationFrame(loadDataWhenOnline)

    onMount(loadData)
</script>
<Tabwapper>
    <main>
        {#if hasLoadedData && $currentTab == "settings"}
            <div class="body">
                <header>
                    <span id="title">General</span>
                    <div style:width={isEditingtAuthData == 0 ? "128px": isEditingtAuthData == 1 ? "38px" : "30px"}>
                        {#if isEditingtAuthData == 0 && isAuthDataChange}
                            <button id="cancel-btn" on:click={_ => {
                                if (hasLoadedData) {
                                    username = authData.username
                                    password = authData.password
                                }
                            }}>Cancel</button>
                            <button on:click={_ => saveNewAuthData(username, password)} id="save-btn" disabled={username == String() || password == String() ? true : false} >Save</button>
                        {:else if isEditingtAuthData == 1}
                            <Circle color="#303030" size={28} unit="px" />
                        {:else if isEditingtAuthData == 3}
                            <img src="./img/success-mark.svg" height="25px" width="25px" alt="">
                        {:else if isEditingtAuthData == 4}
                            <img src="./img/error-mark.svg" height="25px" width="25px" alt="">
                        {/if}
                    </div>
                </header>
                <main class="form-data">
                    <p>Username</p>
                    <input id={username == String() ? "empty-input" : ""} type="text" bind:value={username}>
                    <p>Password</p>
                    <input id={password == String() ? "empty-input" : ""} type="text" bind:value={password}>
                </main>
            </div>
        {:else if !hasLoadedData && $currentTab == "settings"}
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
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: nowrap;
        div.loading-spinner {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;
            flex-wrap: nowrap;
        }
        div.body {
            border-style: solid;
            border-width: 1px;
            border-color: #e0e0e0;
            border-radius: 10px;
            height: 340px;
            margin-top: 50px;
            main.form-data {
                width: calc(100% - 46px);
                height: calc(100% - 95px);
                padding: 20px;
                padding-left: 23px;
                padding-right: 23px;
                display: block;
                border-width: 0px;
                border-radius: 10px;
                border-style: solid;
                border-top-right-radius: 0;
                border-top-left-radius: 0;
                p {
                    font-size: 18px;
                    color: rgb(75, 74, 74);
                    padding-left: 10px;
                    padding-right: 10px;
                }
                input {
                    height: 35px;
                    border-style: solid;
                    border-width: 1px;
                    border-radius: 5px;
                    padding: 5px;
                    padding-left: 10px;
                    font-size: 16px;
                    padding-right: 10px;
                    border-color: #e0e0e0;
                    color: #575555;
                    width: calc(100% - 30px);
                    &:focus {
                        outline: none;
                        border-color: #3a3a3a;
                    }
                    &#empty-input {
                        border-color: #b71c1c;
                        &:focus {
                            border-color: #b71c1c;
                        }
                    }
                }
            }
            header {
                width: calc(100% - 40px);
                height: 55px;
                background-color: #f5f5f5;
                border-width: 0px;
                border-color: #e0e0e0;
                border-style: solid;
                border-radius: 10px;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                border-bottom-width: 1px;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                align-items: center;
                padding-left: 20px;
                padding-right: 20px;
                span#title {
                    font-size: 20px;
                    color: rgb(75, 74, 74);
                    font-weight: 500;
                }
                div {
                    width: 128px;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    align-items: center;
                    button {
                        font-size: 13.5px;
                        height: 30px;
                        font-weight: bold;
                        border-style: solid;
                        border-width: 0;
                        border-radius: 5px;
                        &#save-btn {
                            width: 55px;
                            background-color: lighten(#303030, 6.5%);
                            color: white;
                            &:hover {
                                background-color: #303030;
                            }
                            &:disabled {
                                background-color: lighten(#303030, 25%);
                            }
                        }
                        &#cancel-btn {
                            width: 65px;
                            background-color: lighten(#bdbdbd, 10%);
                            color: rgb(75, 74, 74);
                            &:hover {
                                background-color: lighten(#bdbdbd, 2%);
                            }
                        }
                        &:focus {
                            outline: none;
                        }
                    }
                }
            }
            @media only screen and (max-width: 600px) {
                & {
                    width: 85.85%;
                }
            }

            @media only screen and (min-width: 600px) {
                & {
                    width: 83%;
                }
            }

            @media only screen and (min-width: 768px) {
                & {
                    width: 450px; 
                }
            }

            @media only screen and (min-width: 992px) {
                & {
                    width: 500px; 
                }
            }

            @media only screen and (min-width: 1200px) {
                & {
                    width: 600px; 
                }
            }
        }
    }
</style>