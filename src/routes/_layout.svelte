<script context="module">
  import { client } from "../apolloClient";

  export const preload = () => {};
</script>

<script>
  import { setClient } from "svelte-apollo";

  setClient(client);

  export let segment: string = "";
  if (segment) {}
  
</script>

<slot />
