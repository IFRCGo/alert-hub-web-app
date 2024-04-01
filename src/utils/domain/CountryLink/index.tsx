import { Link } from 'react-router-dom';

export interface Props {
    name: string;
}

function CountryLink(props: Props) {
    const { name } = props;

    // Add TODO: Add country Link
    return (
        <Link
            to="/"
        >
            {name}
        </Link>
    );
}

export default CountryLink;
