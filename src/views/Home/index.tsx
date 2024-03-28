import { useTranslation } from '@ifrc-go/ui/hooks';

import Page from '#components/Page';

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
            descriptionContainerClassName={styles.headingDescription}
            mainSectionClassName={styles.content}
        >
            <OngoingAlertMap
                bbox={undefined}
            />
        </Page>
    );
}

Component.displayName = 'Home';
