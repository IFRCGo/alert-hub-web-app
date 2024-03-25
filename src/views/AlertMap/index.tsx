import { useTranslation } from '@ifrc-go/ui/hooks';
import { _cs } from '@togglecorp/fujs';

import Container from '#ui/Container';

import i18n from './i18n.json';
import styles from './styles.module.css';

type Props = {
    className?: string;
}

function OngoingAlertMap(props: Props) {
    const {
        className,
    } = props;

    const strings = useTranslation(i18n);

    return (
        <Container
            className={_cs(styles.alertMap, className)}
            withHeaderBorder
            heading={strings.mapHeading}
        >
            Map
        </Container>
    );
}

export default OngoingAlertMap;
