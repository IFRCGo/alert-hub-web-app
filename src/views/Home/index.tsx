import { useTranslation } from '@ifrc-go/ui/hooks';

import Page from '#ui/Page';

import OngoingAlertMap from '../AlertMap';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    return (
        <Page
            title={strings.homeTitle}
            className={styles.home}
            heading={strings.homeHeading}
            description={strings.homeDescription}
            mainSectionClassName={styles.content}
        >
            <OngoingAlertMap />
        </Page>
    );
}

Component.displayName = 'Home';
