import { Link } from 'react-router-dom';
import { Container } from '@ifrc-go/ui';

import { CountryAlertsListQuery } from '#generated/types';

type CountryAlertType = NonNullable<NonNullable<CountryAlertsListQuery['public']['alerts']['items'][number]>>;

export interface AlertProps {
    data: CountryAlertType;
    onExpandClick: (alertId: string | undefined) => void;
}

function AlertDetail(props: AlertProps) {
    const {
        data,
        onExpandClick,
    } = props;

    return (
        <Container>
            {data?.infos?.map((alert) => (
                <Link
                    to="www.ifrc.com"
                >
                    <div>
                        {alert?.event}
                    </div>
                    <div>
                        {alert?.category}
                    </div>
                </Link>
            ))}
        </Container>
    )
}

export default AlertDetail;
