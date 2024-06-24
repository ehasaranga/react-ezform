import React, { PropsWithChildren } from "react";
import { UseFormHook } from "src/useForm";
import { FormContext } from "src/useFormContext";

export type UseForm = Omit<UseFormHook<any>, 'register'>

type FormProps = PropsWithChildren & { hook: UseForm }

export const Form:React.FC<FormProps> = ({ children, hook }) => {

    const { handleSubmit } = hook;

    return (

        <FormContext.Provider value={hook}>

            <form className='form form-label-top' onSubmit={handleSubmit}>

                {children}

            </form>

        </FormContext.Provider>

    )

}