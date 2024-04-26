import { Link } from 'react-router-dom';
import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    const resourceData = [
        {
            id: 1,
            heading: strings.resourceAlertHubAPIs,
            description: strings.resourceAlertHubAPIsDescription,
            url: 'https://github.com/IFRC-Alert-Hub/Alert-Hub-Alert-Manager#api-documentation',
        },
        {
            id: 2,
            heading: strings.resourceAlertHubFrontendTitle,
            description: strings.resourceAlertHubFrontendDescription,
            url: 'https://github.com/IFRC-Alert-Hub/Alert-Hub-Frontend#readme',
        },
        {
            id: 3,
            heading: strings.resourceAlertHubCapAggregatorTitle,
            description: strings.resourceAlertHubCapAggregatorDescription,
            url: 'https://github.com/IFRC-Alert-Hub/Alert-Hub-CAP-Aggregator#readme',
        },
        {
            id: 4,
            heading: strings.resourceAlertHubAlertManagerTitle,
            description: strings.resourceAlertHubAlertManagerDescription,
            url: 'https://github.com/IFRC-Alert-Hub/Alert-Hub-Alert-Manager#readme',
        },
        {
            id: 5,
            heading: strings.resourceAlertHubSubscriptionSystemTitle,
            description: strings.resourceAlertHubSubscriptionSystemDescription,
            url: 'https://github.com/IFRC-Alert-Hub/Alert-Hub-Subscription-System#readme',
        },
    ];

    return (
        <Page
            className={styles.resources}
            title={strings.resourceAlerthubTitle}
            heading={strings.resourceHeadingTitle}
            description={strings.resourceHeadingDescription}
        >
            <Container
                headingLevel={2}
                contentViewType="grid"
                numPreferredGridContentColumns={2}
                spacing="relaxed"
            >
                {resourceData.map(
                    (resource) => (
                        <Container
                            className={styles.resourcesCard}
                            heading={resource.heading}
                            footerContent={(
                                <Link
                                    to={resource.url}
                                    className={styles.resourcesItem}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {strings.resourceLearMore}
                                </Link>
                            )}
                        >
                            {resource.description}
                        </Container>
                    ),
                )}
            </Container>
        </Page>
    );
}

Component.displayName = 'Resources';
