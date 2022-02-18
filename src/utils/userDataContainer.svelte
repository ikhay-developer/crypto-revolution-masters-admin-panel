<script lang="ts">
    export let username:string
    export let email:string

    let showFullText = "none"
</script>

<div>
    <p 
        on:click={_ => showFullText = showFullText == "none" ? "username" : "none"} 
        style="display: {showFullText == "username" ? "block": showFullText == "none" ? "block" : "none"}; width: {showFullText == "username" ? "100%" : "50%"};"
    >
        {#if showFullText == "username"}
            <kbd>Username</kbd> {username}
        {:else}
            {username}
        {/if}
    </p>
    <p 
        on:click={_ => showFullText = showFullText == "none" ? "email" : "none"} 
        style="display: {showFullText == "email" ? "block": showFullText == "none" ? "block" : "none"}; width: {showFullText == "email" ? "100%" : "50%"};"
    >
        {#if showFullText == "email"}
            <kbd>Email</kbd> {email}
        {:else}
            {email}
        {/if}
    </p>
</div>

<style scoped lang="less">
    div {
        width: calc(100% - 34px);
        padding-left: 15px;
        height: 35px;
        padding: 5px;
        display: flex;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
        border-style: solid;
        border-width: 1px;
        border-top-width: 0px;
        border-color: #d6d6d6;
        p {
            height: fit-content;
            font-weight: 600;
            padding: 0;
            margin: 0;
            width: 50%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
        }
        kbd {
            border-radius: 5px;
            height: fit-content;
            background-color: #3a3a3a;
            color: white;
            padding: 0.15rem 0.4rem;
        }
    }
</style>