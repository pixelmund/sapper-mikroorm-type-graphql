declare module 'svelte-forms-lib' {
   import { SvelteTypedComponent } from 'svelte-typed-component';
   import type { Readable, Writable } from "svelte/store";

   export type FormProps = {
      class?: string;
      initialValues: any,
      onSubmit: ((values: any) => any) | ((values: any) => Promise<any>),
      validate?: (values: any) => any | undefined,
      validationSchema?: any,
   }

   type FieldProps = {
      name: string;
      type: 'email' | 'password' | 'date' | 'text' | string;
      class?: string;
   }

   type SelectProps = {
      name: string;
      class?: string;
   }
   
   type ErrorProps = {
      name: string;
      class?: string;
   }
   
   function createForm<Inf = Record<string, unknown>>(
      formProps: { 
      class?: string;
      initialValues: Inf,
      onSubmit: (values: Inf) => any | Promise<any>,
      validate?: (values: Inf) => any | undefined,
      validationSchema?: any,
      }
      ) : {
      form: Writable<Inf>,
      errors: Writable<Record<keyof Inf, string>>,
      touched: Writable<Record<keyof Inf, boolean>>,
      modified: Writable<Record<keyof Inf, boolean>>,
      isValid: Readable<boolean>,
      isSubmitting: Writable<boolean>,
      isValidating: Writable<boolean>,
      isModified: Readable<boolean>,
      updateField: (field: keyof Inf, value: any) => void,
      updateValidateField: (field: keyof Inf, value: any) => void,
      updateTouched: (field: keyof Inf, value: any) => void,
      validateField: (field: keyof Inf) => Promise<any>,
      updateInitialValues: (newValues: Inf) => void,
      handleReset: () => void,
      state: { 
         form: Writable<Inf>,
         errors: Writable<Record<keyof Inf, string>>,
         touched: Writable<Record<keyof Inf, boolean>>,
         modified: Writable<Record<keyof Inf, boolean>>,
         isValid: Readable<boolean>,
         isSubmitting: Writable<boolean>,
         isValidating: Writable<boolean>,
         isModified: Readable<boolean>,
      },
      handleChange: () => void,
      handleSubmit: () => any
   }

   class Form extends SvelteTypedComponent<FormProps, {}, {default: any}>{}

   class Field extends SvelteTypedComponent<FieldProps, {}, {}>{}

   class Select extends SvelteTypedComponent<SelectProps, {}, { default: any }>{}

   class ErrorMessage extends SvelteTypedComponent<ErrorProps, {}, { default: any }>{}

   export { createForm, Form, Field, Select, ErrorMessage }
}
 
 