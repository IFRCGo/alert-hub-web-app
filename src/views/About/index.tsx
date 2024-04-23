import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Page from '#components/Page';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    return (

        <Page
            mainSectionClassName={styles.aboutPage}
        >
            <Container>
                <div className={styles.content}>
                    <div className={styles.text}>
                        <h2>{strings.aboutTheGoalTitile}</h2>
                        <p>{strings.aboutGoalDescription}</p>
                    </div>
                    <div className={styles.image}>
                        <img
                            src="src/assets/about.png"
                            alt=""
                        />
                    </div>
                </div>

            </Container>

            <Container
                heading={strings.aboutTheProblemTitle}
                childrenContainerClassName={styles.aboutSubHeading}
                withHeaderBorder
            >
                <div>
                    {strings.aboutTheProblemDescription}
                </div>
                <div>
                    {strings.aboutProblemFactorsIncluding}
                </div>
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
            </Container>
            <Container
                heading={strings.aboutTheSolutionTitle}
                childrenContainerClassName={styles.aboutSubHeading}
                withHeaderBorder
            >
                <div>{strings.aboutTheSolutionDescription}</div>
                <div>{strings.aboutSolutionSteps}</div>
                <ol className={styles.aboutSolutionList}>
                    <li>{strings.aboutSolutionStep1}</li>
                    <li>{strings.aboutSolutionStep2}</li>
                </ol>
            </Container>
            <Container
                heading={strings.aboutDisclaimerTitle}
                childrenContainerClassName={styles.aboutSubHeading}
                withHeaderBorder
            >
                <div>{strings.aboutDisclaimerDescription}</div>
            </Container>
        </Page>
    );
}

Component.displayName = 'About';
