import { Link } from 'react-router-dom';
import { Header } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    return (
        <Page
            mainSectionClassName={styles.resourcesPage}
        >
            <Header
                heading={strings.resourceHeadingTitle}
                headingLevel={2}
                headingDescription={strings.resourceHeadingDescription}
            />
            <div className={styles.resourcesCart}>
                <Header
                    heading={strings.resourceAlertHubAPIs}
                />
                {strings.resourceAlertHubAPIsDescription}
                <Link
                    to="https://github.com/IFRC-Alert-Hub/Alert-Hub-Alert-Manager#api-documentation"
                    className={styles.resourcesItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
            <div className={styles.resourcesCart}>
                <Header
                    heading={strings.resourceAlertHubFrontendTitle}
                />
                {strings.resourceAlertHubFrontendDescription}
                <Link
                    to="https://github.com/IFRC-Alert-Hub/Alert-Hub-Frontend#readme"
                    className={styles.resourcesItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
            <div className={styles.resourcesCart}>
                <Header
                    heading={strings.resourceAlertHubCapAggregatorTitle}
                />
                {strings.resourceAlertHubCapAggregatorDescription}
                <Link
                    to="https://github.com/IFRC-Alert-Hub/Alert-Hub-CAP-Aggregator#readme"
                    className={styles.resourcesItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
            <div className={styles.resourcesCart}>
                <Header
                    heading={strings.resourceAlertHubAlertManagerTitle}
                />
                {strings.resourceAlertHubAlertManagerDescription}
                <Link
                    to="https://github.com/IFRC-Alert-Hub/Alert-Hub-Alert-Manager#readme"
                    className={styles.resourcesItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
            <div className={styles.resourcesCart}>
                <Header
                    heading={strings.resourceAlertHubSubscriptionSystemTitle}
                />
                {strings.resourceAlertHubSubscriptionSystemDescription}
                <Link
                    to="https://github.com/IFRC-Alert-Hub/Alert-Hub-Subscription-System#readme"
                    className={styles.resourcesItem}
                >
                    {strings.resourceLearMore}
                </Link>
            </div>
        </Page>
    );
}

Component.displayName = 'Resources';
