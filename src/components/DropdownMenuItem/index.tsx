import {
    useCallback,
    useContext,
} from 'react';
import {
    Button,
    type ButtonProps,
    ConfirmButton,
    type ConfirmButtonProps,
} from '@ifrc-go/ui';
import { DropdownMenuContext } from '@ifrc-go/ui/contexts';
import { isDefined } from '@togglecorp/fujs';

import Link, { type Props as LinkProps } from '#components/Link';

type CommonProp = {
    persist?: boolean;
    withoutFullWidth?: boolean;
}

type ButtonTypeProps<NAME> = Omit<ButtonProps<NAME>, 'type'> & {
    type: 'button';
}

type LinkTypeProps = LinkProps & {
    type: 'link';
    onClick?: never;
}

type ConfirmButtonTypeProps<NAME> = Omit<ConfirmButtonProps<NAME>, 'type'> & {
    type: 'confirm-button',
}

type Props<NAME> = CommonProp & (
    ButtonTypeProps<NAME> | LinkTypeProps | ConfirmButtonTypeProps<NAME>
);

function DropdownMenuItem<NAME>(props: Props<NAME>) {
    const {
        persist = false,
        onClick,
        withoutFullWidth,
        ...remainingProps
    } = props;

    const { setShowDropdown } = useContext(DropdownMenuContext);

    const handleLinkClick = useCallback(
        () => {
            if (!persist) {
                setShowDropdown(false);
            }
            // TODO: maybe add onClick here?
        },
        [setShowDropdown, persist],
    );

    const handleButtonClick = useCallback(
        (name: NAME, e: React.MouseEvent<HTMLButtonElement>) => {
            if (remainingProps.type !== 'link') {
                if (!persist) {
                    setShowDropdown(false);
                }

                if (isDefined(onClick)) {
                    onClick(name, e);
                }
            }
        },
        [setShowDropdown, persist, onClick, remainingProps.type],
    );

    if (remainingProps.type === 'link') {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            type: _,
            styleVariant = 'transparent',
            colorVariant = 'text',
            children,
            ...otherProps
        } = remainingProps;

        return (
            <Link
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...otherProps}
                styleVariant={styleVariant}
                colorVariant={colorVariant}
                onClick={handleLinkClick}
                withFullWidth={!withoutFullWidth}
            >
                {children}
            </Link>
        );
    }

    if (remainingProps.type === 'button') {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            type: _,
            styleVariant = 'transparent',
            ...otherProps
        } = remainingProps;

        return (
            <Button
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...otherProps}
                styleVariant={styleVariant}
                onClick={handleButtonClick}
                withFullWidth={!withoutFullWidth}
            />
        );
    }

    if (remainingProps.type === 'confirm-button') {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            type: _,
            styleVariant = 'transparent',
            ...otherProps
        } = remainingProps;

        return (
            <ConfirmButton
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...otherProps}
                styleVariant={styleVariant}
                onClick={handleButtonClick}
                withFullWidth={!withoutFullWidth}
            />
        );
    }
}

export default DropdownMenuItem;
