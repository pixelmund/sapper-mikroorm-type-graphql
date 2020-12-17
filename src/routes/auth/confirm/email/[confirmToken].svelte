<script context="module">
    export const preload: PreloadFunction = async function (this, page) {
        const result = await client.mutate<
            ConfirmEmailMutation,
            ConfirmEmailMutationVariables
        >({
            mutation: ConfirmEmailDoc,
            variables: { confirmToken: page.params.confirmToken },
        });
        if (result.errors && result.errors.length > 0) {
            return this.error(500, "There was an error confirming your email");
        }
        if (
            result.data &&
            result.data.confirmUser.errors &&
            result.data.confirmUser.errors.length > 0
        ) {
            return this.error(
                500,
                result.data.confirmUser.errors
                    .map((err) => err.message)
                    .join("\n")
            );
        }
        return {
            user:
                result.data && result.data.confirmUser.user
                    ? result.data.confirmUser.user
                    : null,
        };
    };
</script>

<script lang="ts">
    import { client } from "../../../../apolloClient";
    import { ConfirmEmailDoc } from "../../../../generated/graphql";
    import type {
        ConfirmEmailMutation,
        ConfirmEmailMutationVariables,
    } from "../../../../generated/graphql";
    import type { PreloadFunction } from "../../../../types";

    export let user: ConfirmEmailMutation["confirmUser"]["user"];

    $: console.log(user);
</script>
