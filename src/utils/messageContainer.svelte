<script lang="ts">
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"

    export let message:string
    export let image:string
    export let title:string

    let isLoading = true
</script>

<main>
    <div style:display="{ isLoading ? "flex" : "none" }" class="loading-spinner">
        <Circle color="#303030" size={45} unit="px" />
    </div>
    <div style:display="{ !isLoading ? "block" : "none" }" class="container">
        <img src={image} alt="" on:load={_ => isLoading = false}>
        <p id="title">
            {title}
        </p>
        <p id="message">
            {message}
        </p>
    </div>
</main>

<style lang="less" scoped>
    main {
        width: 100%;
        height: 100%;
        padding: 5px;
        margin: 0;
        div.container {
            width: calc(100% - 20px);
            height: auto;
            border-style: solid;
            border-width: 1px;
            border-color: #e0e0e0;
            border-radius: 3px;
            img {
                width: 100%;
                height: 260px;
                border-width: 1px;
                border-color: #e0e0e0;
                border-top-left-radius: 3px;
                border-top-right-radius: 3px;
            }
            p {
                margin-top: 5px;
                margin-bottom: 5px;
                padding: 10px;
                padding-top: 5px;
                padding-bottom: 5px;
            }
            p#title {
                font-size: 22px;
                font-weight: 700;
                color: rgb(10, 10, 10);
            }
            p#message {
                padding-top: 0;
                margin-top: 0;
                margin-bottom: 20px;
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