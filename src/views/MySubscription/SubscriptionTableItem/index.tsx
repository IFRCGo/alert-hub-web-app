import { Container } from '@ifrc-go/ui';

import {
    AlertInfoCertaintyEnum,
    AlertInfoSeverityEnum,
    AlertInfoUrgencyEnum,
} from '#generated/types/graphql';

import styles from './styles.module.css';

interface Props {
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
        country,
        admin1,
        urgency,
        certainty,
        severity,
        title,
        totalCount,
        actions,
    } = props;

    return (
        <Container
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
            footerContent={(
                <>
                    {country}
                    {admin1}
                    {urgency}
                    {certainty}
                    {severity}
                </>
            )}
        />
    );
}

export default SubscriptionTableItem;
