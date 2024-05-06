import { SearchLineIcon } from '@ifrc-go/icons';
import { Heading } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';
import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    return (
        <Page
            className={styles.pageNotFound}
            title={strings.pageNotFoundTitle}
            mainSectionContainerClassName={styles.mainSectionContainer}
            mainSectionClassName={styles.main}
        >
            <div className={styles.topSection}>
                <Heading
                    level={1}
                    className={styles.heading}
                >
                    <div className={styles.icons}>
                        <SearchLineIcon className={styles.searchIcon} />
                        <Heading
                            level={2}
                        >
                            {strings.pageNotFoundHeadingLabel}
                        </Heading>
                    </div>
                    {strings.pageNotFoundHeading}
                </Heading>
                <div className={styles.description}>
                    {strings.pageNotFoundPageDescription}
                </div>
            </div>
            <div className={styles.bottomSection}>
                {strings.pageNotFoundAreYouSureUrlIsCorrect}
                <div className={styles.text}>
                    <Link
                        href="mailto:im@ifrc.org"
                        external
                    >
                        {strings.pageNotFoundGetInTouch}
                    </Link>
                    &nbsp;
                    {strings.pageNotFoundWithThePlatformTeam}
                </div>
                <Link
                    to="homeLayout"
                    variant="primary"
                >
                    {strings.pageNotFoundExploreOurHomepage}
                </Link>
            </div>
        </Page>
    );
}

Component.displayName = 'PageNotFound';
