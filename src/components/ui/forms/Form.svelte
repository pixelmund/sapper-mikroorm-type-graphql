<script>
  import { setContext } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import { key } from "./key";

  export let initialValues: any = {};
  export let validate: ((values: any) => any) | undefined = undefined;
  export let validationSchema: any = null;
  export let onSubmit: (values: any) => any;

  const {
    form,
    errors,
    touched,
    state,
    handleChange,
    handleSubmit,
    updateField,
    updateTouched,
    isSubmitting,
  } = createForm({
    initialValues,
    validationSchema,
    validate,
    onSubmit,
  });

  setContext(key, {
    form,
    errors,
    touched,
    state,
    handleChange,
    handleSubmit,
    updateField,
    updateTouched,
    isSubmitting,
  });
</script>

<form on:submit={handleSubmit} {...$$restProps}>
  <slot
    {form}
    {errors}
    {touched}
    {state}
    {handleChange}
    {handleSubmit}
    {updateField}
    {updateTouched} />
</form>
