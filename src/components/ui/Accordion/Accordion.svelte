<script>
    import { createEventDispatcher, setContext } from "svelte";
    import { writable } from "svelte/store";
    import { ACCORDION } from "./AccordionSection.svelte";
    export let value: any = undefined;
    export let className: string | undefined = "";
    const dispatch = createEventDispatcher();
    $: isControlled = typeof value !== "undefined";
    const selected = writable(null);
    $: if (isControlled) {
        selected.set(value);
    }
    const handleChange = function (newValue: any) {
        let selectedValue = newValue;
        if (newValue === $selected) {
            selectedValue = undefined;
        }
        if (!isControlled) {
            selected.set(selectedValue);
        }
        dispatch("change", selectedValue);
    };
    setContext(ACCORDION, {
        handleChange,
        selected,
    });
</script>

<ul class={`list-none ${className}`}>
    <slot />
</ul>
