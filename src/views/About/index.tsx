import {
    Container,
    ListView,
    PageContainer,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Page from '#components/Page';

import aboutIcon from './about.png';
import backgroundImage from './homepage_bg.png';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    return (
        <Page
            title={strings.aboutAlertHubTitle}
            className={styles.about}
            beforeHeaderContent={(
                <div className={styles.headerContainer}>
                    <img
                        className={styles.backgroundImage}
                        src={backgroundImage}
                        alt=""
                    />
                    <PageContainer
                        className={styles.headerContentSection}
                        contentClassName={styles.content}
                    >
                        <Container
                            className={styles.header}
                            heading={strings.aboutTheGoalTitile}
                            headingLevel={2}
                            spacing="xl"
                        >
                            <div className={styles.description}>
                                {strings.aboutGoalDescription}
                            </div>
                        </Container>
                        <img
                            className={styles.aboutIcon}
                            src={aboutIcon}
                            alt=""
                        />
                    </PageContainer>
                </div>
            )}
            mainSectionClassName={styles.pageContent}
        >
            <Container
                heading={strings.aboutTheProblemTitle}
                withHeaderBorder
                spacing="md"
            >
                <ListView
                    layout="block"
                    spacing="sm"
                >
                    <div>
                        {strings.aboutTheProblemDescription}
                    </div>
                    <div>
                        {strings.aboutProblemFactorsIncluding}
                    </div>
                    <ul>
                        <li>
                            {strings.aboutTheProblemHazardInformation}
                        </li>
                        <li>
                            {strings.aboutTheProblemOverlyComplicated}
                        </li>
                        <li>
                            {strings.aboutTheProblemActionableGuidance}
                        </li>
                        <li>
                            {strings.aboutTheProblemLimitedBroadcasting}
                        </li>
                    </ul>
                </ListView>
            </Container>
            <Container
                heading={strings.aboutTheSolutionTitle}
                withHeaderBorder
            >
                <ListView
                    layout="block"
                    spacing="sm"
                >
                    <div>{strings.aboutTheSolutionDescription}</div>
                    <div>{strings.aboutSolutionSteps}</div>
                    <ol>
                        <li>{strings.aboutSolutionStep1}</li>
                        <li>{strings.aboutSolutionStep2}</li>
                    </ol>
                </ListView>
            </Container>
            <Container
                heading={strings.aboutDisclaimerTitle}
                withHeaderBorder
            >
                <ListView
                    layout="block"
                    spacing="sm"
                >
                    <div>{strings.aboutDisclaimerDescription}</div>
                </ListView>
            </Container>
        </Page>
    );
}

Component.displayName = 'About';
