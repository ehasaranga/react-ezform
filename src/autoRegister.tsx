import React, { Children, ReactNode } from "react";
import { UseForm } from "src/FormProvider";
import { withField } from "src/withField";

export const autoRegChild = (children: ReactNode, hook: UseForm): ReactNode => {

    return Children.map(children, child => {

        if (!React.isValidElement(child)) return child

        if (child.props.name) {

            const name = child.props.name

            const reg = hook.register({ 
                name: name,
                value: hook._value[name],
                onChange: hook.handleChange,
                onBlur: hook.handleOnBlur,
                onFocus: hook.handleOnFocus,
             })

            const childProps = child.props.children
                ? { ...child.props, children: autoRegChild(child.props.children, hook) }
                : child.props;

            const clonedProps = {
                ...reg,
                ...childProps
            }

            //if react component and not a native element
            if (typeof child.type === 'function' ||  typeof child.type === 'object') {

                Object.assign(clonedProps, {
                    error: hook.formatError(name)   
                })

            }

            const EnhancedChild = withField(child.type as any);

            const WrappedChild = <EnhancedChild {...clonedProps} />

            return WrappedChild;

        }

        //when not a field with name and have childrens
        if (child.props.children) {

            return React.cloneElement(child, {
                children: autoRegChild(child.props.children, hook),
            } as any);

        }


        return child;

    });

};