import { A, AnchorProps, useLocation } from '@solidjs/router';

interface ILocationState {
    previous?: string;
    previousState?: any;
    [key: string]: any;
}

const BackLink = (props: AnchorProps) => {
    const location = useLocation<ILocationState>();
    const previousPath = location.state?.previous;
    const previousState = location.state?.previousState;
    return <A {...props} href={previousPath || props.href} state={previousState} />;
};

export const ForwardLink = (props: AnchorProps) => {
    const location = useLocation<ILocationState>();
    const fullPath = () => `${location.pathname}${location.search}${location.hash}`;

    return (
        <A
            {...props}
            state={{
                // @ts-ignore
                previous: props.state?.previous || fullPath(),
                previousState: {
                    ...location.state,
                    // @ts-ignore
                    ...(props.state?.previousState || {}),
                },
            }}
        />
    );
};

export default BackLink;
