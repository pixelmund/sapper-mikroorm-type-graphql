<script>
  import { Register } from "../../generated/graphql";
  import { createForm } from "svelte-forms-lib";

  const signUp = Register();

  const {
    form,
    handleChange,
    handleSubmit,
    touched,
    isValid,
    errors,
  } = createForm({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ email, password }) => {
      if (!$isValid) {
        return;
      }
      const signUpResult = await signUp({
        variables: { input: { email, password } },
      });
      if (signUpResult.errors && signUpResult.errors.length > 0) {
        console.log(signUpResult.errors);
      }
      if (signUpResult.data && signUpResult.data.register.success) {
        console.log(signUpResult.data);
      }
    },
  });

  $: console.log($touched);
</script>

<form
  class="flex flex-col items-center mx-auto max-w-7xl w-full space-y-3"
  on:submit={handleSubmit}>
  <label for="email">Email</label>
  <input
    id="email"
    name="email"
    type="email"
    on:change={handleChange}
    bind:value={$form.email} />
  <label for="password">Passwort</label>
  <input
    id="password"
    name="password"
    type="password"
    on:change={handleChange}
    bind:value={$form.password} />
  <button type="submit">Submit</button>
</form>
