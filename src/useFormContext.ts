import { createContext, useContext } from "react";
import { UseForm } from "src/FormProvider";

export const FormContext = createContext<UseForm>({} as UseForm);

export const useFormContext = (): UseForm => {
    return useContext(FormContext)
}