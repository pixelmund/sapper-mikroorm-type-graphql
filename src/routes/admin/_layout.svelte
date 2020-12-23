<script context="module">
  export const preload: Preload = async function preload(_page, session) {
    return authenticated(this, session.user, [
      ClientRole.USER,
      ClientRole.ADMIN,
      ClientRole.MODERATOR,
    ]);
  };
</script>

<script>
  import AppHeader from "../../components/Header/AppHeader.svelte";
  import type { Preload } from "@svazzle/common";
  import { authenticated } from "../../utils/authenticated";
  import { ClientRole } from "../../types";
</script>

<AppHeader />
<slot />
