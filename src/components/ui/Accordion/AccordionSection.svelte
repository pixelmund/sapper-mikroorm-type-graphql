<script context="module">
    export const ACCORDION = {};
</script>

<script>
    import { getContext } from "svelte";
    export let title: string | undefined = "";
    let open: boolean | undefined = false;
    export let className: string | undefined = "";
    export let key: any | undefined = undefined;
    $: key = key || title;
    const { handleChange, selected } = getContext(ACCORDION);
    //get selected value from context
    $: open = $selected === key;
</script>

<li class="{className} mb-3">
    <div
        on:click={handleChange.bind(null, key)}
        class="py-4 px-3 cursor-pointer rounded-md mb-1 {className} {open ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-600'} font-bold">
        <slot open={open} name="header">{title}</slot>
    </div>
    <div class={open ? 'block px-0.5' : 'hidden'}>
        <slot open={open} />
    </div>
</li>
