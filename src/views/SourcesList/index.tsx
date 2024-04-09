import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Container,
    List,
    Pager,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { isDefined } from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    SourceFeedsQuery,
    SourceFeedsQueryVariables,
} from '#generated/types/graphql';

import SourceCard from './SourceCard';

import i18n from './i18n.json';
import styles from './style.module.css';

const SOURCE_FEEDS = gql`
query SourceFeeds($pagination: OffsetPaginationInput) {
    public {
      feeds(pagination: $pagination) {
        limit
        offset
        items {
          languages {
            logo
            name
            language
            id
          }
          id
          url
        }
        count
      }
    }
}
`;

type SourceFeed = NonNullable<NonNullable<SourceFeedsQuery['public']>['feeds']>['items'][number];

const MAX_ITEM_PER_PAGE = 21;

const keySelector = (source: SourceFeed) => source.id;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    const [activePage, setActivePage] = useState(1);

    const variables = useMemo(() => ({
        pagination: {
            offset: (activePage - 1) * MAX_ITEM_PER_PAGE,
            limit: MAX_ITEM_PER_PAGE,
        },
    }), [
        activePage,
    ]);

    const {
        data: sourceFeedsResponse,
        loading: sourceFeedsLoading,
        error: sourceFeedsError,
    } = useQuery<SourceFeedsQuery, SourceFeedsQueryVariables>(
        SOURCE_FEEDS,
        {
            variables,
        },
    );

    const rendererParams = useCallback((_: string, value: SourceFeed) => ({
        data: value,
    }), []);

    return (
        <Page>
            <Container
                heading={strings.sourceFeedsTitle}
                withHeaderBorder
                footerActions={(
                    <Pager
                        activePage={activePage}
                        itemsCount={sourceFeedsResponse?.public?.feeds?.count ?? MAX_ITEM_PER_PAGE}
                        maxItemsPerPage={MAX_ITEM_PER_PAGE}
                        onActivePageChange={setActivePage}
                    />
                )}
            >
                <List
                    className={styles.sourcesList}
                    data={sourceFeedsResponse?.public.feeds.items}
                    renderer={SourceCard}
                    rendererParams={rendererParams}
                    keySelector={keySelector}
                    pending={sourceFeedsLoading}
                    filtered={false}
                    errored={isDefined(sourceFeedsError)}
                />
            </Container>
        </Page>
    );
}

Component.displayName = 'SourcesList';
