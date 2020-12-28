<script context="module">
    export const preload: Preload = async function preload(_page, session) {
        const client = clientWithSession(session);
        return {
            cache: await client.query<GetResultQuery, GetResultQueryVariables>({
                query: GetResultDoc,
                fetchPolicy:
                    typeof window === "undefined" ? "network-only" : undefined,
            }),
        };
    };
</script>

<script>
    import type { Preload } from "@svazzle/common";
    import { restore } from "svelte-apollo";
    import { clientWithSession } from "../apolloClient";
    import { GetResult, GetResultDoc } from "../generated/graphql";
    import type {
        GetResultQuery,
        GetResultQueryVariables,
    } from "../generated/graphql";
    import type { ApolloQueryResult } from "@apollo/client";

    export let cache: ApolloQueryResult<any>;
    restore(GetResultDoc, cache);
    const results = GetResult({});
</script>

<pre>
    <code class="whitespace-pre-line">
        {JSON.stringify($results)}
    </code>
</pre>
