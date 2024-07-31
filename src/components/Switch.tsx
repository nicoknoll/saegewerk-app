import { classnames } from '../utils/classnames.ts';

const Switch = (props: { checked?: boolean; onCheckedChange?: (checked: boolean) => void; class?: string }) => {
    return (
        <div
            class={classnames(
                'relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 hover:bg-opacity-50',
                props.checked ? 'bg-brand-yellow' : 'bg-neutral-700',
                props.class
            )}
            onClick={() => props.onCheckedChange?.(!props.checked)}
        >
            <span
                class={classnames(
                    'transform transition-transform duration-300 ease-in-out inline-block w-5 h-5 bg-black rounded-full ',
                    props.checked ? 'translate-x-[1.375rem]' : 'translate-x-0.5'
                )}
            ></span>
        </div>
    );
};

export default Switch;
