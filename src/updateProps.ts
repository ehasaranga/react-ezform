import { FieldProps } from "src/register";

export const updateProps = (childRef: React.MutableRefObject<any>) => (field: any, props: Partial<FieldProps>) => {

    if (!field) return;

    if ('updateProps' in childRef.current[field].current) {
            
        childRef.current[field].current.updateProps(props)

    }

}