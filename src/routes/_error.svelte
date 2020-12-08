<script>
	export let status: string;
	export let error: Error;
	
	const mode = process.env.NODE_ENV;
	const dev = mode === "development";
</script>

<div>
	<h1>{error.message}</h1>
	<h2>{status}</h2>
</div>

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if}
