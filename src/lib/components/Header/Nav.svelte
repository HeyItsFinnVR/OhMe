<script>
    // Import svgs
    import Close from "$lib/assets/svgs/Close.svelte"
    import Menu from "$lib/assets/svgs/Menu.svelte";

    // Import functions to handle lifecycle events
    import { onMount } from "svelte"

    // Let links be passed to component as prop
    export let links

    // The html element containing collapsible content
    let collapsible

    // The html element that toggles the dropdown
    let dropdownButton

    // Variables indicating collapsible and dropdown state
    let collapsed = true
    let dropdown = false

    // Define function to be ran on mount and resize
    const onResize = () => {
        // Get width of the collapsible container
        let containerWidth = collapsible.clientWidth

        // Get width of dropdown toggle button
        let dropdownButtonWidth = dropdownButton.clientWidth

        // Get all items in collapsible container
        let collapsibleItems = [...collapsible.getElementsByTagName("h2")]
        
        // Calculate total width of all items in "collapsibleItems"
        let totalItemWidth = collapsibleItems.reduce((total, item) => total + item.clientWidth, 0)

        // Get gap between items in "collapsible"
        let collapsibleGap = Number(window.getComputedStyle(collapsible).columnGap.slice(0,-2))

        // Calculate the extra spacing required to fit all items in "collapsibleItems"
        let spacingWidth = collapsibleGap * (collapsibleItems.length -1)   

        // Calcualte the extra width taken up by elements that only appear when "collapsed == true"
        // "collapsed" will be [ true or flase ] therefore static difference will be [ 0 or {dropdownButtonWidth} ]
        let staticDifference = (dropdownButtonWidth) * collapsed

        // Set boolean to control "collapsible" is collapsed
        collapsed = (containerWidth + staticDifference < totalItemWidth + spacingWidth)

        // "dropdown" = it's current value if collapsed is true or false if collapsed is false
        // This logic closes the dropdown if there is enough space for collaspible div,
        // meaning the dropdown is no longer necessary
        dropdown = collapsed ? dropdown : false
    }

    // Define function to toggle "dropdown"
    const toggleDropdown = () => {
        dropdown = !dropdown
    }

    // When component is mounted, get inital value for "collapsed"
    onMount(() => {
        onResize()
    })
</script>

<!-- Add an event listener to call "onResize" function -->
<svelte:window on:resize={onResize}/>

<nav>
    {#if $$slots.brand}
        <a class="brand" href="/">
            <slot name="brand"/>
        </a>
    {/if}
    <div class="collapse" class:collapsed={collapsed} bind:this={collapsible}>
        <ul class="navLinks">
            {#each links as link}
                <li class="navLink">
                    <a href={link.href}>
                        <h2>{link.text}</h2>
                    </a>
                </li>
            {/each}
        </ul>
        {#if $$slots.default}
            <div class="extra">
                <slot/>
            </div>
        {/if}
    </div>
    <div class="static" class:collapsed={collapsed}>
        {#if $$slots.static}
            <slot name="static"/>
        {/if}
        <button class="dropdown-button button-slim" class:collapsed={!collapsed} type="button" 
            title={dropdown ? "close dropdown":"open dropdown"}
            on:click={toggleDropdown}
            bind:this={dropdownButton}
        >
        {#if dropdown}
            <Close/>
        {:else}
            <Menu/>
        {/if}
        </button>
        
    </div>
    {#if collapsed && dropdown}
        <div class="dropdown">
            <ul class="navLinks">
                {#each links as link}
                    <li class="navLink">
                        <a href={link.href}>
                            <h2>{link.text}</h2>
                        </a>
                    </li>
                {/each}
            </ul>
            {#if $$slots.default}
                <div class="extra">
                    <slot/>
                </div>
            {/if}
        </div>
    {/if}
</nav>

<style lang="scss">

    nav {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: space-between;

        padding-top: 0.75rem;
        padding-bottom: 0.75rem;

        background-color: var(--bg-3);
        color: var(--tx-1);

        >.brand {
            margin-right: 1rem;

            display: flex;
            align-items: center;

            color: var(--br-3);
            font-size: 2rem;
            font-weight: 100;
        }

        >.collapse {
            overflow: hidden;

            flex: 1 1 auto;

            display: flex;
            align-items: center;
            column-gap: 1rem;

            &.collapsed {
                >* {
                    visibility: hidden;
                }
            }

            >.navLinks {
                margin-left: auto;
                margin-right: auto;
                
                display: flex;
                gap: 1rem;

                font-size: 1rem;
                font-weight: 400;

                >.navLink {
                    padding: 0;

                    transition: color 200ms ease-in-out;
                    &:hover {
                        color: var(--br-3);
                    }
                }
            }

            >.extra {
                >:global(button) {
                    font-size: 1rem;
                }
            }
        }

        >.static {
            padding: 0rem 0;
            margin-left: 1rem;

            display: flex;
            align-items: center;
            gap: 1rem;

            &.collapsed {
                margin-left: 0;
            }

            >.dropdown-button {
                height: 1.5rem;

                &.collapsed {
                    visibility: hidden;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                >:global(svg) {
                    height: 100%;
                }
            }

            >:global(button) {
                font-size: 1rem;
            }
        }

        >.dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;

            background-color: var(--bg-3);
            color: var(--tx-1);

            border: solid var(--bg-4);
            border-width: 1px 0 0 0;

            >.navLinks {
                font-size: 1rem;

                >.navLink {
                    transition: background-color 200ms ease-in-out;
                    &:hover {
                        background-color: var(--bg-4);
                    }

                    >a {
                        display: block;
                        padding: 1rem;
                    }
                }
            }

            >.extra {
                padding: 1rem;

                display: grid;
                gap: 1rem;

                :global(button) {
                    background-color: var(--sc-1);
                    color: var(--br-4);
                    padding: 0.5em 1em;
                    border-radius: 1000px;

                    transition: background-color 200ms ease-in-out;
                    &:hover {
                        color: var(--br-4);
                        background-color: var(--sc-2);
                    }
                }
            }
        }
    }

</style>