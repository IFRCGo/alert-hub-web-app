import { Link } from 'react-router-dom';

export interface Props {
    name: string;
}

function CountryLink(props: Props) {
    const { name } = props;

    return (
        <Link
            to="/"
        >
            {name}
        </Link>
    );
}

export default CountryLink;
