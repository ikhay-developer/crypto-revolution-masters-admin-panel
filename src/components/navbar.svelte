<script lang="ts">
    import { currentTab, isNavBarMaximize } from "../store"

    let Navbar:HTMLElement

    $:NavbarToggle = false

    $:{
        if (Navbar != undefined) {
            if (NavbarToggle) {
                Navbar.style.setProperty("--not-xs-span-display", "none")
                Navbar.style.setProperty("--sm-screen-width", "60px")
                Navbar.style.setProperty("--md-screen-width", "60px")
                Navbar.style.setProperty("--lg-screen-width", "60px")
                $isNavBarMaximize = false
            } else {
                Navbar.style.setProperty("--not-xs-span-display", "block")
                Navbar.style.setProperty("--sm-screen-width", "200px")
                Navbar.style.setProperty("--md-screen-width", "240px")
                Navbar.style.setProperty("--lg-screen-width", "280px")
                $isNavBarMaximize = true
            }
        }
    }

</script>

<nav bind:this={Navbar}>
    <button
        on:click={_ => NavbarToggle = !NavbarToggle}
    >
        <img src="./img/justify.svg" alt="jus">
    </button>
    <button 
        title="Message"
        on:click={_ => $currentTab = "message"}
        style="border-color: {$currentTab == "message" ? "white": "transparent"}"
    >
        <img src="./img/message.svg" alt="msg">
        <span>Message</span>
    </button>
    <button
        title="Favourite"
        on:click={_ => $currentTab = "favourite"}
        style="border-color: {$currentTab == "favourite" ? "white": "transparent"}"
    >
        <img src="./img/favourite-coin.svg" alt="fav">
        <span>Favourite</span>
    </button>
    <button
        title="Ads"
        on:click={_ => $currentTab = "ads"}
        style="border-color: {$currentTab == "ads" ? "white": "transparent"}"
    >
        <img src="./img/ads.svg" alt="ads">
        <span>Ads</span>
    </button>
    <button
        title="Users"
        on:click={_ => $currentTab = "users"}
        style="border-color: {$currentTab == "users" ? "white": "transparent"}"
    >
        <img src="./img/users.svg" alt="urs">
        <span>Users</span>
    </button>
    <button
        title="Settings"
        on:click={_ => $currentTab = "settings"}
        style="border-color: {$currentTab == "settings" ? "white": "transparent"}"
    >
        <img src="./img/settings.svg" alt="stgs">
        <span>Settings</span>
    </button>
</nav>

<style scoped lang="less">
    .nav-not-xs() {
        padding-top: 15px;
        padding-bottom: 15px;
        flex-direction: column;
        flex-wrap: wrap;
        align-content: flex-start;
        button {
            width: 100%;
            height: 50px;
            padding: 5px;
            padding-left: 15px;
            padding-right: 15px;
            border-left-width: 4px;
            border-color: transparent;
            justify-content: flex-start;
            span {
                color: white;
                display: var(--not-xs-span-display);
                font-size: 16.25px;
                margin-left: 10px;
            }
            &:nth-child(1) {
                border-left-width: 0;
                width: 60px;
                margin-top: 15px;
                &:hover {
                    background-color: #3a3a3a;
                }
            }
        }
    }
    nav {
        background-color: #303030;
        box-shadow: 0 2px 2px 0px #d6d6d6;
        display: flex;
        --not-xs-span-display: block;
        --sm-screen-width: 200px;
        --md-screen-width: 240px;
        --lg-screen-width: 280px;
        button {
            background-color: transparent;
            border-width: 0;
            border-style: solid;
            display: flex;
            align-items: center;
            &:focus {
                outline: none;
            }
            &:hover {
                background-color: #3a3a3a;
            }
            img {
                height: 25px;
                width: 25px;
            }
        }
        /* Extra small devices (phones, 600px and down) */
        @media only screen and (max-width: 600px) {
            & {
                width: 100%;
                height: 45px;
                button {
                    width: calc(100%/5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-bottom-width: 4px;
                    &:nth-child(1) { 
                        display: none;
                    }
                    span {
                        display: none;
                    }
                }
            }
        }

        /* Small devices (portrait tablets and large phones, 600px and up) */
        @media only screen and (min-width: 600px) {
            & {
                height: 100%;
                width: var(--sm-screen-width);
                .nav-not-xs()
            }
        }

        /* Medium devices (landscape tablets, 768px and up) */
        @media only screen and (min-width: 768px) {
            & {
                height: 100%;
                width: var(--md-screen-width);
                .nav-not-xs()
            }
        }

        /* Large devices (laptops/desktops, 992px and up) */
        @media only screen and (min-width: 992px) {
            & {
                height: 100%;
                width: var(--lg-screen-width);
                .nav-not-xs()
            }
        }

        /* Extra large devices (large laptops and desktops, 1200px and up) */
        @media only screen and (min-width: 1200px) {
            & {
                height: 100%;
                width: var(--lg-screen-width);
                .nav-not-xs()
            }
        }
    }
</style>