<script lang="ts">
    import { isLogin } from "../store"
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"

    let username = String()

    let password = String()

    let errorMsg:"none"|"wrong password"|"wrong username"|"wrong username and password" = "none"

    let onLine = false

    let isLoading = false

    const checkOnlineState = () => {
        onLine = window.navigator.onLine
        requestAnimationFrame(checkOnlineState)
    }

    requestAnimationFrame(checkOnlineState)

    const logIn = () => {
        if (onLine) {
            isLoading = true
            fetch("http://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/auth", { 
                method: "GET",
                headers:  {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                }
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if (data.state == "success") {
                    isLoading = false
                    if (data.data.username != username && data.data.password != password) {
                        errorMsg = "wrong username and password"
                    } else if (data.data.username != username && data.data.password == password) {
                        errorMsg = "wrong username"
                    } else if (data.data.username == username && data.data.password != password) {
                        errorMsg = "wrong password"
                    } else {
                        errorMsg = "none"
                        $isLogin = true
                    }
                }
            })
        }
    }


</script>

<svelte:head>
    <title>Login</title>        
</svelte:head>
<main>
    <div>
        {#if onLine}
            <p>Login</p>
        {:else}
            <p style="color: #d32f2f">No internet</p>
        {/if}
        {#if errorMsg == "wrong username and password"}
            <input style="border-color: red;" type="text" bind:value={username} placeholder="Username">
            <span>Wrong username</span>
            <input style="border-color: red;" type="password" bind:value={password} placeholder="Password">
            <span>Wrong pasword</span>
        {:else if errorMsg == "wrong password"}
            <input type="text" bind:value={username} placeholder="Username">
            <input style="border-color: red;" type="password" bind:value={password} placeholder="Password">
            <span>Wrong pasword</span>
        {:else if errorMsg == "wrong username"}
            <input style="border-color: red;" type="text" bind:value={username} placeholder="Username">
            <span>Wrong username</span>
            <input type="password" bind:value={password} placeholder="Password">
        {:else}
            <input type="text" bind:value={username} placeholder="Username">
            <input type="password" bind:value={password} placeholder="Password">
        {/if}
        <button disabled={!onLine} on:click={logIn}>
            {#if !isLoading}
                Continue
            {:else}
                <Circle color={"white"} size={18} unit={"px"} />
            {/if}
        </button>
    </div>
</main>

<style scoped lang="less">
    main {
        position: fixed;
        z-index: 3;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #eeeeee;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        div {
            display: flex;
            flex-direction: column;
            background-color: white;
            height: 365px;
            width: 410px;
            padding: 25px;
            padding-top: 20px;
            padding-bottom: 15px;
            box-shadow: 0.5px 0.5px 1.5px 0.25px #bdbdbd;
            button {
                font-size: 16.5px;
                height: 40px;
                font-weight: bold;
                border-style: solid;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                border-width: 0;
                border-radius: 2.5px;
                margin-top: 25px;
                position: relative;
                left: calc(100% - 140px);
                background-color: lighten(#303030, 6.5%);
                color: white;
                width: 140px;
                &:hover {
                    background-color: #303030;
                }
                &:disabled {
                    background-color: lighten(#303030, 25%);
                }
                &:focus {
                    outline: none;
                }
            }
            p {
                font-size: 35px;
                padding-top: 20px;
                margin: 0;
                font-weight: 600;
                color: #212121;
            }
            span {
                color: red;
                padding-left: 10px;
                padding-right: 10px;
            }
            input {
                width: calc(100% - 25px);
                margin-top: 20px;
                margin-bottom: 10px;
                height: 35px;
                padding: 5px;
                padding-right: 10px;
                padding-left: 10px;
                border-style: solid;
                border-width: 0px;
                border-radius: 0;
                border-bottom-width: 1px;
                font-size: 15.5px;
                border-color: #bdbdbd;
                color: #616161;
                &:focus {
                    outline: none;
                    border-color: #616161 !important;
                    color: #303030;
                }
            }
            @media only screen and (max-width: 600px) {
                & {
                    width: calc(85% - 5px);
                }
            }
        }
    }
</style>