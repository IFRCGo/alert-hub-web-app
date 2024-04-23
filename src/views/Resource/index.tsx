import { Link } from 'react-router-dom';
import { PageContainer } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    return (
        <PageContainer>
            <div className={styles.resourceText}>
                <h2>{strings.resourceHeadingTitle}</h2>
                <p>{strings.resourceHeadingDescription}</p>
            </div>
            <div className={styles.resourceCart}>
                <h3>{strings.resourceAlertHubAPIs}</h3>
                <p>{strings.resourceAlertHubAPIsDescription}</p>
                <Link
                    to="/"
                    className={styles.resourceItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
            <div className={styles.resourceCart}>
                <h3>{strings.resourceAlertHubFrontendTitle}</h3>
                <p>{strings.resourceAlertHubFrontendDescription}</p>
                <Link
                    to="/"
                    className={styles.resourceItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
            <div className={styles.resourceCart}>
                <h3>{strings.resourceAlertHubCapAggregatorTitle}</h3>
                <p>{strings.resourceAlertHubCapAggregatorDescription}</p>
                <Link
                    to="/"
                    className={styles.resourceItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
            <div className={styles.resourceCart}>
                <h3>{strings.resourceAlertHubAlertManagerTitle}</h3>
                <p>{strings.resourceAlertHubAlertManagerDescription}</p>
                <Link
                    to="/"
                    className={styles.resourceItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
            <div className={styles.resourceCart}>
                <h3>{strings.resourceAlertHubSubscriptionSystemTitle}</h3>
                <p>{strings.resourceAlertHubSubscriptionSystemDescription}</p>
                <Link
                    to="/"
                    className={styles.resourceItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
        </PageContainer>
    );
}

Component.displayName = 'Resource';
