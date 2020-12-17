<script context="module">
    export const preload: Preload = async function preload(page, session) {
        unauthenticated(this, session.user);
        return {
            id: page.params.id,
        };
    };
</script>

<script>
    import { ResetPassword } from "../../../../generated/graphql";
    import type { FormProps } from "svelte-forms-lib";
    import type { Preload } from "@svazzle/common";
    import { goto } from "@svazzle/app";
    import { unauthenticated } from "../../../../utils/authenticated";
    import Form from "../../../../components/ui/forms/Form.svelte";
    import Field from "../../../../components/ui/forms/Field.svelte";
    import SubmitButton from "../../../../components/ui/forms/SubmitButton.svelte";

    const resetPassword = ResetPassword();

    export let id: string = "";

    const formProps: FormProps = {
        initialValues: {
            id,
            newPassword: "",
        },
        validate: (values) => {
            let errors: any = {};
            if (!values.id || values.id.length === 0) {
                errors["id"] = "Required field";
            }
            if (!values.newPassword || values.newPassword.length === 0) {
                errors["newPassword"] = "Required field";
            }
            return errors;
        },
        onSubmit: async ({ id, newPassword }) => {
            const resetPasswordResult = await resetPassword({
                variables: { id, newPassword },
            });
            if (
                resetPasswordResult.errors &&
                resetPasswordResult.errors.length > 0
            ) {
                console.log(resetPasswordResult.errors);
            }
            if (
                resetPasswordResult.data &&
                resetPasswordResult.data.resetPassword.success
            ) {
                goto(
                    "/auth/login?email=" +
                        resetPasswordResult.data.resetPassword.user!.email
                );
            }
        },
    };
</script>

<Form {...formProps} class="mx-auto max-w-3xl w-full space-y-3">
    <Field full label="Enter your reset token" name="id" type="text" />
    <Field full label="New Password" name="newPassword" type="password" />
    <SubmitButton>Save new Password</SubmitButton>
</Form>
