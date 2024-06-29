import React, { PropsWithChildren } from "react";
import { UseFormHook } from "src/useForm";
import { FormContext } from "src/useFormContext";

export type UseForm = Pick<UseFormHook<any>,
    'set' |
    'values' |
    'handleChange' |
    'handleSubmit' |
    'handleOnFocus' |
    'handleOnBlur' |
    'reset' |
    'errors' |
    'setErrors' |
    'formatError' |
    'isWaiting'
>

export type FormProviderProps = PropsWithChildren & { hook: UseForm }

export const FormProvider: React.FC<FormProviderProps> = ({ children, hook }) => {

    return (

        <FormContext.Provider value={hook}>

            {children}

        </FormContext.Provider>

    )

}