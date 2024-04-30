import { useCallback } from 'react';
import { generatePath } from 'react-router-dom';
import { CopyLineIcon } from '@ifrc-go/icons';
import { Button } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';
import { AlertInformationsQuery } from '#generated/types/graphql';
import routes from '#routes';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AlertType = NonNullable<NonNullable<NonNullable<AlertInformationsQuery['public']>['alerts']>['items']>[number];

export interface Props {
    alert: AlertType;
}
function AlertActions(props: Props) {
    const { alert } = props;
    const strings = useTranslation(i18n);

    const url = generatePath(
        routes.alertDetails.absolutePath,
        { alertId: alert.id },
    );

    const handleClick = useCallback(() => {
        navigator.clipboard.writeText(`${window.location.origin}${url}`);
    }, [url]);

    return (
        <div className={styles.alertActions}>
            <Link
                className={styles.viewDetailsCopyLink}
                to="alertDetails"
                urlParams={{ alertId: alert.id }}
                target="_blank"
            >
                {strings.alertTableViewDetailsTitle}
            </Link>
            <Button
                name={undefined}
                onClick={handleClick}
                variant="tertiary"
            >
                <CopyLineIcon />
            </Button>
        </div>
    );
}

export default AlertActions;
