import { useCallback } from 'react';
import {
    Container,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    _cs,
    isNotDefined,
} from '@togglecorp/fujs';

import { AlertDetailsQuery } from '#generated/types/graphql';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AlertInfo = NonNullable<AlertDetailsQuery['public']>['alert'];
interface Props {
    className?: string;
    data: AlertInfo;
}

function CountryAlertInfo(props: Props) {
    const {
        className,
        data,
    } = props;
    const strings = useTranslation(i18n);

    const checkEmptyValue = useCallback((val?: string | number | null) => {
        if (!val || isNotDefined(val)) {
            return strings.notAvailable;
        }
        return val;
    }, [strings.notAvailable]);

    return (
        <Container
            className={_cs(className, styles.alertInfo)}
            heading={strings.countryAlertInfoTitle}
            childrenContainerClassName={styles.content}
            withHeaderBorder
        >
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={_cs(styles.value, styles.link)}
                label="URL"
                value={checkEmptyValue(data?.url)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Message ID"
                value={checkEmptyValue(data?.msgType)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Sender ID"
                value={checkEmptyValue(data?.sender)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Send Date"
                value={checkEmptyValue(data?.sent)}
                valueType="date"
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Sent Type"
                value={checkEmptyValue(data?.sent)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={_cs(styles.value, styles.link)}
                label="Source"
                value={checkEmptyValue(data?.source)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Scope"
                value={checkEmptyValue(data?.scope)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Restriction"
                value={checkEmptyValue(data?.restriction)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Addresses"
                value={checkEmptyValue(data?.addresses)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Handling Code"
                value={checkEmptyValue(data?.code)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={styles.value}
                label="Note"
                value={checkEmptyValue(data?.note)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={_cs(styles.value, styles.link)}
                label="Reference IDs"
                value={checkEmptyValue(data?.references)}
            />
            <TextOutput
                className={styles.textOutput}
                labelClassName={styles.label}
                valueClassName={_cs(styles.value, styles.link)}
                label="Incident IDs"
                value={checkEmptyValue(data?.incidents)}
            />
        </Container>
    );
}

export default CountryAlertInfo;
