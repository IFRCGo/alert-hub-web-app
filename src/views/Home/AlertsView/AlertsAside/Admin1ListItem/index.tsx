import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { Admin1ListQuery } from '#generated/types/graphql';

import i18n from './i18n.json';
import styles from './styles.module.css';

type Admin1Type = NonNullable<NonNullable<Admin1ListQuery['public']>['admin1s']>['items'][number];

export interface RegionProps {
    admin1WithAlert?: Admin1Type;
}

function Admin1ListItem(props: RegionProps) {
    const {
        admin1WithAlert,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Container
            className={styles.alerts}
            childrenContainerClassName={styles.content}
            headingLevel={4}
            spacing="compact"
            heading={strings.regionList}
        >
            {admin1WithAlert?.name}
            {`(${admin1WithAlert?.alertCount})`}
        </Container>
    );
}

export default Admin1ListItem;
