import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import i18n from './i18n.json';
import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    return (
        <Container
            className={(styles.container)}
            spacing="comfortable"
        >
            <div className={styles.content} />
            <div className={styles.text}>
                <h2>{strings.aboutTheGoalTitile}</h2>
                <p>{strings.aboutGoalDescription}</p>
            </div>
            <div className={styles.image}>
                <img src="path/to/image.jpg" alt="Description" />
            </div>
            <Container
                heading={strings.aboutTheProblemTitle}
                withHeaderBorder
            >
                <div>{strings.aboutTheProblemDescription}</div>
                <div>{strings.aboutProblemFactorsIncluding}</div>
                <li>{strings.aboutTheProblemHazardInformation}</li>
                <li>{strings.aboutTheProblemOverlyComplicated}</li>
                <li>{strings.aboutTheProblemActionableGuidance}</li>
                <li>{strings.aboutTheProblemLimitedBroadcasting}</li>
            </Container>
            <Container
                headingLevel={2}
                heading={strings.aboutTheSolutionTitile}
                withHeaderBorder
                spacing="comfortable"
            >
                <div>{strings.aboutTheSolutionDescription}</div>
                <div>{strings.aboutSolutionSteps}</div>
                <p>{strings.aboutSolutionStep1}</p>
                <p>{strings.aboutSolutionStep2}</p>
            </Container>
            <Container
                headingLevel={2}
                heading={strings.aboutDisclaimerTitle}
                withHeaderBorder
                spacing="comfortable"
            >
                <div>{strings.aboutDisclaimerDescription}</div>
            </Container>
        </Container>
    );
}

Component.displayName = 'About';
