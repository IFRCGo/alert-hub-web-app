import {
    Container,
    DateOutput,
    TextOutput,
    TextOutputProps,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    _cs,
    isFalsyString,
} from '@togglecorp/fujs';

import { AlertDetailsQuery } from '#generated/types/graphql';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface ReferenceOutputProps {
    referenceStr?: string;
}

function ReferenceOutput(props: ReferenceOutputProps) {
    const { referenceStr } = props;

    if (isFalsyString(referenceStr)) {
        return null;
    }

    const references = referenceStr.split(' ');

    return (
        <ul className={styles.referenceOutput}>
            {references.map((reference) => {
                const referenceItems = reference.split(',');

                return (
                    <li key={reference}>
                        <div>
                            {referenceItems[0]}
                        </div>
                        <div>
                            {referenceItems[1]}
                        </div>
                        <DateOutput value={referenceItems[2]} />
                    </li>
                );
            })}
        </ul>
    );
}

function MetaOutput(props: TextOutputProps) {
    const {
        className,
        invalidText,
        labelClassName,
        valueClassName,
        ...otherProps
    } = props;

    const strings = useTranslation(i18n);

    return (
        <TextOutput
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...otherProps}
            className={_cs(styles.metaOutput, className)}
            invalidText={invalidText ?? strings.notAvailable}
            labelClassName={_cs(styles.label, labelClassName)}
            valueClassName={_cs(styles.value, valueClassName)}
        />
    );
}

type AlertInfo = NonNullable<AlertDetailsQuery['public']>['alert'];
interface Props {
    className?: string;
    data: AlertInfo;
}

function AlertMetadata(props: Props) {
    const {
        className,
        data,
    } = props;

    return (
        <Container
            className={_cs(className, styles.alertMetadata)}
            childrenContainerClassName={styles.content}
        >
            <MetaOutput
                label="Message type"
                value={data?.msgTypeDisplay}
            />
            <MetaOutput
                label="Sent by"
                value={data?.sender}
            />
            <MetaOutput
                label="Sent on"
                value={data?.sent}
                valueType="date"
            />
            <MetaOutput
                label="Source"
                value={data?.source}
            />
            <MetaOutput
                label="Scope"
                value={data?.scope}
            />
            <MetaOutput
                label="Restriction"
                value={data?.restriction}
            />
            <MetaOutput
                label="Addresses"
                value={data?.addresses}
            />
            <MetaOutput
                label="Handling Code"
                value={data?.code}
            />
            <MetaOutput
                label="Note"
                value={data?.note}
            />
            <MetaOutput
                label="Incident IDs"
                value={data?.incidents}
            />
            <MetaOutput
                valueClassName={styles.url}
                label="URL"
                value={data?.url}
            />
            <MetaOutput
                valueClassName={styles.references}
                label="References"
                value={data?.references?.split(' ').map(
                    (referenceStr) => (
                        <ReferenceOutput
                            referenceStr={referenceStr}
                        />
                    ),
                )}
            />
        </Container>
    );
}

export default AlertMetadata;
