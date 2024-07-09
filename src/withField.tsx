import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { FieldProps } from "src/register";

export const withField = <T extends object>(Comp: React.ComponentType<T>) => forwardRef((props: T, ref) => {

    const [refresh, setRefresh] = useState<number>(0);

    const [newProps, setNewProps] = useState(props)

    useImperativeHandle(ref, () => {

        return {
            refresh: () => {

                setRefresh(val => val + 1)

            },
            updateProps: (newProps: T) => {

                setNewProps(newProps)

            }
        }

    })

    return <Comp {...{
        ...props,
        ...newProps,
    }} />

})