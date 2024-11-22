import {
    Container,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props {
    id: string;
    name: string;
    alertCount: number;
    filterAlertUrgencies: string[];
    filterAlertCertainties: string[];
    filterAlertSeverities: string[];
    filterAlertCategories: string[];
    filterAlertCountry: string;
    filterAlertAdmin1s: string[];
    actions: React.ReactNode;
}

function SubscriptionTableItem(props: Props) {
    const {
        id,
        name,
        alertCount,
        filterAlertUrgencies,
        filterAlertCategories,
        filterAlertCertainties,
        filterAlertSeverities,
        filterAlertAdmin1s,
        filterAlertCountry,
        actions,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Container
            key={id}
            className={styles.subscriptionDetail}
            heading={name}
            headingLevel={3}
            actions={(
                <>
                    (
                    {alertCount}
                    )
                    {actions}
                </>
            )}
            footerContentClassName={styles.alertDetail}
            footerContent={(
                <>
                    <TextOutput
                        className={styles.label}
                        label={strings.subscriptionCountry}
                        value={filterAlertCountry}
                        strongLabel
                        withoutLabelColon
                    />
                    <TextOutput
                        className={styles.label}
                        label={strings.subscriptionAdmin1}
                        value={filterAlertAdmin1s.join(', ')}
                        strongLabel
                        withoutLabelColon
                    />
                    <TextOutput
                        className={styles.label}
                        label={strings.subscriptionUrgency}
                        value={filterAlertUrgencies.join(', ')}
                        strongLabel
                        withoutLabelColon
                    />
                    <TextOutput
                        className={styles.label}
                        label={strings.subscriptionCertainty}
                        value={filterAlertCertainties.join(', ')}
                        strongLabel
                        withoutLabelColon
                    />
                    <TextOutput
                        className={styles.label}
                        label={strings.subscriptionSeverity}
                        value={filterAlertSeverities.join(', ')}
                        strongLabel
                        withoutLabelColon
                    />
                    <TextOutput
                        className={styles.label}
                        label={strings.subscriptionCategory}
                        value={filterAlertCategories.join(', ')}
                        strongLabel
                        withoutLabelColon
                    />
                </>
            )}
            footerActions={(
                <Link
                    to="subscriptionDetail"
                    urlParams={{
                        subscriptionId: id,
                    }}
                    variant="secondary"
                >
                    {strings.subscriptionItemView}
                </Link>
            )}
        />
    );
}

export default SubscriptionTableItem;
