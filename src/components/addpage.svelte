<script lang="ts">
    import Circle from "svelte-loading-spinners/dist/ts/Circle.svelte"
    import { scale } from "svelte/transition"
    import { addDataOption } from "../store"

    let showUplaodedImage = false

    let uploadedUrl = null

    let hasError = false

    let uploadingError = false

    let message:string = String()

    let titleORLink:string = String()

    let isOnline:boolean = window.navigator.onLine

    let fileInputer:HTMLInputElement = null

    let isLoading:boolean = false

    let fullImage:HTMLImageElement = null

    const loadImage = (e) => {
        if (fileInputer != null && isOnline) {
            let data = new FormData()
            data.append('file', fileInputer.files[0])
            isLoading = true
            fetch(`https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/upload/${$addDataOption.page == "message" ? "message-images" : "ads-images"}`, {
                method: "POST",
                body: data
            })
            .then(data => {
                return data.json()
            })
            .then(data => {
                if (data.state == "success") {
                    if (fullImage != null) {
                        fullImage.src = data.data.imageUrl
                        fullImage.onload = () => {
                            isLoading = false
                            showUplaodedImage = true
                            uploadedUrl = data.data.imageUrl
                            hasError = false
                        }
                        fullImage.onerror = () => {
                            uploadedUrl = null
                            showUplaodedImage = false
                            hasError = true
                            isLoading = false
                        }
                    }
                } else {
                    hasError = true
                    isLoading = false
                }
            })
            .catch(_ => {
                hasError = true
                isLoading = false
            })
        }
    }

    const checkConnection = () => {
        isOnline = window.navigator.onLine
        requestAnimationFrame(checkConnection)
    }

    requestAnimationFrame(checkConnection)

    let isPosting:boolean = false

    $:shouldPost = (isOnline && !isLoading && showUplaodedImage && !hasError && uploadedUrl != null && message != String() && titleORLink != String())

    const postData = () => {
        if (shouldPost) {
            isPosting = true
            if ($addDataOption.page == "ad") {
                fetch(`https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/ads/${$addDataOption.input.id}`, { 
                    method: "POST",
                    body: JSON.stringify({
                        "link": titleORLink,
                        "message": message,
                        "image": uploadedUrl
                    }),
                    headers:  {
                        "Accept": "*/*",
                        "Content-Type": "application/json"
                    }
                }).then(function(response) {
                    return response.json()
                }).then(function(data) {
                    isPosting = false
                    if (data.state == "success") {
                        $addDataOption = {
                            show: false,
                            page: "none",
                            input: null,
                            output: {
                                from: "ad",
                                data: data.data
                            }
                        }
                    } else {
                        throw new Error()
                    }
                }).catch(_ => {
                    uploadingError = true
                })
            } else if ($addDataOption.page == "message") {
                fetch("https://crypto-revolution-masters.herokuapp.com/7sEEgy4Gz1O7yFBXvjd7N0NyIGWIRg8D/admin/message", { 
                    method: "POST",
                    body: JSON.stringify({
                        "link": titleORLink,
                        "message": message,
                        "image": uploadedUrl
                    }),
                    headers: {
                        "Accept": "*/*",
                        "Content-Type": "application/json"
                    }
                }).then(function(response) {
                    return response.json()
                }).then(function(data) {
                    isPosting = false
                    if (data.state == "success") {
                        $addDataOption = {
                            show: false,
                            page: "none",
                            input: null,
                            output: {
                                from: "message",
                                data: data.data
                            }
                        }
                    } else {
                        throw new Error()
                    }
                }).catch(_ => {
                    uploadingError = true
                })
            }
        }
    }
</script>

