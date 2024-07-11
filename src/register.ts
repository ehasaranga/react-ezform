import { ChangeEvent, useRef } from "react";

export const register = (childRef:React.MutableRefObject<any>) => (args: FieldProps) => {

    const type = args.type ?? 'text';

    childRef.current[args.name] = childRef.current[args.name] ?? useRef(null)

    const props = {
        ...args,
        type,
        ref: childRef.current[args.name]
    }

    

    return props
}


export type FieldProps = {
    name: string;
    label?: string;
    type?: 'text' | 'password' | 'number' | 'tel';
    required?: boolean;
    value?: string;
    error?: string | string[];
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: ChangeEvent<HTMLInputElement>) => void;
}