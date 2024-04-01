import { Link } from 'react-router-dom';
import {
    Heading,
    PageContainer,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import { _cs } from '@togglecorp/fujs';

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
                        to="https://ifrc.org"
                        target="_blank"
                    >
                        ifrc.org
                    </Link>
                    <Link
                        className={styles.footerLink}
                        to="https://rcrcsims.org"
                        target="_blank"
                    >
                        rcrcsims.org
                    </Link>
                    <Link
                        className={styles.footerLink}
                        to="https://data.ifrc.org"
                        target="_blank"
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
                        to="https://github.com/IFRCGo/alert-hub-web-app"
                        target="_blank"
                    >
                        {strings.footerOpenSourceCode}
                    </Link>
                    <Link
                        className={styles.footerLink}
                        to="https://github.com/IFRC-Alert-Hub/Alert-Hub-Alert-Manager#api-documentation"
                        target="_blank"
                    >
                        {strings.footerApiDocumentation}
                    </Link>
                    {/* // FIXME: Add Resource route */}
                    <Link
                        className={styles.footerLink}
                        to="/"
                        target="_blank"
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
                    to="mailto:im@ifrc.org"
                >
                    im@ifrc.org
                </Link>
            </div>
        </PageContainer>
    );
}

export default GlobalFooter;
