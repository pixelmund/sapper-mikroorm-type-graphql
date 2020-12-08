<script>
  import { Login } from "../../generated/graphql";
  import type { FormProps } from "svelte-forms-lib";
  import Field from "../../components/ui/forms/Field.svelte";
  import Form from "../../components/ui/forms/Form.svelte";

  const signIn = Login();

  const formProps: FormProps = {
    initialValues: {
      email: "",
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
        console.log(signUpResult.data);
      }
    },
  };
</script>

<Form
  {...formProps}
  class="flex flex-col items-center mx-auto max-w-3xl w-full space-y-3"
  let:formKey>
  <Field
    {formKey}
    full
    label="E-Mail"
    name="email"
    type="email" />
  <Field
    {formKey}
    full
    label="Passwort"
    name="password"
    type="password" />
  <button type="submit">Submit</button>
</Form>
