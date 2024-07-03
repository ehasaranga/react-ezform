import React, { forwardRef, useImperativeHandle, useState } from "react"

export const withField = <T extends object>(Comp: React.FC<T>) => forwardRef((props: T, ref) => {

    const [refresh, setRefresh] = useState<number>(0);

    useImperativeHandle(ref, () => {

        return {
            refresh: () => {

                setRefresh(val => val + 1)

            }
        }

    })

    return <Comp {...props} />

})