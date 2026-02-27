import {
    useCallback,
    useMemo,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { SearchLineIcon } from '@ifrc-go/icons';
import {
    Container,
    ListView,
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
import useFilterState from '#hooks/useFilterState';

import SourceCard from './SourceCard';

import i18n from './i18n.json';

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

    const {
        filter,
        rawFilter,
        setFilterField,
        limit,
        offset,
        page,
        setPage,
    } = useFilterState<{ name?: string }>({
        pageSize: MAX_ITEM_PER_PAGE,
        filter: {},
    });

    const variables = useMemo<SourceFeedsQueryVariables>(() => ({
        pagination: {
            offset,
            limit,
        },
        name: filter.name,
    }), [
        filter,
        limit,
        offset,
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
            title={strings.alertHubSourceTitle}
            heading={strings.sourceFeedsTitle}
        >
            <Container
                filters={(
                    <TextInput
                        placeholder={strings.searchSourcesPlaceholder}
                        onChange={setFilterField}
                        value={rawFilter.name}
                        name="name"
                        variant="general"
                        icons={<SearchLineIcon />}
                    />
                )}
                footerActions={isDefined(sourceFeedsResponse?.public?.feeds) && (
                    <Pager
                        activePage={page}
                        itemsCount={sourceFeedsResponse?.public?.feeds?.count ?? MAX_ITEM_PER_PAGE}
                        maxItemsPerPage={MAX_ITEM_PER_PAGE}
                        onActivePageChange={setPage}
                    />
                )}
                // FIXME: the pending state should not dismount the children or change parent's size
                // pending={sourceFeedsLoading}
                errored={isDefined(sourceFeedsError)}
                errorMessage={sourceFeedsError?.message}
                empty={isNotDefined(sourceFeedsResponse)
                    || sourceFeedsResponse.public.feeds.items.length === 0}
                spacing="md"
                emptyMessage={strings.alertEmptyMessage}
            >
                <ListView
                    layout="grid"
                    numPreferredGridColumns={3}
                >
                    <RawList
                        data={sourceFeedsResponse?.public.feeds.items}
                        renderer={SourceCard}
                        rendererParams={rendererParams}
                        keySelector={keySelector}
                    />
                </ListView>
            </Container>
        </Page>
    );
}

Component.displayName = 'AllSourcesFeeds';
