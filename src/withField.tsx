import React, { forwardRef, useImperativeHandle, useState } from "react"
import { FieldProps } from "src/register";

export const withField = <T extends FieldProps>(Comp: React.ComponentType<T>) => forwardRef((defaultProps: T, ref) => {

    const [refresh, setRefresh] = useState<number>(0);

    const [newProps, setNewProps] = useState(defaultProps)

    useImperativeHandle(ref, () => {

        return {
            refresh: () => {

                setRefresh(val => val + 1)

            },
            updateProps: (updatedProps: T) => {

                setNewProps(oldProps => ({
                    ...oldProps,
                    ...updatedProps
                }))

            }            
        }

    })

    return <Comp {...newProps} />

})