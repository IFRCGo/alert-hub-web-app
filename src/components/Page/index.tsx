import {
    ElementRef,
    RefObject,
    useEffect,
} from 'react';
import {
    ListView,
    PageContainer,
    PageHeader,
} from '@ifrc-go/ui';
import {
    _cs,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import styles from './styles.module.css';

interface Props {
    className?: string;
    title?: string;
    actions?: React.ReactNode;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    mainSectionContainerClassName?: string;
    breadCrumbs?: React.ReactNode;
    info?: React.ReactNode;
    children?: React.ReactNode;
    mainSectionClassName?: string;
    wikiLink?: React.ReactNode;
    withBackgroundColorInMainSection?: boolean;
    elementRef?: RefObject<ElementRef<'div'>>;
    blockingContent?: React.ReactNode;
    beforeHeaderContent?: React.ReactNode;
}

function Page(props: Props) {
    const {
        className,
        title,
        actions,
        heading,
        description,
        breadCrumbs,
        info,
        children,
        mainSectionContainerClassName,
        mainSectionClassName,
        wikiLink,
        withBackgroundColorInMainSection,
        elementRef,
        blockingContent,
        beforeHeaderContent,
    } = props;

    useEffect(() => {
        if (isDefined(title)) {
            document.title = title;
        }
    }, [title]);

    const showPageContainer = !!breadCrumbs
        || !!heading
        || !!description
        || !!info
        || !!actions
        || !!wikiLink;

    return (
        <div
            className={_cs(
                styles.page,
                className,
            )}
            ref={elementRef}
        >
            {beforeHeaderContent && (
                <PageContainer>
                    {beforeHeaderContent}
                </PageContainer>
            )}
            {isNotDefined(blockingContent) && showPageContainer && (
                <PageHeader
                    className={_cs(
                        styles.pageHeader,
                        className,
                    )}
                    breadCrumbs={breadCrumbs}
                    actions={actions}
                    heading={heading}
                    description={description}
                    info={info}
                />
            )}
            {isNotDefined(blockingContent) && (
                <PageContainer
                    contentAs="main"
                    className={_cs(
                        styles.mainSectionContainer,
                        mainSectionContainerClassName,
                        withBackgroundColorInMainSection && styles.withBackgroundColor,
                    )}
                    contentClassName={_cs(
                        styles.mainSection,
                        mainSectionClassName,
                    )}
                >
                    <ListView
                        layout="block"
                    >
                        { children }
                    </ListView>
                </PageContainer>
            )}
        </div>
    );
}

export default Page;
