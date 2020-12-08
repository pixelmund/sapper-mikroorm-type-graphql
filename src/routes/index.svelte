<script context="module">
  export const preload: Preload = async function preload(
    _page,
    session
  ) {
    if (!!session.user) {
      return this.redirect(302, "/app");
    }
    return;
  };
</script>

<script>
  import BaseHeader from "../components/Header/BaseHeader.svelte";
  import type { Preload } from "@svazzle/common";
</script>

<BaseHeader />
