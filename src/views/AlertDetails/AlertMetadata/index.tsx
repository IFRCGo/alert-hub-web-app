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
    const strings = useTranslation(i18n);
    const {
        className,
        invalidText,
        labelClassName,
        valueClassName,
        ...otherProps
    } = props;

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
    const strings = useTranslation(i18n);
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
                label={strings.alertMetaDataMessageType}
                value={data?.msgTypeDisplay}
            />
            <MetaOutput
                label={strings.alertMetaDataSentBy}
                value={data?.sender}
            />
            <MetaOutput
                label={strings.alertMetaDataSentOn}
                value={data?.sent}
                valueType="date"
            />
            <MetaOutput
                label={strings.alertMetaDataSource}
                value={data?.source}
            />
            <MetaOutput
                label={strings.alertMetaDataScope}
                value={data?.scope}
            />
            <MetaOutput
                label={strings.alertMetaDataRestriction}
                value={data?.restriction}
            />
            <MetaOutput
                label={strings.alertMetaDataAddresses}
                value={data?.addresses}
            />
            <MetaOutput
                label={strings.alertMetaDataHandlingCode}
                value={data?.code}
            />
            <MetaOutput
                label={strings.alertMetaDataNote}
                value={data?.note}
            />
            <MetaOutput
                label={strings.alertMetaDataIncidentIds}
                value={data?.incidents}
            />
            <MetaOutput
                valueClassName={styles.url}
                label={strings.alertMetaDataURL}
                value={data?.url}
            />
            <MetaOutput
                valueClassName={styles.references}
                label={strings.alertMetaDataReferences}
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
