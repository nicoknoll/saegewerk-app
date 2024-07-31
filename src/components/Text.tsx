import { classnames } from '../utils/classnames.ts';

const Text = (props: { children: any; offset?: number; class?: string }) => {
    const defaultOffset = 0.09;
    return (
        <span
            class={classnames('inline-block', props.class)}
            style={{ transform: `translateY(${props.offset || defaultOffset}em)` }}
        >
            {props.children}
        </span>
    );
};

export default Text;
