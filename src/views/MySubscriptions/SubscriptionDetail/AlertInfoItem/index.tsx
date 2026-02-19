import { Container } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';

import i18n from './i18n.json';
import styles from './styles.module.css';

interface Props {
    alertId: string;
    alertTitle: string | undefined;
    alertDescription?: string;
}

function AlertInfoItem(props: Props) {
    const strings = useTranslation(i18n);

    const {
        alertId,
        alertTitle,
        alertDescription,
    } = props;

    return (
        <Container
            // eslint-disable-next-line react/no-children-prop
            children={undefined}
            className={styles.alertDetail}
            heading={alertTitle}
            headingLevel={4}
            withDarkBackground
            withPadding
            headerActions={(
                <Link
                    to="alertDetails"
                    urlParams={{ alertId }}
                    styleVariant="outline"
                    colorVariant="primary"
                    textSize="sm"
                    spacing="sm"
                >
                    {strings.alertInfoView}
                </Link>
            )}
            footer={alertDescription}
        />
    );
}

export default AlertInfoItem;
