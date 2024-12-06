import { ExternalLinkLineIcon } from '@ifrc-go/icons';
import { Container } from '@ifrc-go/ui';
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
            url: 'https://cap-workshop.alert-hub.org/2023/index.html',
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
            mainSectionClassName={styles.resources}
            title={strings.resourceAlerthubTitle}
            heading={strings.resourceHeadingTitle}
            description={strings.resourceHeadingDescription}
        >
            <Container
                heading={strings.earlyWarningResourcesTitle}
            >
                {earlyWarningResources.map((resource) => (
                    <Link
                        className={styles.resourceLink}
                        key={resource.id}
                        href={resource.url}
                        actions={<ExternalLinkLineIcon />}
                        external
                    >
                        {resource.title}
                    </Link>
                ))}
            </Container>
            <Container
                heading={strings.faqSectionTitle}
            >
                {frequentlyAskedQuestion.map((faq) => (
                    <Link
                        className={styles.resourceLink}
                        key={faq.id}
                        href={faq.url}
                        actions={<ExternalLinkLineIcon />}
                        external
                    >
                        {faq.title}
                    </Link>
                ))}
            </Container>
            <Container
                heading={strings.howToSubscribeTitle}
                headerDescription={strings.ifrcSubscriptionDescription}
            />
            <Container
                heading={strings.ifrcRelatedLinksTitle}
            >
                {ifrcResources.map((externalLink) => (
                    <Link
                        className={styles.resourceLink}
                        key={externalLink.id}
                        href={externalLink.url}
                        actions={<ExternalLinkLineIcon />}
                        external
                    >
                        {externalLink.title}
                    </Link>
                ))}
            </Container>
            <Container
                heading={strings.ifrcRelatedExternalLinksTitle}
            >

                {externalResources.map((externalLink) => (
                    <Link
                        className={styles.resourceLink}
                        key={externalLink.id}
                        href={externalLink.url}
                        actions={<ExternalLinkLineIcon />}
                        external
                    >
                        {externalLink.title}
                    </Link>
                ))}
            </Container>
        </Page>
    );
}

Component.displayName = 'Resources';
