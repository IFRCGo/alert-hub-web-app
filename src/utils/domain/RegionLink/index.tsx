import { Link } from 'react-router-dom';

export interface Props {
    name: string;
}

function RegionLink(props: Props) {
    const { name } = props;

    return (
        <Link
            to="/"
        >
            {name}
        </Link>
    );
}

export default RegionLink;
