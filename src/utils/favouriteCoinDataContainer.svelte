<script lang="ts">
    export let name:string
    export let symbol:string
    export let image: string
    export let current_price:number
    export let market_cap: number
    export let market_cap_rank: number
    export let price_change_percentage_24h: number
    export let price_change_percentage_1h_in_currency: number

    $: {
        if (price_change_percentage_1h_in_currency == null)
            price_change_percentage_1h_in_currency = 0
        if (price_change_percentage_24h == null)
            price_change_percentage_24h = 0
    }
</script>
<div class="container">
    <div class="fixed-head">
        <p id="rank">
            {market_cap_rank}
        </p>
        <p id="name">
            <img src={image} alt={symbol}>
            <span id="name">{name}</span>
            <span id="symbol">{symbol}</span>
            <kbd id="symbol">{symbol}</kbd>
        </p>
    </div>
    <p id="price">
        ${@html current_price.toPrecision(5).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,').replace(/e\+?/, 'E')}
    </p>
    <p style="color: {price_change_percentage_1h_in_currency > 0 ? "#66bb6a" : "#f44336"};" id="change">
        {price_change_percentage_1h_in_currency.toPrecision(2)}%
    </p>
    <p style="color: {price_change_percentage_1h_in_currency > 0 ? "#66bb6a" : "#f44336"};" id="change">
        {price_change_percentage_24h.toPrecision(2)}%
    </p>
    <p id="mkt-cap">
        ${market_cap.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')}
    </p>
</div>
<style lang="less" scoped>
    div.container {
        width: calc(100% - 34px);
        height: 35px;
        display: flex;
        align-items: center;
        border-style: solid;
        border-width: 1px;
        border-top-width: 0px;
        border-color: #d6d6d6;
        p {
            padding: 0;
            margin: 0;
            height: 35px;
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
        kbd {
            border-radius: 5px;
            height: fit-content;
            background-color: #eeeeee;
            color: #3a3a3a;
            padding: 0.15rem 0.4rem;
        }
        div.fixed-head {
            width: calc(65px+100px);
            height: 35px;
            display: flex;
            position: sticky;
            left: 0;
            background-color: white;
            border-style: solid;
            border-color: #d6d6d6;
            border-style: solid;
            border-width: 0px;
            p {
                &#rank {
                    width: 65px;
                    text-align: center;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-content: center;
                    align-items: center;
                    justify-content: space-evenly;
                }
                &#name {
                    width: 100px;
                    text-align: left;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-content: center;
                    align-items: center;
                    justify-content: flex-start;
                    img {
                        width: 20px;
                        height: 20px;
                        margin-right: 10px;
                    }
                    span, 
                    kbd {
                        display: none;
                    }
                    span {
                        font-weight: 600;
                    }
                    @media only screen and (max-width: 600px) {
                        span#symbol {
                            display: block;
                            text-transform: uppercase;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-wrap: break-word;
                        }
                        span#name,
                        kbd#symbol {
                            display: none;
                        }
                    }
                    @media only screen and (min-width: 600px) {
                        span#symbol {
                            display: block;
                            text-transform: uppercase;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-wrap: break-word;
                        }
                        span#name,
                        kbd#symbol {
                            display: none;
                        }
                    }
                    @media only screen and (min-width: 768px) {
                        span#symbol {
                            text-transform: uppercase;
                            display: block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-wrap: break-word;
                        }
                        span#name,
                        kbd#symbol {
                            display: none;
                        }
                    }
                    @media only screen and (min-width: 992px) {
                        span#name {
                            display: block;
                        }
                        span#symbol,
                        kbd#symbol {
                            display: none;
                        }
                    }
                    @media only screen and (min-width: 1200px) {
                        span#symbol {
                            display: none;
                        }
                        span#name,
                        kbd#symbol {
                            display: block;
                        }
                        kbd#symbol {
                            margin-left: 7px;
                            text-transform: uppercase;
                        }
                    }
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
        @media only screen and (max-width: 600px) {
            & {
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
</style>