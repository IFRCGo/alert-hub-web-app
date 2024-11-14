import { Container } from '@ifrc-go/ui';

import styles from './styles.module.css';

interface Props {
    title: string;
}

function Badge(props: Props) {
    const {
        title,
    } = props;

    return (
        <Container className={styles.badge}>
            {title}
        </Container>
    );
}

export default Badge;
