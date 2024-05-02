import { useCallback } from 'react';
import { generatePath } from 'react-router-dom';
import { CopyLineIcon } from '@ifrc-go/icons';
import { Button } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import Link from '#components/Link';
import { AlertInformationsQuery } from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import routes from '#routes';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AlertType = NonNullable<NonNullable<NonNullable<AlertInformationsQuery['public']>['alerts']>['items']>[number];

export interface Props {
    data: AlertType;
}
function AlertActions(props: Props) {
    const { data } = props;
    const strings = useTranslation(i18n);
    const alert = useAlert();

    const url = generatePath(
        routes.alertDetails.absolutePath,
        { alertId: data.id },
    );

    const handleClick = useCallback(() => {
        navigator.clipboard.writeText(`${window.location.origin}${url}`);
        alert.show('Link copied to clipboard');
    }, [url, alert]);

    return (
        <div className={styles.alertActions}>
            <Link
                className={styles.viewDetailsCopyLink}
                to="alertDetails"
                urlParams={{ alertId: data.id }}
            >
                {strings.alertTableViewDetailsTitle}
            </Link>
            <Button
                name={undefined}
                onClick={handleClick}
                variant="tertiary"
                title="Copy alert URL"
            >
                <CopyLineIcon />
            </Button>
        </div>
    );
}

export default AlertActions;
