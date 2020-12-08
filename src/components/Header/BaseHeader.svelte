<script>
  import Button from "../ui/Button.svelte";
</script>

<header
  class="fixed inset-x-0 top-0 w-full flex justify-center items-center h-16">
  <div class="max-w-screen-xl w-full px-2 flex justify-between items-center">
    <a class="font-black text-full text-xl italic" href="/">Logo</a>
    <div class="flex items-center space-x-2">
      <Button href="/auth/login" variant="primary">Sign in</Button>
      <Button href="/auth/register" variant="none">Sign up</Button>
    </div>
  </div>
</header>
