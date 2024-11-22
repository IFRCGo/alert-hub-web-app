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
            className={styles.alertDetail}
            heading={alertTitle}
            headingLevel={4}
            actions={(
                <Link
                    to="alertDetails"
                    urlParams={{ alertId }}
                    variant="secondary"
                >
                    {strings.alertInfoView}
                </Link>
            )}
            footerContent={alertDescription}
        />
    );
}

export default AlertInfoItem;
