import {
    Container,
    ListView,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';
import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    const earlyWarningResources = [
        {
            id: 1,
            title: strings.earlyWarningResourceIfrcewea,
            url: 'https://www.ifrc.org/our-work/disasters-climate-and-crises/climate-smart-disaster-risk-reduction/early-warning-early',
        },
        {
            id: 2,
            title: strings.earlyWarningResourceGdpcEws,
            url: 'https://preparecenter.org/topic/early-warning-systems/',
        },
        {
            id: 3,
            title: strings.earlyWarningResourceWmoCapCourse,
            url: 'https://etrp.wmo.int/course/view.php?id=157',
        },
        {
            id: 4,
            title: strings.earlyWarningResourceIfrcPape,
            url: 'https://www.ifrc.org/our-work/disasters-climate-and-crises/climate-smart-disaster-risk-reduction/PAPE',
        },
    ];
    const frequentlyAskedQuestion = [
        {
            id: 1,
            title: strings.faqWhoIsTheAudience,
            url: 'https://alerthub.ifrc.org/about',
        },
        {
            id: 2,
            title: strings.faqWhoIsBehind,
            url: 'https://alerthub.ifrc.org/feeds',
        },
        {
            id: 3,
            title: strings.faqHowToAccess,
            url: 'https://github.com/IFRCGo/alert-hub-web-app/blob/develop/APIDOCS.md',
        },

    ];
    const ifrcResources = [
        {
            id: 1,
            title: strings.ifrcRelatedLinksGo,
            url: 'https://go.ifrc.org/',
        },
        {
            id: 2,
            title: strings.ifrcRelatedLinksGdpc,
            url: 'https://preparecenter.org/',
        },
        {
            id: 3,
            title: strings.ifrcRelatedLinksClimateCenter,
            url: 'https://www.climatecentre.org/',
        },
        {
            id: 4,
            title: strings.ifrcRelatedLinksAnticipationHub,
            url: 'https://www.anticipation-hub.org/',
        },
    ];
    const externalResources = [
        {
            id: 1,
            title: strings.ifrcRelatedExternalLinksGo,
            url: 'https://alertingauthority.wmo.int',
        },
        {
            id: 2,
            title: strings.ifrcRelatedExternalLinksCapImplementation,
            url: 'https://cap-workshop.alert-hub.org/2024/index.html',
        },
        {
            id: 3,
            title: strings.ifrcRelatedExternalLinksGooglePublicAlerts,
            url: 'https://support.google.com/publicalerts/?hl=en',
        },
        {
            id: 4,
            title: strings.ifrcRelatedExternalLinksEarlyWarningAllInitiative,
            url: 'https://www.un.org/en/climatechange/early-warnings-for-all',
        },
    ];

    return (
        <Page
            title={strings.resourceAlerthubTitle}
            heading={strings.resourceHeadingTitle}

        >
            <ListView
                layout="block"
                spacing="xl"
            >
                <Container
                    heading={strings.earlyWarningResourcesTitle}
                >
                    <ListView
                        layout="block"
                    >
                        {earlyWarningResources.map((resource) => (
                            <Link
                                className={styles.resourceLink}
                                key={resource.id}
                                href={resource.url}
                                withLinkIcon
                                external
                            >
                                {resource.title}
                            </Link>
                        ))}
                    </ListView>
                </Container>
                <Container
                    heading={strings.faqSectionTitle}
                >
                    <ListView
                        layout="block"
                    >
                        {frequentlyAskedQuestion.map((faq) => (
                            <Link
                                className={styles.resourceLink}
                                key={faq.id}
                                href={faq.url}
                                external
                                withLinkIcon
                            >
                                {faq.title}
                            </Link>
                        ))}
                    </ListView>
                </Container>
                <Container
                // eslint-disable-next-line react/no-children-prop
                    children={undefined}
                    heading={strings.howToSubscribeTitle}
                    headerDescription={strings.ifrcSubscriptionDescription}
                />
                <Container
                    heading={strings.ifrcRelatedLinksTitle}
                >
                    <ListView
                        layout="block"
                    >
                        {ifrcResources.map((externalLink) => (
                            <Link
                                className={styles.resourceLink}
                                key={externalLink.id}
                                href={externalLink.url}
                                external
                                withLinkIcon
                            >
                                {externalLink.title}
                            </Link>
                        ))}
                    </ListView>
                </Container>
                <Container
                    heading={strings.ifrcRelatedExternalLinksTitle}
                >
                    <ListView
                        layout="block"
                    >
                        {externalResources.map((externalLink) => (
                            <Link
                                className={styles.resourceLink}
                                key={externalLink.id}
                                href={externalLink.url}
                                withLinkIcon
                                external
                            >
                                {externalLink.title}
                            </Link>
                        ))}
                    </ListView>
                </Container>
            </ListView>
        </Page>
    );
}

Component.displayName = 'Resources';
