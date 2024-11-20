import { useContext } from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
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
import UserContext from '#contexts/user';
import { LogoutMutation } from '#generated/types/graphql';
import useAuth from '#hooks/domain/useAuth';
import useAlert from '#hooks/useAlert';

import LangaugeDropdown from './LanguageDropdown';

import i18n from './i18n.json';
import styles from './styles.module.css';

const LOGOUT = gql`
    mutation Logout {
        private {
            logout {
                ok
                errors
            }
        }
    }
`;

interface Props {
    className?: string;
}
function Navbar(props: Props) {
    const { className } = props;
    const strings = useTranslation(i18n);
    const { isAuthenticated } = useAuth();
    const alert = useAlert();

    const {
        removeUserAuth: removeUser,
    } = useContext(UserContext);

    const [
        triggerLogout,
        { loading: logoutPending },
    ] = useMutation<LogoutMutation>(
        LOGOUT,
        {
            onCompleted: (logoutResponse) => {
                const response = logoutResponse?.private?.logout;
                if (response.ok) {
                    window.location.reload();
                    removeUser();
                } else {
                    alert.show(
                        strings.logoutFailure,
                        { variant: 'danger' },
                    );
                }
            },
            onError: () => {
                alert.show(
                    strings.logoutFailure,
                    { variant: 'danger' },
                );
            },
        },
    );

    return (
        <nav className={_cs(styles.navbar, className)}>
            <PageContainer
                className={styles.top}
                contentClassName={styles.topContent}
            >
                <div className={styles.brand}>
                    <Link
                        className={styles.alertHubTitle}
                        to="homeIndex"
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
                            Alert Hub
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
                    {!isAuthenticated && (
                        <Link
                            variant="primary"
                            to="login"
                        >
                            {strings.appLogin}
                        </Link>
                    )}
                    {isAuthenticated && (
                        <Button
                            name={undefined}
                            variant="primary"
                            onClick={triggerLogout}
                            disabled={logoutPending}
                        >
                            {strings.userLogout}
                        </Button>
                    )}
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
                        to="homeIndex"
                    >
                        {strings.headerMenuHome}
                    </NavigationTab>
                    {isAuthenticated && (
                        <NavigationTab
                            to="mySubscription"
                        >
                            {strings.headerMenuMySubscription}
                        </NavigationTab>
                    )}
                    <NavigationTab
                        to="historicalAlerts"
                    >
                        {strings.historicalAlerts}
                    </NavigationTab>
                </NavigationTabList>
            </PageContainer>
        </nav>
    );
}

export default Navbar;
