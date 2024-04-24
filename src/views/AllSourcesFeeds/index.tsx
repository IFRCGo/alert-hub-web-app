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
    Pager,
    RawList,
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

import SourceCard from './SourceCard';

import i18n from './i18n.json';

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
        { variables },
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
                footerActions={(
                    <Pager
                        activePage={activePage}
                        itemsCount={sourceFeedsResponse?.public?.feeds?.count ?? MAX_ITEM_PER_PAGE}
                        maxItemsPerPage={MAX_ITEM_PER_PAGE}
                        onActivePageChange={setActivePage}
                    />
                )}
                contentViewType="grid"
                numPreferredGridContentColumns={3}
                pending={sourceFeedsLoading}
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
