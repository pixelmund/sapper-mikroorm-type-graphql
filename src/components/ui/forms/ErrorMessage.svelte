<script>
  import { getContext } from "svelte";

  export let formKey: string;
  export let name: string;

  const { errors, touched } = getContext(formKey);
</script>

<span class="text-red-600 italic">{$touched[name] && $errors[name] && $errors[name].length > 0 ? $errors[name] : ''}</span>
