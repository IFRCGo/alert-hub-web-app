import {
    Heading,
    PageContainer,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import { _cs } from '@togglecorp/fujs';

import Link from '#components/Link';
import {
    appCommitHash,
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
    const copyrightText = resolveToComponent(
        strings.footerIFRC,
        {
            year,
            appVersion: (
                <span title={appCommitHash}>
                    {appVersion}
                </span>
            ),
        },
    );

    return (
        <PageContainer
            className={_cs(styles.footer, className)}
            contentClassName={styles.content}
            containerAs="footer"
        >
            <div className={styles.section}>
                <Heading>
                    {strings.footerAboutAlertHub}
                </Heading>
                <div className={styles.description}>
                    {strings.footerAboutAlertHubDesc}
                </div>
                <div className={styles.copyright}>
                    {copyrightText}
                </div>
            </div>
            <div className={styles.section}>
                <Heading>
                    {strings.globalFindOut}
                </Heading>
                <div className={styles.subSection}>
                    <Link
                        className={styles.footerLink}
                        href="https://ifrc.org"
                        external
                    >
                        ifrc.org
                    </Link>
                    <Link
                        className={styles.footerLink}
                        href="https://rcrcsims.org"
                        external
                    >
                        rcrcsims.org
                    </Link>
                    <Link
                        className={styles.footerLink}
                        href="https://data.ifrc.org"
                        external
                    >
                        data.ifrc.org
                    </Link>
                </div>
            </div>
            <div className={styles.section}>
                <Heading>
                    {strings.globalHelpfulLinks}
                </Heading>
                <div className={styles.subSection}>
                    <Link
                        className={styles.footerLink}
                        href="https://github.com/IFRCGo/alert-hub-web-app"
                        external
                    >
                        {strings.footerOpenSourceCode}
                    </Link>
                    <Link
                        className={styles.footerLink}
                        href="https://github.com/IFRCGo/alert-hub-backend#readme"
                        external
                    >
                        {strings.footerApiDocumentation}
                    </Link>
                    <Link
                        className={styles.footerLink}
                        to="resources"
                    >
                        {strings.footerOtherResources}
                    </Link>
                </div>
            </div>
            <div className={styles.section}>
                <Heading>
                    {strings.footerContactUs}
                </Heading>
                <Link
                    className={styles.contactButton}
                    href="mailto:im@ifrc.org"
                    external
                    variant="primary"
                >
                    im@ifrc.org
                </Link>
            </div>
        </PageContainer>
    );
}

export default GlobalFooter;
