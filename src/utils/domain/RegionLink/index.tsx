import { Link } from 'react-router-dom';

export interface Props {
    name: string;
}

function RegionLink(props: Props) {
    const { name } = props;

    // Add TODO: Add region link
    return (
        <Link
            to="/"
        >
            {name}
        </Link>
    );
}

export default RegionLink;
