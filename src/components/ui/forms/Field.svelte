<script>
  import { getContext } from "svelte";
  import ErrorMessage from "./ErrorMessage.svelte";
  import { key } from "./key";
  export let name: string;
  export let type: "email" | "password" | "date" | "text" | string;
  export let label: string = "";
  export let full: boolean = true;
  let className: string = "";

  export { className as class };

  const { form, handleChange } = getContext(key);
</script>

<label
  class:w-full={full}
  class="block py-1 rounded mt-2 font-semibold text-muted text-xs uppercase tracking-wide"
  for={name}>
  <div class="flex justify-between items-center">
    {label}
    <ErrorMessage {name} />
  </div>
  <input
    on:change={handleChange}
    on:blur={handleChange}
    {...$$restProps}
    value={$form[name]}
    class="py-2 mt-1.5 pl-2 text-sm pr-4 {full ? 'w-full' : ''} bg-gray-50 dark:bg-gray-800 rounded text-primary outline-none focus:outline-none transition-all focus:ring-2 ring-opacity-80 ring-indigo-500 border border-gray-100 dark:border-transparent dark:border-2 border-transparent focus:border-indigo-400  {className}"
    {type}
    {name} />
</label>
