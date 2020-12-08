<script>
  import { goto, stores } from "@svazzle/app";
  import { Logout } from "../../generated/graphql";
  import Button from "../ui/Button.svelte";
  import { serialize } from "cookie";
  import { THEME_COOKIE_NAME } from "../../config";

  const signOut = Logout();

  const { session } = stores();

  async function logout() {
    await signOut({});
    goto("/");
    // @ts-ignore
    session.set({ user: null });
  }

  function toggleDarkMode() {
    const copySession = { ...$session };
    if ($session.theme === "dark") {
      copySession.theme = "light";
      document.documentElement.classList.remove("dark");
    } else {
      copySession.theme = "dark";
      document.documentElement.classList.add("dark");
    }
    document.cookie = serialize(THEME_COOKIE_NAME, copySession.theme, {
      httpOnly: false,
      sameSite: "strict",
      maxAge: 3600 * 48 * 72 * 72,
    });
    session.set(copySession);
  }
</script>

<header
  class="fixed inset-x-0 top-0 w-full flex justify-center items-center h-16">
  <div class="max-w-screen-xl w-full px-2 flex justify-between items-center">
    <a class="font-black text-full text-xl italic" href="/">Logo</a>
    {#if $session.user}
      <div>
        <span>{$session.user.email}</span>
        <Button variant="outline" on:click={logout}>Logout</Button>
        <Button variant="none" on:click={toggleDarkMode}>
          Toggle Darkmode
        </Button>
      </div>
    {/if}
  </div>
</header>
