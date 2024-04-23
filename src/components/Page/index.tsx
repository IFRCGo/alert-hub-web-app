import {
    ElementRef,
    RefObject,
    useEffect,
} from 'react';
import {
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
    descriptionContainerClassName?: string;
    mainSectionContainerClassName?: string;
    breadCrumbs?: React.ReactNode;
    info?: React.ReactNode;
    children?: React.ReactNode;
    mainSectionClassName?: string;
    infoContainerClassName?: string;
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
        descriptionContainerClassName,
        breadCrumbs,
        info,
        children,
        mainSectionContainerClassName,
        mainSectionClassName,
        infoContainerClassName,
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
            {beforeHeaderContent && beforeHeaderContent}
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
                    descriptionContainerClassName={descriptionContainerClassName}
                    info={info}
                    infoContainerClassName={infoContainerClassName}
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
                    { children }
                </PageContainer>
            )}
        </div>
    );
}

export default Page;
