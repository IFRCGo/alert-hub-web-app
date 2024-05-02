import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { SearchLineIcon } from '@ifrc-go/icons';
import {
    Container,
    Pager,
    RawList,
    TextInput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import Page from '#components/Page';
import {
    SourceFeedsQuery,
    SourceFeedsQueryVariables,
} from '#generated/types/graphql';
import useDebouncedValue from '#hooks/useDebouncedValue';

import SourceCard from './SourceCard';

import i18n from './i18n.json';
import styles from './styles.module.css';

const SOURCE_FEEDS = gql`
query SourceFeeds(
    $pagination: OffsetPaginationInput,
    $name: String,
    ) {
    public {
        id
      feeds(
        pagination: $pagination,
        filters: {name: $name},
        order: {name: ASC_NULLS_LAST},
    ) {
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
          formatDisplay
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

    const [searchText, setSearchText] = useState<string | undefined>('');
    const debouncedSearchText = useDebouncedValue(searchText);

    const variables = useMemo<SourceFeedsQueryVariables>(() => ({
        pagination: {
            offset: (activePage - 1) * MAX_ITEM_PER_PAGE,
            limit: MAX_ITEM_PER_PAGE,
        },
        name: debouncedSearchText,
    }), [
        activePage,
        debouncedSearchText,
    ]);

    const {
        previousData,
        data: sourceFeedsResponse = previousData,
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
        <Page
            className={styles.sourcesFeeds}
            title={strings.alertHubSourceTitle}
            heading={strings.sourceFeedsTitle}
            mainSectionClassName={styles.searchFeeds}
        >
            <TextInput
                className={styles.search}
                placeholder={strings.searchSourcesPlaceholder}
                onChange={setSearchText}
                value={searchText}
                name="search"
                variant="general"
                icons={<SearchLineIcon />}
            />
            <Container
                footerActions={isDefined(sourceFeedsResponse?.public?.feeds) && (
                    <Pager
                        activePage={activePage}
                        itemsCount={sourceFeedsResponse?.public?.feeds?.count ?? MAX_ITEM_PER_PAGE}
                        maxItemsPerPage={MAX_ITEM_PER_PAGE}
                        onActivePageChange={setActivePage}
                    />
                )}
                contentViewType="grid"
                numPreferredGridContentColumns={3}
                // FIXME: the pending state should not dismount the children or change parent's size
                // pending={sourceFeedsLoading}
                errored={isDefined(sourceFeedsError)}
                errorMessage={sourceFeedsError?.message}
                empty={isNotDefined(sourceFeedsResponse)
                    || sourceFeedsResponse.public.feeds.items.length === 0}
                spacing="comfortable"
            >
                <RawList
                    data={sourceFeedsResponse?.public.feeds.items}
                    renderer={SourceCard}
                    rendererParams={rendererParams}
                    keySelector={keySelector}
                />
            </Container>
        </Page>
    );
}

Component.displayName = 'AllSourcesFeeds';
