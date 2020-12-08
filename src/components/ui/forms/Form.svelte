<script>
  import { setContext } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import { v4 } from "uuid";

  export let initialValues: any = {};
  export let validate: ((values: any) => any) | undefined = undefined;
  export let validationSchema: any = null;
  export let onSubmit: (values: any) => any;
  export let formKey: string = v4();

  const {
    form,
    errors,
    touched,
    state,
    handleChange,
    handleSubmit,
    updateField,
    updateTouched,
  } = createForm({
    initialValues,
    validationSchema,
    validate,
    onSubmit,
  });

  setContext(formKey, {
    form,
    errors,
    touched,
    state,
    handleChange,
    handleSubmit,
    updateField,
    updateTouched,
  });
</script>

<form on:submit={handleSubmit} {...$$restProps}>
  <slot
    {form}
    {formKey}
    {errors}
    {touched}
    {state}
    {handleChange}
    {handleSubmit}
    {updateField}
    {updateTouched} />
</form>
