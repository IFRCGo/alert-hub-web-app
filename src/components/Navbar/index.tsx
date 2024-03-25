import { Link } from 'react-router-dom';
import {
    Button,
    NavigationTabList,
    PageContainer,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { _cs } from '@togglecorp/fujs';

import goLogo from '#assets/icons/go-logo-2020.svg';

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
                    <Link to="home">
                        <img
                            className={styles.goIcon}
                            src={goLogo}
                            alt={strings.headerLogoAltText}
                        />
                    </Link>
                </div>
                <NavigationTabList
                    className={styles.actions}
                    variant="tertiary"
                >
                    <LangaugeDropdown />
                    <Link
                        className={styles.actionItem}
                        to="/"
                    >
                        {strings.appAbout}
                    </Link>
                    <Link
                        className={styles.actionItem}
                        to="/"
                    >
                        {strings.appResources}
                    </Link>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={undefined}
                    >
                        {strings.appLogin}
                    </Button>
                </NavigationTabList>
            </PageContainer>
        </nav>
    );
}

export default Navbar;
