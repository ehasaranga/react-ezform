import { ChangeEvent, useRef } from "react";

export const register = (childRef:React.MutableRefObject<any>) => (args: RegisterType) => {

    const type = args.type ?? 'text';

    const ref = useRef(null)

    const props = {
        ...args,
        type,
        ref
    }

    childRef.current[args.name] = ref

    return props
}


type RegisterType = {
    name: string;
    label?: string;
    type?: 'text' | 'password' | 'number' | 'tel';
    required?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: ChangeEvent<HTMLInputElement>) => void;
}