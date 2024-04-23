import { Link } from 'react-router-dom';
import {
    Container,
    Header,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import { SourceFeedsQuery } from '#generated/types/graphql';

import i18n from './i18n.json';
import styles from './styles.module.css';

type SourceFeed = NonNullable<NonNullable<SourceFeedsQuery['public']>['feeds']>['items'][number];

interface Props {
    data: SourceFeed;
}

function SourceCard(props: Props) {
    const {
        data,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Link
            className={styles.sourceCard}
            to={data?.url}
        >
            <Container
                childrenContainerClassName={styles.sourceDetail}
            >
                <img
                    className={styles.figure}
                    src={data?.languages?.map((image) => image.logo)?.[0] || ''}
                    alt={strings.sourceCardAlt}
                />
                <div className={styles.title}>
                    <Header
                        heading={data?.languages?.map((lang) => lang.name)}
                        headingLevel={5}
                    />
                    <div className={styles.language}>
                        {data?.languages?.map((name) => name.language)}
                    </div>
                </div>
            </Container>
        </Link>
    );
}
export default SourceCard;
