<script lang="ts">
    import Tabwapper from "../../utils/tabwapper.svelte"
    import { addDataOption, currentTab } from "../../store"
    import { onMount } from "svelte"
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"
    import NoConnectionPage from "../../utils/noConnectionPage.svelte"
    import MessageContainer from "../../utils/messageContainer.svelte"

    interface MessageData {
        link: string,
        message: string,
        image: string,
        date: string,
        id: number
    }

    let messageLength = 100

    var lastScrollTop = 0

    let hasResponseError:boolean = false

    let hasLoadedData = false

    let isLoading = false

    let messageList:Array<MessageData> = []

    const loadData = () => {
        if (!hasLoadedData) {
            isLoading = true
            fetch("https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/message", { 
                method: "GET",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                }
            }).then(function(response) {
                return response.json()
            }).then(function(data) {
                if (data.state == "success")  {
                    hasLoadedData = true
                    hasResponseError = false
                    isLoading = false
                    messageList = Array.from(data.data).map((value:any, index) => ({...value, id: index}))
                } else {
                    throw new Error()
                }
            }).catch(_ => {
                isLoading = false
                hasResponseError = true
                hasLoadedData = false
            })
        }
    }

    $:{
        if ($addDataOption.output != null) {
            if ($addDataOption.output.from == "message") {
                let data = $addDataOption.output.data
                messageList = [{...data, id: messageList.length + 1}, ...messageList]
                $addDataOption = {
                    show: false,
                    page: "none",
                    input: null,
                    output: null
                }
            }
        }
    }

    $: { loadData() }

    const loadDataWhenOnline = () => {
        if (!hasLoadedData && window.navigator.onLine && hasResponseError)
            hasResponseError = false
        if ($currentTab == "message" && !isLoading && window.navigator.onLine && !hasLoadedData)
            loadData()
        requestAnimationFrame(loadDataWhenOnline)
    }

    const whenScrolled = (ev:Event) => {
        var st = (ev.target as HTMLElement).scrollTop
        if (st > lastScrollTop){
            messageLength += 0.5
            messageLength = Math.round(messageLength)
            messageLength = messageLength >= messageList.length ? messageList.length : messageLength
        } else {
            messageLength -= 1
            messageLength = messageLength <= 75 ? 75 : messageLength
        }
        lastScrollTop = lastScrollTop = st <= 0 ? 0 : st
    }

    requestAnimationFrame(loadDataWhenOnline)

    onMount(loadData)
</script>

<Tabwapper show={$currentTab == "message"}>
    <main on:scroll={whenScrolled} style:display={$currentTab == "message" ? "flex" : "none"}>
        {#if hasLoadedData && $currentTab == "message" }
            {#if (Array.from(messageList).splice(0, messageLength)).length > 0}
                <div class="container">
                    {#each (Array.from(messageList).splice(0, messageLength)) as messageDate, idx (messageDate.id)}
                        <MessageContainer 
                                date={messageDate.date}
                                link={messageDate.link}
                                image={messageDate.image}
                                message={messageDate.message}
                            />
                    {/each}
                </div>
            {:else}
                <div class="no-message-container">
                    <img src="./img/no-message.svg" alt="">
                    <span>No message</span>
                </div>
            {/if}
            <button on:click={_ => {
                $addDataOption = {
                    show: true,
                    page: "message",
                    input:  null,
                    output: null
                }
            }} id="post">
                <img src="./img/plus-lg.svg" alt="">
            </button>
        {:else if !hasLoadedData && $currentTab == "message"}
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
        overflow-y: auto;
        flex-direction: column;
        align-content: flex-start;
        justify-content: flex-start;
        flex-wrap: nowrap;
        align-items: center;
        button#post {
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
        div.no-message-container {
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
                padding-top: 2px;
                font-weight: bolder;
                font-size: 35px;
            }
        }
        div.container {
            display: grid;
            padding-top: 25px;
            padding-bottom: 125px;
            justify-content: flex-start;
            height: auto;
            
            @media only screen and (max-width: 600px) {
                & {
                    width: 92.85%;
                    grid-template-columns: repeat(1, 100%);
                }
            }
            @media only screen and (min-width: 600px) {
                & {
                    width: 490px;
                    grid-template-columns: repeat(2, calc(490px/2));
                }
            }
            @media only screen and (min-width: 768px) {
                & {
                    width: 500px;
                    grid-template-columns: repeat(2, calc(500px/2));
                }
            }
            @media only screen and (min-width: 992px) {
                & {
                    width: 560px;
                    grid-template-columns: repeat(2, calc(560px/2));
                }
            }
            @media only screen and (min-width: 1200px) {
                & {
                    width: 740px;
                    grid-template-columns: repeat(2, calc(740px/2));
                }
            }
        }
        div.loading-spinner {
            height: calc(100% - 20px);
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;
            flex-wrap: nowrap;
        }
        @media  only screen and (max-width: 600px) {
            & {
                align-items: flex-start;
                justify-content: center;
                flex-direction: row;
            }
        }
    }
</style>