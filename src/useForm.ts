import { useRef, useState } from "react"

export const useForm = <T>(args: FormConfig<T>) => {

    const { initVal, onSubmit, validate } = args;

    const _state = useRef<T | any>({ ...(initVal ?? {} as T) })

    const _fieldErrors = useRef<Record<any, string | string[]>>({} as any)

    const _childRef = useRef<object | any>({})

    const [refresh , setRefresh] = useState<number>(0);

    const [fieldErrors, setFieldErrors] = useState<Record<any, string | string[]>>({} as any)

    const handleChange = (e: any) => {

        const { name, value } = e.target;

        set(value, name)

    }

    /* on FORM submit */
    const handleSubmit = async (e: any) => {

        if (e) {

            e.preventDefault();
            e.persist() // not needed anymore

        }

        if (await runValidation()) {
            
            onSubmit(get() as any, ctx)

        }


    }

    /* on FIELD submit */
    const handleOnFocus = (e: any) => {

        const name = e.target.name;

        if (!formatError(name)) return;

        setFieldErrors((state) => {

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

                const errors: any = validate(get())

                if (Object.keys(errors ?? {}).length) throw errors

                return resolve(true)

            } catch (err: any) {

                const updateVal = name ? { [name]: err[name] } : err

                setFieldErrors(state => ({
                    ...state,
                    ...updateVal
                }))

                return resolve(false)

            }

        })

    }

    const setErrors = (err: Record<any, string | string[]>) => {

        err = err ?? {};

        setFieldErrors(err)

    }

    const formatError = (fieldName: any) => {

        const err = fieldErrors[fieldName];

        if (!err) return false

        const errMsg = Array.isArray(err) ? err[0] : err;

        return errMsg;
    }

    /* FORM reset */
    const reset = (data: any = {}) => {

        set({...initVal, ...data})

        // console.log('reset ran');

        // setState(state => ({...initVal, ...data}))

        trigger()


    }

    /* FIELD values get */
    const get = (field?: any) => {

        if (!field) return _state.current;

        return _state.current[field];

    }

    /* FIELD values set */
    const set = (val: any, field?: any) => {

        if (typeof field === 'undefined') {

            //wont refresh field component

            _state.current = val;

        } else {

            _state.current[field] = val;

            _childRef.current[field].current.refresh()

        }

    }


    /* trigger FORM refresh */
    const trigger = () => {

        setRefresh(val => val + 1)

    }

    /* auto setup props and setup ref */
    const register = (args:RegisterType) => {     

        const type = args.type ?? 'text';

        const ref = useRef()

        const props = {
            ...args,
            ref,
            type
        }

        _childRef.current[args.name] = ref

        return props
    }

    const ctx: UseFormCtx<T> = {
        values: get(),
        reset,
        onSubmit,
        errors: fieldErrors,
        setErrors: setErrors,
    } as const

    const form = {
        register,
        refresh,
        set,
        values: get(),
        handleChange,
        handleSubmit,
        handleOnFocus,
        handleOnBlur,
        reset,
        onSubmit,
        errors: fieldErrors,
        setErrors: setErrors,
        formatError,
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
    onSubmit: (values: S, ctx: UseFormCtx<S>) => void,
    validate?: (values: S) => Record<any, string | string[]> | unknown
}


type UseFormCtx<T> = Omit<UseFormHook<T>, 
    'formatError' | 
    'handleOnFocus' | 
    'handleSubmit' | 
    'handleChange' | 
    'handleOnBlur' | 
    'set' | 
    'register' | 
    'refresh'
>

export type UseFormHook<T> = ReturnType<typeof useForm<T>>