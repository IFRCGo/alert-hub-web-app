import {
    Chip,
    Container,
    ListView,
    NumberOutput,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props {
    id: string;
    name: string;
    alertCount: number;
    filterAlertUrgencies: string[];
    filterAlertCertainties: string[];
    filterAlertSeverities: string[];
    filterAlertCategories: string[];
    filterAlertCountry: string;
    filterAlertAdmin1s: string[];
    notifyByEmail: boolean;
    actions: React.ReactNode;
}

function SubscriptionTableItem(props: Props) {
    const {
        id,
        name,
        alertCount,
        filterAlertUrgencies,
        filterAlertCategories,
        filterAlertCertainties,
        filterAlertSeverities,
        filterAlertAdmin1s,
        filterAlertCountry,
        notifyByEmail,
        actions,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Container
            className={styles.subscriptionDetail}
            heading={(
                <>
                    {name}
                    {' '}
                    <NumberOutput
                        prefix="("
                        value={alertCount}
                        suffix=")"
                    />
                </>
            )}
            headingLevel={4}
            headerActions={(
                <>
                    <Link
                        to="subscriptionDetail"
                        urlParams={{
                            subscriptionId: id,
                        }}
                        styleVariant="outline"
                        colorVariant="primary"
                    >
                        {strings.subscriptionItemView}
                    </Link>
                    {actions}
                </>
            )}
            withPadding
            withDarkBackground
        >
            <ListView
                withWrap
                spacing="3xs"
            >
                <Chip
                    name={undefined}
                    variant="tertiary"
                    className={styles.filterItem}
                    label={(
                        <TextOutput
                            label={strings.subscriptionCountry}
                            value={filterAlertCountry}
                            strongLabel
                        />
                    )}
                />
                <Chip
                    name={undefined}
                    variant="tertiary"
                    className={styles.filterItem}
                    label={(
                        <TextOutput
                            label={strings.subscriptionAdmin1}
                            value={filterAlertAdmin1s.join(', ')}
                            strongLabel
                        />
                    )}
                />
                <Chip
                    name={undefined}
                    variant="tertiary"
                    className={styles.filterItem}
                    label={(
                        <TextOutput
                            label={strings.subscriptionUrgency}
                            value={filterAlertUrgencies.join(', ')}
                            strongLabel
                        />
                    )}
                />
                <Chip
                    name={undefined}
                    variant="tertiary"
                    className={styles.filterItem}
                    label={(
                        <TextOutput
                            label={strings.subscriptionCertainty}
                            value={filterAlertCertainties.join(', ')}
                            strongLabel
                        />
                    )}
                />
                <Chip
                    name={undefined}
                    variant="tertiary"
                    className={styles.filterItem}
                    label={(
                        <TextOutput
                            label={strings.subscriptionSeverity}
                            value={filterAlertSeverities.join(', ')}
                            strongLabel
                        />
                    )}
                />
                <Chip
                    name={undefined}
                    variant="tertiary"
                    className={styles.filterItem}
                    label={(
                        <TextOutput
                            label={strings.subscriptionCategory}
                            value={filterAlertCategories.join(', ')}
                            strongLabel
                        />
                    )}
                />
                {notifyByEmail ? (
                    <Chip
                        name={undefined}
                        variant="tertiary"
                        className={styles.filterItem}
                        label={(
                            <TextOutput
                                label={strings.subscriptionEmail}
                                value={strings.subscriptionYes}
                                strongLabel
                            />
                        )}
                    />
                ) : (
                    <Chip
                        name={undefined}
                        variant="tertiary"
                        className={styles.filterItem}
                        label={(
                            <TextOutput
                                label={strings.subscriptionEmail}
                                value={strings.subscriptionNo}
                                strongLabel
                            />
                        )}
                    />
                )}
            </ListView>
        </Container>
    );
}

export default SubscriptionTableItem;
