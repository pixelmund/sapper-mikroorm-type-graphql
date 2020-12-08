<script>
  import { getContext } from "svelte";
  import { key } from "./key";

  export let name: string;

  const { errors, touched } = getContext(key);
</script>

<span
  class="text-red-500 tracking-wide">{$touched[name] && $errors[name] && $errors[name].length > 0 ? $errors[name] : ''}</span>
