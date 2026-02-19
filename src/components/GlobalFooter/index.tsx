import {
    Container,
    ListView,
    PageContainer,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import { _cs } from '@togglecorp/fujs';

import Link from '#components/Link';
import {
    appCommitHash,
    appPackageName,
    appRepositoryUrl,
    appVersion,
} from '#config';

import i18n from './i18n.json';
import styles from './styles.module.css';

const date = new Date();
const year = date.getFullYear();

interface Props {
    className?: string;
}

function GlobalFooter(props: Props) {
    const {
        className,
    } = props;

    const strings = useTranslation(i18n);
    const versionTag = `${appPackageName}@${appVersion}`;
    const versionUrl = `${appRepositoryUrl}/releases/tag/${versionTag}`;
    const copyrightText = resolveToComponent(
        strings.footerIFRC,
        {
            year,
            appVersion: (
                <Link
                    href={versionUrl}
                    title={appCommitHash}
                    external
                    colorVariant="text-on-dark"
                    className={styles.footerLink}
                    withLinkIcon
                    spacing="xs"

                >
                    {appVersion}
                </Link>
            ),
        },
    );

    return (
        <PageContainer
            className={_cs(styles.footer, className)}
            contentClassName={styles.content}
            containerAs="footer"
        >
            <ListView
                layout="grid"
                numPreferredGridColumns={5}
                spacing="xl"
                minGridColumnSize="14rem"
            >
                <Container
                    heading={strings.footerAboutAlertHub}
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <div>
                            {strings.footerAboutAlertHubDesc}
                        </div>
                        <div>
                            {copyrightText}
                        </div>
                    </ListView>
                </Container>
                <Container
                    heading={strings.globalFindOut}
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <Link
                            href="https://ifrc.org"
                            external
                            colorVariant="text-on-dark"
                        >
                            ifrc.org
                        </Link>
                        <Link
                            href="https://rcrcsims.org"
                            external
                            colorVariant="text-on-dark"
                        >
                            rcrcsims.org
                        </Link>
                        <Link
                            href="https://data.ifrc.org"
                            external
                            colorVariant="text-on-dark"
                        >
                            data.ifrc.org
                        </Link>
                    </ListView>
                </Container>
                <Container
                    heading={strings.policies}
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <Link
                            to="cookiePolicy"
                            colorVariant="text-on-dark"
                        >
                            {strings.cookiePolicy}
                        </Link>
                    </ListView>
                </Container>
                <Container
                    heading={strings.globalHelpfulLinks}
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <Link
                            href="https://github.com/IFRCGo/alert-hub-web-app"
                            external
                            colorVariant="text-on-dark"
                        >
                            {strings.footerOpenSourceCode}
                        </Link>
                        <Link
                            href="https://github.com/IFRCGo/alert-hub-web-app/blob/develop/APIDOCS.md"
                            external
                            colorVariant="text-on-dark"

                        >
                            {strings.footerApiDocumentation}
                        </Link>
                        <Link
                            to="resources"
                            colorVariant="text-on-dark"

                        >
                            {strings.footerOtherResources}
                        </Link>
                    </ListView>
                </Container>
                <Container
                    heading={strings.footerContactUs}
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <Link
                            href="mailto:im@ifrc.org"
                            colorVariant="primary"
                            styleVariant="filled"
                            external
                            withLinkIcon
                        >
                            im@ifrc.org
                        </Link>
                    </ListView>
                </Container>
            </ListView>

        </PageContainer>
    );
}

export default GlobalFooter;
