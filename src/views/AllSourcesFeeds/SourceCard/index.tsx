import { ArtboardLineIcon } from '@ifrc-go/icons';
import {
    Description,
    Heading,
    Label,
    ListView,
} from '@ifrc-go/ui';
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
            <ListView withPadding>
                {isDefined(firstLanguage?.logo) && (
                    <img
                        className={styles.figure}
                        src={firstLanguage.logo}
                        alt={strings.sourceCardAlt}
                    />
                )}
                {isNotDefined(firstLanguage?.logo) && (
                    <ArtboardLineIcon className={styles.altIcon} />
                )}
                <ListView
                    layout="block"
                    spacing="xs"
                >
                    <Heading level={5}>
                        {firstLanguage?.name}
                    </Heading>
                    <Label
                        textSize="sm"
                        strong
                    >
                        {data?.formatDisplay}
                    </Label>
                    <Description
                        textSize="sm"
                        withLightText
                    >
                        {firstLanguage?.language}
                    </Description>
                </ListView>
            </ListView>
        </Link>
    );
}
export default SourceCard;
