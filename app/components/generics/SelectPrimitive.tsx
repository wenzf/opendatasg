import React from 'react';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import ChevronDownIconSVG from '~/resources/icons/ChevronDownIcongSVG';
import ChevronUpIconSVG from '~/resources/icons/ChevronUpIcon';
import CheckIconSVG from '~/resources/icons/CheckIconSVG';


const SelectPrimitive = ({ options, setter, selectlabel }: {
    options: { label: string, value: string }[],
    setter: (e: string) => void
    selectlabel: string

}) => (
    <Select.Root onValueChange={setter}>
        <Select.Trigger className="SelectTrigger" aria-label={selectlabel} >
            <Select.Value placeholder={selectlabel} />
            <Select.Icon className="SelectIcon">
                <ChevronDownIconSVG aria-label="Filter" />
            </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
            <Select.Content className="SelectContent" >
                <Select.ScrollUpButton className="SelectScrollButton">
                    <ChevronUpIconSVG />
                </Select.ScrollUpButton>
                <Select.Viewport className="SelectViewport">
                    {options.map((it, ind) => (
                        <SelectItem key={ind} value={it.value}>{it.label}</SelectItem>
                    ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="SelectScrollButton">
                    <ChevronDownIconSVG />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
);

const SelectItem = React.forwardRef<
    React.ElementRef<typeof Select.Item>,
    React.ComponentPropsWithoutRef<typeof Select.Item>
// eslint-disable-next-line react/prop-types
>(({ children, className, ...props }, forwardedRef) => {
    return (
        <Select.Item className={classnames('SelectItem', className)} {...props} ref={forwardedRef}>
            <Select.ItemText>{children}</Select.ItemText>
            <Select.ItemIndicator className="SelectItemIndicator">
                <CheckIconSVG />
            </Select.ItemIndicator>
        </Select.Item>
    );
});

SelectItem.displayName = Select.Item.displayName

export default SelectPrimitive;