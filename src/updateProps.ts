
export const updateProps = (childRef: React.MutableRefObject<any>) => (field: any, props: any) => {

    if (!field) return;

    if ('refresh' in childRef.current[field].current) {
            
        childRef.current[field].current.updateProps(props)

    }

}