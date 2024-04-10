import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { isDefined } from '@togglecorp/fujs';
import { gql, useQuery } from '@apollo/client';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    Button,
    Container,
    Pager,
    TextOutput,
} from '@ifrc-go/ui';

import {
    CountryAlertsListQuery,
    CountryAlertsListQueryVariables,
} from '#generated/types';

import i18n from './i18n.json';
import styles from './styles.module.css';
import { ChevronLeftLineIcon } from '@ifrc-go/icons';

const COUNTRY_ALERTS_LIST = gql`
  query CountryAlertsList(
    $country: ID!,
    $pagination: OffsetPaginationInput
    ) {
    public {
      alerts(
        filters: {
         country: {
            pk: $country
            }
        }
        pagination: $pagination
        ) {
        items {
          id
          info {
            event
            category
            alertId
          }
        }
      }
    }
  }
`;

const defaultMaxItemsPerPage = 10;

type CountryAlertType = NonNullable<NonNullable<CountryAlertsListQuery['public']['alerts']['items'][number]>>;

const countryAlertKeySelector = (alert: CountryAlertType) => alert.id;

export interface Props {
    countryId: string;
    handleAlertClick: (countryId: string | undefined) => void;
    activeAlertId: string | undefined;
}

function AlertDetail(props: Props) {
    const {
        countryId,
        handleAlertClick,
        activeAlertId,
    } = props;

    const strings = useTranslation(i18n);

    const [activePage, setActivePage] = useState(1);

    const variables = useMemo(() => ({
        country: countryId,
        pagination: {
            offset: (activePage - 1) * defaultMaxItemsPerPage,
            limit: defaultMaxItemsPerPage,
        },
    }), [activePage]);

    const {
        data: countryAlertsResponse,
        loading: countryAlertsLoading,
    } = useQuery<CountryAlertsListQuery, CountryAlertsListQueryVariables>(
        COUNTRY_ALERTS_LIST, {
        variables,
    });

    // const setActiveCountryIdSafe = useCallback(
    //     (countryId: string | undefined) => {
    //         setActiveCountryId(countryId);
    //         onActiveCountryChange(countryId);
    //     },
    //     [onActiveCountryChange, setActiveCountryId],
    // );

    // const alertListRendererParams = useCallback(
    //     (_: string | number, alert: CountryAlertType): Props => ({
    //         countryId: activeCountryId,
    //         onActiveCountryChange: setActiveCountryIdSafe,
    //     }),
    //     [activeCountryId, setActiveCountryIdSafe],
    // );

    console.log('alert', activeAlertId);

    return (
        <Container
            className={styles.alerts}
            childrenContainerClassName={styles.content}
            headingLevel={4}
            spacing="compact"
            heading={strings.alertViewDetails}
            footerActions={(
                <Pager
                    activePage={activePage}
                    // FIXME: Add items count
                    itemsCount={100}
                    maxItemsPerPage={defaultMaxItemsPerPage}
                    onActivePageChange={setActivePage}
                />
            )}
            contentViewType="vertical"
        // actions={isDefined(countryId) && (
        //     <Button
        //         name={undefined}
        //         onClick={setActiveCountryIdSafe}
        //         variant="tertiary"
        //         icons={(
        //             <ChevronLeftLineIcon className={styles.icon} />
        //         )}
        //     >
        //         Back
        //     </Button>
        // )}
        >
            {/* <Link
                            to={''}
                            className={styles.alertButtons}
                        >
                            {alert.event}
                            {alert.category}
                        </Link> */}
            {countryAlertsResponse?.public?.alerts?.items?.map((alerts) => (
                <div className={styles.alerts}>
                    <Button
                        name={alerts.id}
                        onClick={handleAlertClick}
                        variant="tertiary"
                    >
                        {alerts?.info?.event} - {alerts?.info?.category}
                    </Button>
                </div>
            ))}
            {/* {countryAlertsLoading && <BlockLoading />}
            {isDefined(countryAlertsResponse) && (
                <List
                    className={styles.countryList}
                    filtered={false}
                    pending={countryAlertsLoading}
                    errored={false}
                    data={countryAlertsResponse?.public?.alerts.items}
                    keySelector={countryAlertKeySelector}
                    renderer={AlertDetail}
                    rendererParams={alertListRendererParams}
                    emptyMessage="No data found"
                />
            )} */}
        </Container>
    );
}

export default AlertDetail;
