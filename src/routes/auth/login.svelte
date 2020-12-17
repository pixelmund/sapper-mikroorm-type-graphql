<script context="module">
  export const preload: Preload = async function preload(
    _page,
    session
  ) {
    unauthenticated(this, session.user);
    return;
  };
</script>

<script>
  import { Login } from "../../generated/graphql";
  import type { FormProps } from "svelte-forms-lib";
  import Field from "../../components/ui/forms/Field.svelte";
  import Form from "../../components/ui/forms/Form.svelte";
  import type { Preload } from "@svazzle/common";
  import { stores } from "@svazzle/app";
  import { unauthenticated } from "../../utils/authenticated";
  import SubmitButton from "../../components/ui/forms/SubmitButton.svelte";

  const { page } = stores()

  const signIn = Login();

  const formProps: FormProps = {
    initialValues: {
      email: $page.query.email ? $page.query.email : "",
      password: "",
    },
    validate: (values) => {
      let errors: any = {};
      if (!values.email || values.email.length === 0) {
        errors["email"] = "Required field";
      }
      if (!values.password || values.password.length === 0) {
        errors["password"] = "Required field";
      }
      return errors;
    },
    onSubmit: async ({ email, password }) => {
      const signUpResult = await signIn({
        variables: { input: { email, password } },
      });
      if (signUpResult.errors && signUpResult.errors.length > 0) {
        console.log(signUpResult.errors);
      }
      if (signUpResult.data && signUpResult.data.login.success) {
        // We reload to load the session
        window.location.reload();
      }
    },
  };
</script>

<Form
  {...formProps}
  class="mx-auto max-w-3xl w-full space-y-3">
  <Field full label="E-Mail" name="email" type="email" />
  <Field full label="Passwort" name="password" type="password" />
  <SubmitButton>Sign in</SubmitButton>
</Form>
