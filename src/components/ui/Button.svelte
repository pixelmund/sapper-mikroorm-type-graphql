<script>
  let _className: string = "";
  export { _className as class };

  export let variant: "primary" | "secondary" | "outline" | "none" = "primary";
  export let href: string | undefined = undefined;
  export let full: boolean = false;
  export let size: "normal" | "small" = "normal";
  export let tag: "a" | "button" | "div" | "span" = href ? "a" : "button";

  $: if (tag !== "button" && tag !== "div" && tag !== "span" && tag !== "a") {
    throw new Error("Button.svelte Invalid tag '" + tag + "'");
  }

  const className = {
    primary:
      "border text-white bg-indigo-500 hover:bg-indigo-400 focus:border-indigo-700 active:bg-indigo-600",
    secondary:
      "border text-white bg-purple-500 hover:bg-purple-400 focus:border-purple-700 active:bg-purple-600",
    outline:
      "border-2 text-primary border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:border-gray-500 active:border-gray-500",
    none: "border-2 focus:border-gray-200 dark:focus:border-gray-800",
  };
</script>

{#if tag === 'button'}
  <button
    class="inline-flex text-center cursor-pointer outline-none focus:outline-none items-center border-transparent text-base leading-6 font-semibold rounded-md transition {full ? 'w-full' : ''} {size === 'normal' ? 'px-4 py-1.5' : 'px-3 py-1'} {className[variant]} {_className}"
    on:click
    {...$$restProps}>
    <slot />
  </button>
{:else if tag === 'span'}
  <span
    class="inline-flex text-center cursor-pointer outline-none focus:outline-none items-center border-transparent text-base leading-6 font-semibold rounded-md transition {full ? 'w-full' : ''} {size === 'normal' ? 'px-4 py-1.5' : 'px-3 py-1'} {className[variant]} {_className}"
    on:click
    {...$$restProps}>
    <slot />
  </span>
{:else if tag === 'div'}
  <div
    class="inline-flex text-center cursor-pointer outline-none focus:outline-none items-center border-transparent text-base leading-6 font-semibold rounded-md transition {full ? 'w-full' : ''} {size === 'normal' ? 'px-4 py-1.5' : 'px-3 py-1'} {className[variant]} {_className}"
    on:click
    {...$$restProps}>
    <slot />
  </div>
{:else if tag == 'a'}
  <a
    {href}
    class="inline-flex text-center cursor-pointer outline-none focus:outline-none items-center border-transparent text-base leading-6 font-semibold rounded-md transition {full ? 'w-full' : ''} {size === 'normal' ? 'px-4 py-1.5' : 'px-3 py-1'} {className[variant]} {_className}"
    on:click
    {...$$restProps}>
    <slot />
  </a>
{/if}
