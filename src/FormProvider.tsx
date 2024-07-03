import React, { PropsWithChildren } from "react";
import { UseFormHook } from "src/useForm";
import { FormContext } from "src/useFormContext";

export type UseForm = UseFormHook<any>

export type FormProviderProps = PropsWithChildren & { hook: UseForm }

export const FormProvider: React.FC<FormProviderProps> = ({ children, hook }) => {

    return (

        <FormContext.Provider value={hook}>

            {children}

        </FormContext.Provider>

    )

}