<script>
    // Import svgs
    import LogIn from "$lib/assets/svgs/LogIn.svelte"

    // Import components
    import Banner from "$lib/components/Banner.svelte"
    import AutoScroll from "$lib/components/AutoScroll.svelte"

    // Variables indicating which form to show
    let mode = "login"
</script>

<Banner>
    <LogIn slot="svg"/>
    <h1>Login</h1>
    <AutoScroll>
        <h2>Log In To An Existing Account Or Create One</h2>
    </AutoScroll>
</Banner>

<div class="page">
    <div class="pageContent">
        <div class="block">
            <div class="tabs">
                <button class="button-slim" type="button"
                    class:active={mode === "login"}
                    on:click={() => {mode = "login"}}
                >
                    <h2>Login</h2>
                </button>
                <button class="button-slim" type="button"
                    class:active={mode === "register"}
                    on:click={() => {mode = "register"}}
                >
                    <h2>Register</h2>
                </button>
            </div>
            <div class="centered">
                {#if mode === "login"}
                    <form>
                        <h1>Log In To Your Account</h1>
                        <div>
                            <label for="email"><h3>Email Address</h3></label>
                            <input name="email" id="email" required autocomplete="email">
                        </div>
                        <div>
                            <label for="password"><h3>Password</h3></label>
                            <input name="password" id="password" required autocomplete="current-password">
                        </div>
                        <button class="button-pill" type="submit"><h2>Login</h2></button>
                    </form>
                {:else if mode === "register"}
                    <form>
                        <h1>Create A New Account</h1>
                        <div>
                            <label for="username"><h3>Username</h3></label>
                            <input name="username" id="username" required autocomplete="username">
                        </div>
                        <div>
                            <label for="email"><h3>Email Address</h3></label>
                            <input name="email" id="email" required autocomplete="email">
                        </div>
                        <div>
                            <label for="password"><h3>Password</h3></label>
                            <input name="password" id="password" required autocomplete="new-password">
                        </div>
                        <button class="button-pill" type="submit"><h2>Register</h2></button>
                    </form>
                {/if}
            </div>
        </div>
    </div>
</div>

<style lang="scss">

    .pageContent {
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .block {
        width: 75%;
        min-width: fit-content;
        min-width: -moz-fit-content;
        max-width: 40rem;

        height: max-content;

        .tabs {
            display: flex;
            gap: 1rem;
        }

        form {
            display: grid;
            grid-auto-flow: row;
            gap: 1rem;

            input {
                width: 100%;

                padding-top: 2px;
                padding-left: 2px;

                background: none;
                border-width: 0 0 1px 0 !important;
                border: solid var(--tx-4);
                border-radius: 0;

                font-size: inherit;
                color: inherit;
                font-weight: 400;

                text-align: center;

                transition: border-color 200ms ease-in-out;
                &:focus {
                    outline: none;
                    border-color: var(--br-3);
                }
            }
        }

        h1 {
            font-size: 1.25rem;
            font-weight: 600;
        }
        h2 {
            font-size: 1rem;
        }
        h3 {
            font-size: 0.75rem;
            color: var(--tx-4);
            font-weight: 600;
        }
    }


    .centered {
        width: 75%;
        min-width: fit-content;
        min-width: -moz-fit-content;
        max-width: 50%;

        margin-inline: auto;
    }

</style>