{#if $addDataOption.show && $addDataOption.page != "none"}
    <main>
        {#if isOnline}
            <div class="container" in:scale={{duration: 230, opacity: 0}}>
                <header>
                    <img style="opacity: { !isPosting ? "1" : "0" };" on:click={_ => {
                        if (uploadedUrl != null) {
                            fetch(uploadedUrl, { 
                                method: "DELETE",
                                headers: {
                                    "Accept": "*/*"
                                }
                            })
                            .then(_ => null)
                            .catch(_ => null)
                        }
                        if (fileInputer != null) {
                            fileInputer.value = null
                        }
                        $addDataOption = {
                            show: false,
                            page: "none",
                            input: null,
                            output: null
                        }
                    }} src="./img/x.svg" alt="">
                    <span>
                        {($addDataOption.page == "ad" && !isPosting)  ? "Create new AD" : (isPosting && !uploadingError) ? `Uploading ${$addDataOption.page == "ad" ? "AD" : "message" }` : (isPosting && uploadingError) ? "" : "Create new message" }
                    </span>
                    <button on:click={postData} style="opacity: { shouldPost && !isPosting ? "1" : "0" };">
                        Post
                    </button>
                </header>
                <footer class="uploading-error" style:display={ !isPosting && uploadingError ? "flex" : "none" }>
                    <img id="upload-image-fill" src="./img/error-mark.svg" alt="">
                    <p style:color="#b71c1c">Upload error occur</p>
                    <button on:click={_ => {
                        uploadingError = false
                    }} id="refresh-btn">Refresh</button>  
                </footer>
                <footer class="loading-screen" style:display={ isPosting && !uploadingError ? "flex" : "none" }>
                    <Circle color="#303030" size={115} unit="px" /> 
                </footer>
                <footer class="body" style:display={ !isPosting && !uploadingError ? "flex" : "none" }>
                    <div id="upload-image">
                        {#if !isLoading && !showUplaodedImage && uploadedUrl == null && !hasError}
                            <img id="upload-image-fill" src="./img/image-fill.svg" alt="">
                            <p>Upload image</p>
                            <button on:click={_ => {
                                if (fileInputer != null) {
                                    fileInputer.value = null
                                    fileInputer.click()
                                }
                            }} id="upload">Select from computer</button>
                        {:else if !isLoading && !showUplaodedImage && uploadedUrl == null && hasError}
                            <img id="upload-image-fill" src="./img/error-mark.svg" alt="">
                            <p style:color="#b71c1c">Image upload error occur</p>
                            <button on:click={_ => {
                                isLoading = true
                                setTimeout(() => {
                                    hasError = false
                                    isLoading = false
                                }, 200)
                            }} id="refresh-btn">Refresh</button>  
                        {:else if isLoading}
                            <Circle color="#303030" size={65} unit="px" />                            
                        {/if}
                        <img style:display={(!isLoading && showUplaodedImage && uploadedUrl != null && !hasError) ? "block" : "none"} bind:this={fullImage} id="full-image" src={(!isLoading && showUplaodedImage && uploadedUrl != null && !hasError) ? uploadedUrl : ""} alt="">
                    </div>
                    <div id="upload-text">
                        <input type="text" placeholder={$addDataOption.page == "ad" ? "Type link" : "Type link"} bind:value={titleORLink}>
                        <textarea placeholder="Type message" bind:value={message}></textarea>
                    </div>
                </footer>
            </div> 
            <input on:change={loadImage} style:display="none" bind:this={fileInputer} accept="image/*" type="file">
        {:else}
            <div class="no-connection">
                <img src="./img/globe.svg" alt="no connection">
                <span>No connection</span>
            </div>
        {/if}
        
    </main>
{/if}

<style lang="less" scoped>
    main {
        z-index: 10;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0 0 0 / 0.75);
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        flex-direction: column;
        flex-wrap: nowrap;
        div.no-connection {
            height: 425px;
            width: 580px;
            background-color: white;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            flex-direction: column;
            flex-wrap: nowrap;
            border-style: solid;
            border-radius: 7px;
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
        div.container {
            background-color: white;
            border-width: 0;
            border-style: solid;
            border-radius: 7px;
            height: 425px;
            width: 580px;
            footer.uploading-error {
                height: calc(100% - 50px);
                width: 100%;
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                align-content: center;
                background-color: #f5f5f5;
                border-width: 0;
                border-style: solid;
                border-radius: 0;
                border-bottom-left-radius: 7px;
                border-bottom-right-radius: 7px;
                p {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    font-weight: 500;
                    font-size: 18px;
                }
                img {
                    width: 100px;
                    height: 100px;
                }
                button#refresh-btn {
                    font-size: 15.5px;
                    background-color: #303030;
                    height: 30px;
                    font-weight: bold;
                    border-style: solid;
                    border-width: 0;
                    border-radius: 5px;
                    width: 95px;
                    color: white;
                }
            }
            footer.loading-screen {
                height: calc(100% - 50px);
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                align-content: center;
                background-color: #f5f5f5;
                border-width: 0;
                border-style: solid;
                border-radius: 0;
                border-bottom-left-radius: 7px;
                border-bottom-right-radius: 7px;
            }
            footer.body {
                height: calc(100% - 50px);
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: flex-start;
                align-content: center;
                div {
                    width: 50%;
                    height: 100%;
                    border-width: 0;
                    border-style: solid;
                    border-radius: 0;
                    border-bottom-left-radius: 7px;
                    border-bottom-right-radius: 7px;
                    &#upload-image {
                        height: 100%;
                        background-color: #f5f5f5;
                        border-bottom-right-radius: 0;
                        border-width: 0;
                        border-style: solid;
                        border-color: #d6d6d6;
                        padding: 0;
                        display: flex;
                        flex-direction: column;
                        flex-wrap: wrap;
                        align-content: center;
                        align-items: center;
                        justify-content: center;
                        button#refresh-btn {
                            font-size: 15.5px;
                            background-color: #303030;
                            height: 30px;
                            font-weight: bold;
                            border-style: solid;
                            border-width: 0;
                            border-radius: 5px;
                            width: 95px;
                            color: white;
                        }
                        button#upload {
                            font-size: 15.5px;
                            background-color: #303030;
                            height: 30px;
                            font-weight: bold;
                            border-style: solid;
                            border-width: 0;
                            border-radius: 5px;
                            width: 185px;
                            color: white;
                        }
                        p {
                            margin-top: 10px;
                            margin-bottom: 10px;
                            font-weight: 500;
                            font-size: 18px;
                        }
                        img#upload-image-fill {
                            width: 100px;
                            height: 100px;
                        }
                        img#full-image {
                            width: 100%;
                            height: 100%;
                            border-width: 0;
                            border-style: solid;
                        }
                        
                        @media only screen and (min-width: 600px) {
                            & {
                                border-right-width: 1px;
                                width: calc(50% - 1px);
                                img {
                                    border-bottom-left-radius: 7px;
                                }
                            }
                        }
                        @media only screen and (max-width: 600px) {
                            & {
                                border-bottom-width: 1px;
                                height: calc(50% - 1px);
                                
                            }
                        }

                    }
                    &#upload-text {
                        border-bottom-left-radius: 0;
                        input[type="text"] {
                            color: #575555;
                            height: 35px;
                            padding: 10px;
                            border-width: 0;
                            border-style: solid;
                            border-radius: 0;
                            padding-top: 5px;
                            padding-bottom: 5px;
                            font-size: 16px;
                            width: calc(100% - 20px);
                            &:focus {
                                outline: none;
                            }
                        }
                        textarea {
                            resize: none;
                            border-width: 0;
                            color: #575555;
                            border-style: solid;
                            border-bottom-right-radius: 7px;
                            width: calc(100% - 20px);
                            height: calc(100% - 58px);
                            border-top-width: 1px;
                            border-color: #d6d6d6;
                            padding: 10px;
                            padding-top: 5px;
                            padding-bottom: 5px;
                            font-size: 16px;
                            &::-webkit-scrollbar {
                                width: 10px;
                                border-bottom-right-radius: 7px;
                            }
                            &::-webkit-scrollbar-track {
                                background: white; 
                                border-bottom-right-radius: 7px;
                            }
                            &::-webkit-scrollbar-thumb {
                                background: #bdbdbd; 
                            }
                            &::-webkit-scrollbar-thumb:hover {
                                background: #9e9e9e; 
                            }
                            &:focus {
                                outline: none;
                            }
                        }
                    }
                    @media only screen and (max-width: 600px) {
                        & {
                            width: 100%;
                            height: 50%;
                            flex-direction: column;
                            &#upload-text {
                                border-bottom-left-radius: 7px;
                                textarea {
                                    border-bottom-left-radius: 7px;
                                }
                            }
                        }
                    }
                }
            }
            header {
                width: calc(100% - 30px);
                height: 50px;
                border-style: solid;
                border-width: 0;
                border-bottom-width: 1px;
                border-color: #d6d6d6;
                display: flex;
                padding-left: 15px;
                padding-right: 15px;
                flex-direction: row;
                align-items: center;
                align-content: center;
                flex-wrap: wrap;
                justify-content: space-between;
                img {
                    width: 20px;
                    height: 22px;
                }
                span {
                    color: #212121;
                    font-size: 18px;
                    font-weight: 500;
                }
                button {
                    font-size: 14.5px;
                    height: 30px;
                    font-weight: bold;
                    border-style: solid;
                    border-width: 0;
                    border-radius: 5px;
                    width: 65px;
                    background-color: lighten(#303030, 6.5%);
                    color: white;
                    &:hover {
                        background-color: #303030;
                    }
                    &:disabled {
                        background-color: lighten(#303030, 25%);
                    }
                }
            }
            @media only screen and (max-width: 600px) {
                & {
                    width: 90%;
                    height: 575px;
                }
            }
        }
    }
</style>