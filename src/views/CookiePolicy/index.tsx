/* eslint-disable react/no-children-prop */
import {
    useRef,
    useState,
} from 'react';
import {
    Container,
    ListView,
    Tab,
    TabList,
    Tabs,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    resolveToComponent,
    resolveToString,
} from '@ifrc-go/ui/utils';

import Link from '#components/Link';
import Page from '#components/Page';

import i18n from './i18n.json';

type TitlesOptionKey = 'disclaimer' | 'use-of-our-information' | 'our-privacy-policy';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const [activeTitlesOption, setActiveTitleOption] = useState<TitlesOptionKey>('disclaimer');

    const disclaimerRef = useRef<HTMLDivElement>(null);
    const useOfOurInformationRef = useRef<HTMLDivElement>(null);
    const ourPrivacyPolicyRef = useRef<HTMLDivElement>(null);

    const handleTabChange = (newTab: TitlesOptionKey) => {
        setActiveTitleOption(newTab);

        const tabRefs = {
            disclaimer: disclaimerRef,
            'use-of-our-information': useOfOurInformationRef,
            'our-privacy-policy': ourPrivacyPolicyRef,
        };
        tabRefs[newTab]?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Page
            heading={strings.cookiePolicyTitle}
        >
            <ListView
                layout="grid"
                withSidebar
                sidebarPosition="start"
            >
                <Tabs
                    value={activeTitlesOption}
                    onChange={handleTabChange}
                    styleVariant="vertical"
                >
                    <TabList>
                        <Tab name="disclaimer">
                            {strings.disclaimerTitle}
                        </Tab>
                        <Tab name="use-of-our-information">
                            {strings.useOfOurInformationTitle}
                        </Tab>
                        <Tab name="our-privacy-policy">
                            {strings.ourPrivacyPolicyHeading}
                        </Tab>
                    </TabList>
                </Tabs>
                <ListView
                    layout="block"
                    spacing="none"
                >
                    <Container
                        children={undefined}
                        heading={strings.disclaimerTitle}
                        footerIcons={strings.disclaimerDescription}
                        withHeaderBorder
                        withPadding
                        elementRef={disclaimerRef}
                    />
                    <Container
                        children={undefined}
                        heading={strings.useOfOurInformationTitle}
                        elementRef={useOfOurInformationRef}
                        footer={(
                            <ListView layout="block" spacing="sm">
                                <div>{strings.useOfOurInformationDescription1}</div>
                                <div>
                                    { resolveToComponent(
                                        strings.useOfOurInformationDescription2,
                                        {
                                            termsLink: (
                                                <Link
                                                    href="mailto:av@ifrc.org"
                                                    withUnderline
                                                    external
                                                    withLinkIcon
                                                    spacing="xs"
                                                >
                                                    {strings.useOfOurInformationAudiovisualLink}
                                                </Link>
                                            ),
                                        },
                                    )}
                                </div>
                                <div>{strings.useOfOurInformationDescription3}</div>
                                <div>
                                    <Link
                                        href="https://www.ifrc.org/fraudulent-emails-and-websites"
                                        withUnderline
                                        withLinkIcon
                                        spacing="xs"
                                        external
                                    >
                                        {strings.useOfOurInformationDescriptionLink}
                                    </Link>
                                </div>
                            </ListView>
                        )}
                        withHeaderBorder
                        withPadding
                    />
                    <Container
                        heading={strings.ourPrivacyPolicyHeading}
                        withHeaderBorder
                        withPadding
                        elementRef={ourPrivacyPolicyRef}
                    >
                        <ListView
                            layout="block"
                            spacing="lg"
                        >
                            <div>
                                {resolveToString(strings.ourPrivacyPolicyContent, {
                                    publishedDay: 'November',
                                    publishedDate: 29,
                                    publishedYear: 2021,
                                })}
                            </div>
                            <ListView
                                layout="block"
                                spacing="lg"
                            >
                                <Container
                                    heading={strings.dataCollectedByAccessingHeading}
                                    headingLevel={4}
                                >
                                    <ListView
                                        layout="block"
                                        spacing="lg"
                                    >
                                        <Container
                                            children={undefined}
                                            heading={strings.informationProvideHeading}
                                            headingLevel={5}
                                            footer={(
                                                <>
                                                    {strings.informationProvideDescription1}
                                                    {strings.informationProvideDescription2}
                                                </>
                                            )}
                                        />
                                        <Container
                                            children={undefined}
                                            heading={strings.automaticallyCollectedHeading}
                                            headingLevel={5}
                                            footer={(
                                                <ListView layout="block" spacing="sm">
                                                    <div>
                                                        {strings.automaticallyCollectedDescription}
                                                    </div>
                                                    <ul>
                                                        <li>
                                                            {strings.automaticallyCollectedList1}
                                                        </li>
                                                        <li>
                                                            {strings.automaticallyCollectedList2}
                                                        </li>
                                                        <li>
                                                            {strings.automaticallyCollectedList3}
                                                        </li>
                                                        <li>
                                                            {strings.automaticallyCollectedList4}
                                                        </li>
                                                        <li>
                                                            {strings.automaticallyCollectedList5}
                                                        </li>
                                                    </ul>
                                                </ListView>
                                            )}
                                        />
                                        <Container
                                            children={undefined}
                                            heading={strings.ifrcLimitedCookiesAnalyticHeading}
                                            headingLevel={5}
                                            footer={(
                                                <ListView layout="block" spacing="sm">
                                                    <div>
                                                        {strings
                                                            .ifrcLimitedCookiesAnalyticDescription}
                                                    </div>
                                                    <ul>
                                                        <li>
                                                            {strings
                                                                .ifrcLimitedCookiesAnalyticList1}
                                                        </li>
                                                        <li>
                                                            {strings
                                                                .ifrcLimitedCookiesAnalyticList2}
                                                        </li>
                                                        <li>
                                                            {strings
                                                                .ifrcLimitedCookiesAnalyticList3}
                                                        </li>
                                                        <li>
                                                            {strings
                                                                .ifrcLimitedCookiesAnalyticList4}
                                                        </li>
                                                    </ul>
                                                    <div>
                                                        {strings
                                                            .ifrcLimitedCookiesAnalyticDescription2}
                                                    </div>
                                                    <div>
                                                        {strings
                                                            .ifrcLimitedCookiesAnalyticDescription3}
                                                    </div>
                                                </ListView>
                                            )}
                                        />
                                    </ListView>
                                </Container>
                                <Container
                                    children={undefined}
                                    heading={strings.howInformationUsedHeading}
                                    headingLevel={4}
                                    footer={(
                                        <ListView layout="block" spacing="sm">
                                            <div>
                                                {strings.howInformationUsedDescription}
                                            </div>
                                            <ul>
                                                <li>
                                                    {strings
                                                        .howInformationUsedDescriptionList1}
                                                </li>
                                                <li>
                                                    {strings
                                                        .howInformationUsedDescriptionList2}
                                                </li>
                                                <li>
                                                    {strings
                                                        .howInformationUsedDescriptionList3}
                                                </li>
                                                <li>
                                                    {strings
                                                        .howInformationUsedDescriptionList4}
                                                </li>
                                                <li>
                                                    {strings
                                                        .howInformationUsedDescriptionList5}
                                                </li>
                                                <li>
                                                    {strings
                                                        .howInformationUsedDescriptionList6}
                                                </li>
                                            </ul>
                                        </ListView>
                                    )}
                                />
                                <Container
                                    children={undefined}
                                    heading={strings.dataAccessSharingHeading}
                                    headingLevel={4}
                                    footer={(
                                        <>
                                            <div>{strings.dataAccessSharingDescription1}</div>
                                            <div>{strings.dataAccessSharingDescription2}</div>
                                            <div>{strings.dataAccessSharingDescription3}</div>
                                        </>
                                    )}
                                />
                                <Container
                                    children={undefined}
                                    heading={strings.storageSecurityQuestionsAboutDataHeading}
                                    headingLevel={4}
                                    footer={(
                                        <ListView
                                            layout="block"
                                            spacing="sm"
                                        >
                                            <div>
                                                {strings.storageSecurityQuestionsDataDescription1}
                                            </div>
                                            <div>
                                                {strings.storageSecurityQuestionsDataDescription2}
                                            </div>
                                            <div>
                                                {resolveToComponent(
                                                    strings
                                                        .storageSecurityQuestionsDataDescription3,
                                                    {
                                                        termsLink: (
                                                            <Link
                                                                href="https://www.ifrc.org/document/IFRC-Data-Protection-Policy"
                                                                withUnderline
                                                                withLinkIcon
                                                                external
                                                                spacing="xs"
                                                            >
                                                                {strings
                                                                    .policyPersonalDataLink}
                                                            </Link>
                                                        ),
                                                    },
                                                )}
                                            </div>
                                            <div>
                                                {resolveToComponent(
                                                    strings
                                                        .storageSecurityQuestionsDataDescription4,
                                                    {
                                                        termsLink: (
                                                            <Link
                                                                href="https://www.ifrc.org/data-protection"
                                                                withUnderline
                                                                withLinkIcon
                                                                external
                                                                spacing="xs"
                                                            >
                                                                {strings.dataProtectionPageLink}
                                                            </Link>
                                                        ),
                                                    },
                                                )}
                                            </div>
                                            {strings.storageSecurityQuestionsDataDescription5}
                                            <strong>
                                                { resolveToComponent(
                                                    strings.storageSecurityQuestionsDataGoEnquires,
                                                    {
                                                        termsLink: (
                                                            <Link
                                                                href="mailto:im@ifrc.org"
                                                                withUnderline
                                                                withLinkIcon
                                                                external
                                                                spacing="xs"
                                                            >
                                                                im@ifrc.org
                                                            </Link>
                                                        ),
                                                    },
                                                )}
                                            </strong>
                                            <strong>
                                                { resolveToComponent(
                                                    strings.storageSecurityQuestionsDataDonations,
                                                    {
                                                        termsLink: (
                                                            <Link
                                                                href="mailto:prd@ifrc.org"
                                                                withUnderline
                                                                withLinkIcon
                                                                external
                                                                spacing="xs"
                                                            >
                                                                prd@ifrc.org
                                                            </Link>
                                                        ),
                                                    },
                                                )}
                                            </strong>
                                            <strong>
                                                {resolveToComponent(
                                                    strings.storageSecurityQuestionsDataRecruitment,
                                                    {
                                                        termsLink: (
                                                            <Link
                                                                href="mailto:ask.hr@ifrc.org"
                                                                withUnderline
                                                                withLinkIcon
                                                                external
                                                                spacing="xs"
                                                            >
                                                                ask.hr@ifrc.org
                                                            </Link>
                                                        ),
                                                    },
                                                )}
                                            </strong>
                                            <strong>
                                                { resolveToComponent(
                                                    strings.securityQuestionsWebpageCollection,
                                                    {
                                                        termsLink: (
                                                            <Link
                                                                href="mailto:webteam@ifrc.org"
                                                                withUnderline
                                                                withLinkIcon
                                                                external
                                                                spacing="xs"
                                                            >
                                                                webteam@ifrc.org
                                                            </Link>
                                                        ),
                                                    },
                                                )}
                                            </strong>
                                            <strong>
                                                { resolveToComponent(
                                                    strings.storageSecurityQuestionsDataEnquires,
                                                    {
                                                        termsLink: (
                                                            <Link
                                                                href="mailto:dataprotection@ifrc.org"
                                                                withUnderline
                                                                withLinkIcon
                                                                external
                                                                spacing="xs"
                                                            >
                                                                dataprotection@ifrc.org
                                                            </Link>
                                                        ),
                                                    },
                                                )}
                                            </strong>
                                        </ListView>
                                    )}
                                />
                                <Container
                                    children={undefined}
                                    heading={strings.privilegesAndImmunitiesHeading}
                                    headingLevel={4}
                                    footer={strings.privilegesAndImmunitiesDescription}

                                />
                                <Container
                                    children={undefined}
                                    heading={strings.noteOnLinksToExternalWebsitesHeading}
                                    headingLevel={4}
                                    footer={(
                                        <>
                                            {strings.noteOnLinksToExternalWebsitesDescription1}
                                            {strings.noteOnLinksToExternalWebsitesDescription2}
                                        </>
                                    )}
                                />
                            </ListView>
                        </ListView>
                    </Container>
                </ListView>
            </ListView>
        </Page>
    );
}

Component.displayName = 'CookiePolicy';
