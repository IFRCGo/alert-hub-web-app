import React, { useCallback } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
    InputContainer,
    InputContainerProps,
} from '@ifrc-go/ui';

import { hCaptchaKey } from '#config';

export type HCaptchaProps<T> = Omit<InputContainerProps, 'input'> & {
    name: T,
    onChange: (value: string | undefined, name: T) => void;
    onError: (errorString: string) => void;
    elementRef?: React.RefObject<HCaptcha>;
};

function HCaptchaInput<T extends string>(props: HCaptchaProps<T>) {
    const {
        actions,
        actionsContainerClassName,
        className,
        disabled,
        error,
        errorContainerClassName,
        hint,
        hintContainerClassName,
        icons,
        iconsContainerClassName,
        inputSectionClassName,
        label,
        readOnly,
        onError,
        name,
        onChange,
        elementRef,
    } = props;

    const handleVerify = useCallback(
        (token: string) => {
            onChange(token, name);
        },
        [onChange, name],
    );
    const handleError = useCallback(
        (err: string) => {
            // eslint-disable-next-line no-console
            console.error(err);
            onError(err);
            onChange(undefined, name);
        },
        [
            onChange,
            name,
            onError,
        ],
    );
    const handleExpire = useCallback(
        () => {
            onChange(undefined, name);
        },
        [onChange, name],
    );

    return (
        <InputContainer
            actions={actions}
            actionsContainerClassName={actionsContainerClassName}
            className={className}
            disabled={disabled}
            error={error}
            errorContainerClassName={errorContainerClassName}
            hint={hint}
            hintContainerClassName={hintContainerClassName}
            icons={icons}
            iconsContainerClassName={iconsContainerClassName}
            inputSectionClassName={inputSectionClassName}
            label={label}
            readOnly={readOnly}
            input={hCaptchaKey && (
                <HCaptcha
                    ref={elementRef}
                    sitekey={hCaptchaKey}
                    onVerify={handleVerify}
                    onError={handleError}
                    onExpire={handleExpire}
                />
            )}
        />
    );
}

export default HCaptchaInput;
