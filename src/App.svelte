<script lang="ts">
	import Navbar from "./components/navbar.svelte"
	import Loginpage from "./components/loginpage.svelte"
	import { Settings, Users, Ads } from "./components/tabs"
	import { addDataOption, currentTab, isLogin } from "./store"
	import Addpage from "./components/addpage.svelte"
</script>

<main>
	{#if $isLogin}
		<Navbar />
		{#if $currentTab == "settings"}
			<Settings />
		{:else if $currentTab == "users"}
			<Users />
		{/if}
		<Ads />
		{#if $addDataOption.show && $addDataOption.page != "none"}
			<Addpage />
		{/if}
	{:else}
		<Loginpage />
	{/if}
</main>

<style lang="less" scoped>
	main {
		position: fixed;
		width: 100%;
		height: 100%;
		display: flex;
		/* Extra small devices (phones, 600px and down) */
        @media only screen and (max-width: 600px) {
            & {
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				align-content: space-between;
            }
        }

        /* Small devices (portrait tablets and large phones, 600px and up) */
        @media only screen and (min-width: 600px) {
            & {
				flex-direction: column;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				align-content: space-between;
            }
        }

        /* Medium devices (landscape tablets, 768px and up) */
        @media only screen and (min-width: 768px) {
            & {
				flex-direction: column;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				align-content: space-between;
            }
        }

        /* Large devices (laptops/desktops, 992px and up) */
        @media only screen and (min-width: 992px) {
            & {
				flex-direction: column;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				align-content: space-between;
            }
        }

        /* Extra large devices (large laptops and desktops, 1200px and up) */
        @media only screen and (min-width: 1200px) {
            & {
				flex-direction: column;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				align-content: space-between;
            }
        }
	}
</style>