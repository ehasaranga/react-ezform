import React, { Children, ReactNode } from "react";
import { UseForm } from "src/FormProvider";

export const autoRegChild = (children: ReactNode, hook: UseForm): ReactNode => {

    return Children.map(children, child => {

        if (!React.isValidElement(child)) return child

        if (child.props.name) {

            const name = child.props.name

            const reg = hook.register({ name: name })

            const childProps = child.props.children
                ? { ...child.props, children: autoRegChild(child.props.children, hook) }
                : child.props;

            const clonedProps = {
                ...reg,
                onChange: hook.handleChange,
                onBlur: hook.handleOnBlur,
                onFocus: hook.handleOnFocus,
                value: hook._value[name],
                ...childProps
            }

            //if react component and not a native element
            if (typeof child.type === 'function' ||  typeof child.type === 'object') {

                Object.assign(clonedProps, {
                    error: hook.formatError(name)   
                })

            }

            // console.log('reg props ', clonedProps)

            const newElement = typeof child.type === 'function' ? React.cloneElement(child, clonedProps) : React.cloneElement(child, clonedProps)

            return newElement;

        }


        if (child.props.children) {

            return React.cloneElement(child, {
                children: autoRegChild(child.props.children, hook),
            } as any);

        }


        return child;

    });

};