<script lang="ts">
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"

    export let message:string
    export let image:string
    export let link:string
    export let date:string

    let isLoading = true
</script>

<main>
    <div style:display="{ isLoading ? "flex" : "none" }" class="loading-spinner">
        <Circle color="#303030" size={45} unit="px" />
    </div>
    <div style:display="{ !isLoading ? "block" : "none" }" class="container">
        <img src={image} alt="" on:load={_ => isLoading = false}>
        <p id="link" on:click={_ => window.open(link)} target="blank">{link}</p>
        <p id="message">
            {message}
        </p>
        <p id="date">
            {date}
        </p>
    </div>
</main>

<style lang="less" scoped>
    main {
        width: 100%;
        height: 100%;
        padding: 5px;
        padding-bottom: 10px;
        margin: 0;
        div.container {
            width: calc(100% - 20px);
            height: fit-content;
            border-style: solid;
            border-width: 1px;
            border-color: #bdbdbd;
            border-radius: 3px;
            img {
                width: 100%;
                height: 260px;
                border-width: 1px;
                border-color: #bdbdbd;
                margin-bottom: 7px;
                border-top-left-radius: 3px;
                border-top-right-radius: 3px;
            }
            p#link {
                margin: 0;
                padding: 10px;
                padding-top: 0;
                padding-bottom: 0;
                color: #318ce7;
                width: calc(100% - 20px);
                height: 25px;
                text-decoration: none;
                text-overflow: ellipsis;
                overflow: hidden; 
                height: 1.2em; 
                white-space: nowrap;
                &:hover {
                    text-decoration: underline;
                    cursor: pointer;
                }                
            }
            p {
                margin-bottom: 5px;
                padding: 10px;
                padding-top: 5px;
                padding-bottom: 5px;
            }
            p#message {
                padding-top: 0;
                margin-top: 7px;
            }
            p#date {
                margin-bottom: 10px;
                font-weight: 700;
                padding-top: 0;
                font-size: 15.75px;
                text-align: right;
            }
        }
        div.loading-spinner {
            width: calc(100% - 10px);
            height: calc(300px - 10px);
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;
            flex-wrap: nowrap;
        }
    }
</style>