import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react"
import { register } from "src/register";
import { updateProps } from "src/updateProps";

export const useForm = <T>(args: FormConfig<T>) => {

    const { initVal, onSubmit, validate } = args;

    const _values = useRef<T | any>({ ...(initVal ?? {} as T) })

    const _fieldErrors = useRef<FieldErrors<T>>({
        _form: ''
    } as any)

    const _childRef = useRef<object | any>({})

    const [isWaiting, setWaiting] = useState<boolean>(false);

    const [msg, setMsg] = useState<string | string[]>();

    const [refresh, setRefresh] = useState<number>(0);

    const updateChildProps = updateProps(_childRef)

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

        setErrors((errors) => {

            if (name in errors) {

                delete errors[name];

                updateChildProps(name, { error: '' })

            }

            return { ...errors }

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

                const newError = name ? { [name]: err[name] } : err

                setErrors(errors => ({
                    ...errors,
                    ...newError
                }))

                return resolve(false)

            }

        })

    }

    const getErrors = (field?: any) => {

        if (!field) return _fieldErrors.current;

        return _fieldErrors.current[field as keyof T]

    }

    const setErrors = <E extends FieldErrors<T>>(err: E | ((err: E) => E)) => {

        const prevError = { ..._fieldErrors.current };

        _fieldErrors.current = typeof err === 'function' ? err(_fieldErrors.current as E) : (err ?? {})

        for(let fieldName in _fieldErrors.current) {

            if (JSON.stringify(_fieldErrors.current[fieldName]) === JSON.stringify(prevError[fieldName])) continue;

            updateChildProps(fieldName, { error: _fieldErrors.current[fieldName] })

        }

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

            updateChildProps(field, { value: val })

        }

    }

    /* trigger FORM / FIELD refresh */
    const trigger = (field?: any) => {

        //trigger refresh on field
        if (field) {

            _childRef.current[field].current.refresh()

            return 
        }

        // trigger refresh on whole form
        setRefresh(val => val + 1)

    }

    const common = {
        values: getValues(),
        reset,
        errors: getErrors() as FieldErrors<T>,
        setErrors: setErrors,
        setWaiting, 
        setMsg
    } as const

    const ctx = {
        ...common,
    } as const

    const form = {
        ...common,
        register: register(_childRef),
        set: setValues,
        getValues,
        handleChange,
        handleSubmit,
        handleOnFocus,
        handleOnBlur,
        formatError,
        isWaiting,
        msg,
        _value: _values.current
    } as const;

    return form

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


type FieldErrors<T> = Record<keyof T, string | string[]> & {
    [key: string] : any
}