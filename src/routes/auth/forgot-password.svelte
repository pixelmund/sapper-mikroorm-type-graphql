<script context="module">
  export const preload: Preload = async function preload(_page, session) {
    unauthenticated(this, session.user);
    return;
  };
</script>

<script>
  import { ForgotPassword } from "../../generated/graphql";
  import type { FormProps } from "svelte-forms-lib";
  import Field from "../../components/ui/forms/Field.svelte";
  import Form from "../../components/ui/forms/Form.svelte";
  import type { Preload } from "@svazzle/common";
  import { goto } from "@svazzle/app";
  import { unauthenticated } from "../../utils/authenticated";
  import SubmitButton from "../../components/ui/forms/SubmitButton.svelte";

  const forgotPassword = ForgotPassword();

  const formProps: FormProps = {
    initialValues: {
      email: "",
    },
    validate: (values) => {
      let errors: any = {};
      if (!values.email || values.email.length === 0) {
        errors["email"] = "Required field";
      }
      return errors;
    },
    onSubmit: async ({ email }) => {
      const forgotPasswordResult = await forgotPassword({
        variables: { email },
      });
      if (
        forgotPasswordResult.errors &&
        forgotPasswordResult.errors.length > 0
      ) {
        console.log(forgotPasswordResult.errors);
      }
      if (
        forgotPasswordResult.data &&
        forgotPasswordResult.data.forgotPassword.success
      ) {
        goto("/auth/login?email=" + email);
      }
    },
  };
</script>

<Form {...formProps} class="mx-auto max-w-3xl w-full space-y-3">
  <Field full label="E-Mail" name="email" type="email" />
  <SubmitButton>Forgot Password</SubmitButton>
</Form>
