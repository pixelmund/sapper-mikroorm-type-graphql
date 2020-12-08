<script>
  import { getContext } from "svelte";
  import ErrorMessage from "./ErrorMessage.svelte";
  export let name: string;
  export let formKey: string;
  export let type: "email" | "password" | "date" | "text" | string;
  export let label: string = "";
  export let full: boolean = true;
  let className: string = "";

  export { className as class };

  const { form, handleChange, touched, errors } = getContext(formKey);
</script>

<label
  class:w-full={full}
  class="block py-1 mt-2 font-semibold text-gray-600 text-xs uppercase tracking-wide"
  for={name}>
  <div class="flex justify-between items-center">
    {label}
    <ErrorMessage {formKey} {name} />
  </div>
  <input
    on:change={handleChange}
    on:blur={handleChange}
    {...$$restProps}
    value={$form[name]}
    class="py-2.5 mt-1 pl-2 pr-4 {full ? 'w-full' : ''} bg-gray-50 rounded text-gray-900 focus:outline-none ring ring-opacity-0 ring-offset-indigo-700 ring-indigo-600 focus:ring-opacity-30 {className}"
    {type}
    {name} />
</label>
