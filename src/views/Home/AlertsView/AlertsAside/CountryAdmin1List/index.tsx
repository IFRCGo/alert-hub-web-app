import {
    useCallback,
    useContext,
    useMemo,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Container,
    RawList,
} from '@ifrc-go/ui';
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

import AlertContext from '../../../AlertContext';
import Admin1ListItem from '../Admin1ListItem';

type CountryAdmin1 = NonNullable<NonNullable<CountryAdmin1Query['public']>['country']>['admin1s'][number];

const COUNTRY_ADMIN1 = gql`
query CountryAdmin1($countryId: ID!, $alertFilters: AlertFilter) {
    public {
      id
      country(pk: $countryId) {
        id
        name
        alertCount
        ifrcGoId
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
    const { setActiveAdmin1Id } = useContext(AlertContext);
    const alertFilters = useAlertFilters();

    const variables = useMemo<CountryAdmin1QueryVariables>(
        () => ({
            countryId,
            alertFilters,
        }),
        [countryId, alertFilters],
    );

    const {
        data: countryAdmin1Response,
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
            data: value,
            onAdmin1Click: setActiveAdmin1Id,
        }),
        [setActiveAdmin1Id],
    );

    return (
        <Container
            errored={isDefined(countryAdmin1Error)}
            pending={countryAdmin1Loading}
            filtered={false}
            contentViewType="vertical"
            empty={countryAdmin1Response?.public?.country?.admin1s?.length === 0}
        >
            <RawList
                data={countryAdmin1Response?.public?.country?.admin1s}
                keySelector={stringIdSelector}
                renderer={Admin1ListItem}
                rendererParams={admin1RendererParams}
            />
        </Container>
    );
}

export default CountryAdmin1List;
