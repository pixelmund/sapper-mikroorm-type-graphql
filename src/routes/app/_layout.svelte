<script context="module">
  export const preload: Preload = async function preload(_page, session) {
    if (!!!session.user) {
      return this.redirect(302, "/auth/login");
    }
    return;
  };
</script>

<script>
  import AppHeader from "../../components/Header/AppHeader.svelte";
  import type { Preload } from "@svazzle/common";
</script>

<AppHeader />
<slot />
