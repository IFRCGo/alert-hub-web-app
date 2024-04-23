import {
    Container,
    Header,
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
            title="AlertHub - About"
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
                        <Header
                            className={styles.header}
                            heading={strings.aboutTheGoalTitile}
                            headingLevel={1}
                            childrenContainerClassName={styles.description}
                            spacing="loose"
                        >
                            {strings.aboutGoalDescription}
                        </Header>
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
                contentViewType="vertical"
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
            </Container>
            <Container
                heading={strings.aboutTheSolutionTitle}
                withHeaderBorder
                contentViewType="vertical"
            >
                <div>{strings.aboutTheSolutionDescription}</div>
                <div>{strings.aboutSolutionSteps}</div>
                <ol>
                    <li>{strings.aboutSolutionStep1}</li>
                    <li>{strings.aboutSolutionStep2}</li>
                </ol>
            </Container>
            <Container
                heading={strings.aboutDisclaimerTitle}
                contentViewType="vertical"
                withHeaderBorder
            >
                <div>{strings.aboutDisclaimerDescription}</div>
            </Container>
        </Page>
    );
}

Component.displayName = 'About';
