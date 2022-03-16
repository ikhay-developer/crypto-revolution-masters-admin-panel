<script lang="ts">
    import { onMount } from "svelte"
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"
    import { currentTab, addDataOption } from "../../store"
    import AdContainer from "../../utils/adContainer.svelte"
    import NoConnectionPage from "../../utils/noConnectionPage.svelte"
    import Tabwapper from "../../utils/tabwapper.svelte"

    interface adsDataListOption {
        image:string, 
        link:string, 
        message:string,
        index:string
    }

    let indexSet:Set<number> = new Set([1, 2, 3, 4, 5, 6])

    let hasResponseError:boolean = false

    let hasLoadedData = false

    let isLoading = false

    let adsDataList:Array<adsDataListOption> = []

    const loadData = () => {
        if (!hasLoadedData) {
            isLoading = true
            fetch("https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/ads", { 
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
                    adsDataList = data.data
                    adsDataList.forEach(({index}) => indexSet.delete(parseInt(index)))
                    console.log(indexSet)
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
        if ($currentTab == "ads" && !isLoading && window.navigator.onLine && !hasLoadedData)
            loadData()
        requestAnimationFrame(loadDataWhenOnline)
    }

    $:{
        if ($addDataOption.output != null) {
            if ($addDataOption.output.from == "ad") {
                let data = $addDataOption.output.data
                indexSet.delete(parseInt(data.index))
                adsDataList = [data, ...adsDataList]
                $addDataOption = {
                    show: false,
                    page: "none",
                    input: null,
                    output: null
                }
            }
        }
    }

    let deleteIndex = null

    let markforDelete:boolean = false

    $:{
        if (markforDelete && deleteIndex != null) {
            adsDataList = adsDataList.filter(value => value.index != deleteIndex)
            indexSet.add(parseInt(deleteIndex))
            adsDataList = [...adsDataList]
            markforDelete = false
            deleteIndex = null
        }
    }

    const deleteAd = (id) => {
        markforDelete = true
        deleteIndex = id
    }
    
    requestAnimationFrame(loadDataWhenOnline)

    onMount(loadData)

</script>
<Tabwapper show={$currentTab == "ads"}>
    <main>
        {#if hasLoadedData && $currentTab == "ads" }
            <div>
                {#if adsDataList.length < 6}
                    <button on:click={_ => {
                        let id = Array.from(indexSet).at(0)
                        id = id != undefined ? id : 6
                        $addDataOption = {
                            show: true,
                            page: "ad",
                            input: { id },
                            output: null
                        }
                    }}>
                        <img src="./img/plus-lg.svg" alt="plus">
                    </button>
                {/if}
                {#each adsDataList as adData, idx (adData.index)}
                    <AdContainer 
                        on:delete={_ => deleteAd(adData.index)}  
                        index={adData.index}
                        image={adData.image}
                        message={adData.message}
                        link={adData.link}
                    />
                {/each}
            </div>
        {:else if !hasLoadedData && $currentTab == "ads"}
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
        flex-direction: row;
        justify-content: center;
        flex-wrap: nowrap;
        align-items: flex-start;
        div {
            display: grid;
            padding-top: 25px;
            padding-bottom: 25px;
            grid-gap: 10px;
            justify-content: center;
            gap: 10px;
            button {
                border-style: solid;
                background-color: lighten(#f5f5f5, 2%);
                border-width: 1px;
                border-color: #e0e0e0;
                border-radius: 8px;
                img {
                    width: 60px;
                    height: 60px;
                }
                &:focus {
                    outline: none;
                }
            }
            @media only screen and (max-width: 600px) {
                & {
                    height: 1320px;
                    width: 95.85%;
                    grid-template-columns: repeat(1, calc(100% - 20px));
                    grid-template-rows: repeat(6, 210px);
                }
            }

            @media only screen and (min-width: 600px) {
                & {
                    height: 620px;
                    width: 85%;
                    grid-template-columns: repeat(2, calc(50% - 20px));
                    grid-template-rows: repeat(3, 200px);
                }
            }

            @media only screen and (min-width: 768px) {
                & {
                    height: 720px;
                    width: 85%;
                    grid-template-columns: repeat(2, calc(50% - 20px));
                    grid-template-rows: repeat(3, 220px);
                }
            }

            @media only screen and (min-width: 992px) {
                & {
                    height: 870px;
                    width: 85%;
                    grid-template-columns: repeat(2, calc(50% - 20px));
                    grid-template-rows: repeat(3, 270px);
                }
            }

            @media only screen and (min-width: 1200px) {
                & {
                    height: 480px;
                    width: 85%;
                    grid-template-rows: repeat(2, calc(50% - 20px));
                    grid-template-columns: repeat(3, 300px);
                }
            }
        }
        div.loading-spinner {
            height: calc(100% - 60px);
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
            }
        }
    }
</style>