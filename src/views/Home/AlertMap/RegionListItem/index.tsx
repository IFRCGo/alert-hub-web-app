import { useMemo } from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    BlockLoading,
    Container,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import {
    Admin1ListQuery,
    Admin1ListQueryVariables,
} from '#generated/types';

import i18n from './i18n.json';
import styles from './styles.module.css';

const ADMIN1_LIST = gql`
query Admin1List {
    public {
      admin1s {
        items {
          countryId
          name
        }
      }
    }
  }
`;

export interface RegionProps {
    countryId: string | undefined;
}

function RegionListItem(props: RegionProps) {
    const {
        countryId,
    } = props;

    const strings = useTranslation(i18n);

    const {
        data: admin1ListResponse,
        loading: admin1ListLoading,
    } = useQuery<Admin1ListQuery, Admin1ListQueryVariables>(
        ADMIN1_LIST,
    );

    const filteredAdmins = useMemo(() => {
        if (!countryId || !admin1ListResponse?.public?.admin1s?.items) return [];

        return admin1ListResponse.public.admin1s.items
            .filter((item) => countryId.includes(item.countryId))
            .map((item) => item.name);
    }, [countryId, admin1ListResponse]);

    return (
        <Container
            className={styles.alerts}
            childrenContainerClassName={styles.content}
            headingLevel={4}
            spacing="compact"
            heading={strings.regionList}
        >
            {admin1ListLoading && <BlockLoading />}
            <div className={styles.alertDetails}>
                {filteredAdmins.map((name) => (
                    <div key={name}>
                        {name}
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default RegionListItem;
