import {
    useCallback,
    useContext,
    useMemo,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { List } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import {
    CountryAdmin1Query,
    CountryAdmin1QueryVariables,
} from '#generated/types/graphql';
import { stringIdSelector } from '#utils/selectors';
import useAlertFilters from '#views/Home/useAlertFilters';

import AlertDataContext from '../../../AlertDataContext';
import ListItem from '../ListItem';

import i18n from './i18n.json';

type CountryAdmin1 = NonNullable<NonNullable<CountryAdmin1Query['public']>['country']>['admin1s'][number];

const COUNTRY_ADMIN1 = gql`
query CountryAdmin1($countryId: ID!, $alertFilters: AlertFilter) {
    public {
      id
      country(pk: $countryId) {
        id
        name
        admin1s(alertFilters: $alertFilters) {
          id
          name
          ifrcGoId
          filteredAlertCount
        }
      }
    }
  }
`;

interface Props {
    countryId: string;
}

function CountryAdmin1List(props: Props) {
    const { countryId } = props;
    const strings = useTranslation(i18n);
    const { setActiveAdmin1Id } = useContext(AlertDataContext);

    const alertFilters = useAlertFilters();

    const variables = useMemo<CountryAdmin1QueryVariables>(
        () => ({
            countryId,
            alertFilters: {
                DISTINCT: true,
                infos: {
                    severity: alertFilters.infos?.severity,
                    certainty: alertFilters.infos?.certainty,
                    urgency: alertFilters.infos?.urgency,
                },
                sent: alertFilters.sent,
            },
        }),
        [countryId, alertFilters],
    );

    const {
        previousData,
        data: countryAdmin1Response = previousData,
        loading: countryAdmin1Loading,
        error: countryAdmin1Error,
    } = useQuery<CountryAdmin1Query, CountryAdmin1QueryVariables>(
        COUNTRY_ADMIN1,
        {
            skip: isNotDefined(variables),
            variables,
        },
    );

    const admin1RendererParams = useCallback(
        (_: string, value: CountryAdmin1) => ({
            id: value.id,
            count: value.filteredAlertCount ?? 0,
            name: value.name,
            onListItemClick: setActiveAdmin1Id,
        }),
        [setActiveAdmin1Id],
    );

    return (
        <List
            data={countryAdmin1Response?.public?.country?.admin1s}
            keySelector={stringIdSelector}
            renderer={ListItem}
            rendererParams={admin1RendererParams}
            errored={isDefined(countryAdmin1Error)}
            pending={countryAdmin1Loading}
            filtered={false}
            emptyMessage={strings.alertEmptyMessage}
        />
    );
}

export default CountryAdmin1List;
