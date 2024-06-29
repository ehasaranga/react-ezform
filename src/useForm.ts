import { Dispatch, SetStateAction, useRef, useState } from "react"

export const useForm = <T>(args: FormConfig<T>) => {

    const { initVal, onSubmit, validate } = args;

    const _values = useRef<T | any>({ ...(initVal ?? {} as T) })

    const _fieldErrors = useRef<Record<any, string | string[]>>({} as any)

    const _childRef = useRef<object | any>({})

    const [isWaiting, setWaiting] = useState<boolean>(false);

    const [refresh, setRefresh] = useState<number>(0);

    const handleChange = (e: any) => {

        const { name, value } = e.target;

        setValues(value, name)

    }

    /* on FORM submit */
    const handleSubmit = async (e: any) => {

        if (e) {

            e.preventDefault();
            e.persist() // not needed anymore

        }

        if (await runValidation() === false || isWaiting) return

        setWaiting(true)

        try {

            await onSubmit(getValues() as any, ctx)

        } catch (err) {

            console.log(err)

        } finally {

            setWaiting(false)

        }

    }

    /* on FIELD submit */
    const handleOnFocus = (e: any) => {

        const name = e.target.name;

        if (!formatError(name)) return;

        setErrors((state) => {

            const newState = { ...state }

            delete newState[name];

            return { ...newState }

        })

    }

    /* on FIELD blur */
    const handleOnBlur = async (e: any) => {

        const name = e.target.name;

        await runValidation(name)

    }

    const runValidation = (name?: any): Promise<boolean> => {

        return new Promise((resolve, reject) => {

            //validate function was not passed so neglecting validation. hence resolve -> true
            if (typeof validate !== 'function') return resolve(true);

            try {

                const errors: any = validate(getValues())

                if (Object.keys(errors ?? {}).length) throw errors

                return resolve(true)

            } catch (err: any) {

                const updateVal = name ? { [name]: err[name] } : err

                setErrors(errors => ({
                    ...errors,
                    ...updateVal
                }))

                trigger(name)

                return resolve(false)

            }

        })

    }

    const getErrors = (field?: any) => {

        if (!field) return _fieldErrors.current;

        return _fieldErrors.current[field]

    }

    const setErrors = <E extends Record<keyof T | any, string | string[]>>(err: E | ((err: E) => E)) => {

        if (typeof err === 'function') {

            _fieldErrors.current = err(_fieldErrors.current as E)

            return;

        }

        err = err ?? {};

        _fieldErrors.current = err

    }

    const formatError = (fieldName: any) => {

        const err = getErrors(fieldName);

        if (!err) return false

        //if object -> all errors
        if (!Array.isArray(err)) return false

        const errMsg = Array.isArray(err) ? err[0] : err;

        return errMsg;
    }

    /* FORM reset */
    const reset = (data: any = {}) => {

        setValues({ ...initVal, ...data })

        trigger()

    }

    /* FIELD values get */
    const getValues = (field?: any):T => {

        if (!field) return _values.current;

        return _values.current[field];

    }

    /* FIELD values set */
    const setValues = (val: any, field?: any) => {

        if (typeof field === 'undefined') {

            //wont refresh field component

            _values.current = val;

        } else {

            _values.current[field] = val;

            trigger(field)

        }

    }


    /* trigger FORM / FIELD refresh */
    const trigger = (field?: any) => {

        //trigger refresh on field
        if (field) return _childRef.current[field].current.refresh()

        // trigger refresh on whole form
        setRefresh(val => val + 1)

    }

    /* auto setup props and setup ref */
    const register = (args: RegisterType) => {

        const type = args.type ?? 'text';

        const ref = useRef(null)

        const props = {
            ...args,
            ref,
            type
        }

        _childRef.current[args.name] = ref

        return props
    }

    const ctx = {
        values: getValues(),
        reset,
        errors: getErrors(),
        setErrors: setErrors,
        setWaiting
    } as const

    const form = {
        register,

        set: setValues,
        values: getValues(),
        handleChange,
        handleSubmit,
        handleOnFocus,
        handleOnBlur,
        reset,
        errors: getErrors(),
        setErrors: setErrors,
        formatError,
        isWaiting

    } as const;

    return form

}

type RegisterType = {
    name: string;
    label: string;
    type?: 'text' | 'password' | 'number' | 'tel';
    required?: boolean;
}

type FormConfig<S> = {
    initVal?: S;
    onSubmit: (values: S, ctx: UseFormCtx<S>) => Promise<void> | void,
    validate?: (values: S) => Record<any, string | string[]> | unknown
}


type UseFormCtx<T> = Pick<UseFormHook<T>,
    'values' |
    'reset' |
    'errors' |
    'setErrors' 
> & {
    setWaiting: Dispatch<SetStateAction<boolean>>
}

export type UseFormHook<T> = ReturnType<typeof useForm<T>>