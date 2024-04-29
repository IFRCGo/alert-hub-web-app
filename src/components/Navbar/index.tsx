import {
    Button,
    Heading,
    NavigationTabList,
    PageContainer,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { _cs } from '@togglecorp/fujs';

import goLogo from '#assets/icons/go-logo-2020.svg';
import Link from '#components/Link';
import NavigationTab from '#components/NavigationTab';

import LangaugeDropdown from './LanguageDropdown';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props {
    className?: string;
}
function Navbar(props: Props) {
    const {
        className,
    } = props;
    const strings = useTranslation(i18n);
    return (
        <nav className={_cs(styles.navbar, className)}>
            <PageContainer
                className={styles.top}
                contentClassName={styles.topContent}
            >
                <div className={styles.brand}>
                    <Link
                        className={styles.alertHubTitle}
                        to="home"
                        linkElementClassName={styles.linkElement}
                    >
                        <img
                            className={styles.goIcon}
                            src={goLogo}
                            alt={strings.headerLogoAltText}
                        />
                        <Heading
                            level={2}
                        >
                            ALERT HUB
                        </Heading>
                    </Link>
                </div>
                <NavigationTabList
                    variant="tertiary"
                >
                    <LangaugeDropdown />
                    <NavigationTab
                        to="about"
                    >
                        {strings.appAbout}
                    </NavigationTab>
                    <NavigationTab
                        to="resources"
                    >
                        {strings.appResources}
                    </NavigationTab>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={undefined}
                    >
                        {strings.appLogin}
                    </Button>
                </NavigationTabList>
            </PageContainer>
            <PageContainer
                contentClassName={styles.bottom}
            >
                <NavigationTabList
                    className={styles.menuItem}
                    variant="tertiary"
                >
                    <NavigationTab
                        to="home"
                    >
                        {strings.headerMenuHome}
                    </NavigationTab>
                </NavigationTabList>
            </PageContainer>
        </nav>
    );
}
export default Navbar;
