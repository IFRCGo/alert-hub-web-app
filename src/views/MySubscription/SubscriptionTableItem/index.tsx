import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';
import {
    AlertInfoCertaintyEnum,
    AlertInfoSeverityEnum,
    AlertInfoUrgencyEnum,
} from '#generated/types/graphql';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props {
    id: string;
    country: string | undefined;
    admin1: string | undefined;
    urgency?: AlertInfoUrgencyEnum[] | undefined;
    certainty?: AlertInfoCertaintyEnum[] | undefined;
    severity?: AlertInfoSeverityEnum[] | undefined;
    title: string;
    totalCount: number;
    actions: React.ReactNode;
}

function SubscriptionTableItem(props: Props) {
    const {
        id,
        country,
        admin1,
        urgency,
        certainty,
        severity,
        title,
        totalCount,
        actions,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Container
            key={id}
            className={styles.subscriptionDetail}
            heading={title}
            headingLevel={4}
            actions={(
                <>
                    (
                    {totalCount}
                    )
                    {actions}
                </>
            )}
            footerContentClassName={styles.alertDetail}
            footerContent={(
                <>
                    <div>{country}</div>
                    <div>{admin1}</div>
                    <div>{urgency}</div>
                    <div>{certainty}</div>
                    <div>{severity}</div>
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
