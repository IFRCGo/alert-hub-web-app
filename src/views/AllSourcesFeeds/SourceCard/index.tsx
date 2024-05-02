import { ArtboardLineIcon } from '@ifrc-go/icons';
import { Heading } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import Link from '#components/Link';
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

    const [firstLanguage] = data.languages;

    return (
        <Link
            className={styles.sourceCard}
            external
            href={data?.url}
        >
            {isDefined(firstLanguage.logo) && (
                <img
                    className={styles.figure}
                    src={firstLanguage.logo}
                    alt={strings.sourceCardAlt}
                />
            )}
            {isNotDefined(firstLanguage.logo) && (
                <ArtboardLineIcon className={styles.altIcon} />
            )}
            <div className={styles.title}>
                <Heading level={5}>
                    {firstLanguage.name}
                </Heading>
                {data?.formatDisplay}
                <div className={styles.language}>
                    {firstLanguage.language}
                </div>
            </div>
        </Link>
    );
}
export default SourceCard;
