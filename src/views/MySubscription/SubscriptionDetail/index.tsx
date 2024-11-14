import { useCallback } from 'react';
import {
    Container,
    DateInput,
    List,
    Pager,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Badge from '#components/Badge';
import Page from '#components/Page';
import { AlertFilter } from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import { stringIdSelector } from '#utils/selectors';

import {
    AlertInfo,
    SubscriptionAndAlertDetail,
} from '../common';
import AlertInfoItem from './AlertInfoItem';

import i18n from './i18n.json';
import styles from './styles.module.css';

const PAGE_SIZE = 20;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);

    const subscriptionAndAlertsDetail: SubscriptionAndAlertDetail = {
        id: '1',
        alertFilters: ['Future', 'Severe', 'Nepal', 'Bagmati'],
        alertInfo: [
            {
                id: '1',
                alertId: '101',
                alertTitle: 'Flood Alert',
                alertDescription: 'Severe flooding expected in the coastal region.',
            },
            {
                id: '2',
                alertId: '102',
                alertTitle: 'Heatwave Warning',
                alertDescription: 'Extreme heatwave affecting northern regions.',
            },
            {
                id: '3',
                alertId: '103',
                alertTitle: 'Earthquake Advisory',
                alertDescription: 'Possible aftershocks in the affected areas.',
            },
        ],
    };

    const {
        // limit,
        page,
        setPage,
        // filter,
        // setFilter,
        // offset,
    } = useFilterState<AlertFilter>({
        pageSize: PAGE_SIZE,
        filter: {},
    });

    const subscriptionKeySelector = (filter: string) => filter;

    const subscriptionRendererParams = useCallback((_: string, value: string) => ({
        title: value,
    }), []);

    const rendererParams = useCallback((_: string, value: AlertInfo) => ({
        alertId: value.alertId,
        alertTitle: value.alertTitle,
        alertDescription: value?.alertDescription,
    }), []);

    return (
        <Page
            className={styles.subscriptionDetail}
            title={strings.subscriptionDetailTitle}
            // TODO: Add subscription heading and description
            heading={strings.subscriptionHeading}
        >
            <Container
                childrenContainerClassName={styles.alertFilters}
                withGridViewInFilter
                filters={(
                    <>
                        <DateInput
                            name="startDateFrom"
                            label={strings.filterStartDateFrom}
                            value={undefined}
                            onChange={() => { }}
                        />
                        <DateInput
                            name="startDateTo"
                            label={strings.filterStartDateTo}
                            value={undefined}
                            onChange={() => { }}
                        />
                    </>
                )}
                footerActions={(
                    <Pager
                        activePage={page}
                        itemsCount={50}
                        maxItemsPerPage={PAGE_SIZE}
                        onActivePageChange={setPage}
                    />
                )}
            >
                <List
                    className={styles.badgeContainer}
                    data={subscriptionAndAlertsDetail.alertFilters}
                    keySelector={subscriptionKeySelector}
                    renderer={Badge}
                    rendererParams={subscriptionRendererParams}
                    pending={false}
                    errored={false}
                    filtered={false}
                />
                <List
                    className={styles.alertItem}
                    data={subscriptionAndAlertsDetail.alertInfo}
                    renderer={AlertInfoItem}
                    rendererParams={rendererParams}
                    keySelector={stringIdSelector}
                    pending={false}
                    errored={false}
                    filtered={false}
                />
            </Container>
        </Page>
    );
}

Component.displayName = 'SubscriptionDetail';
