import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

function PageError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = useRouteError() as unknown as any;

    useEffect(
        () => {
            // eslint-disable-next-line no-console
            console.error(error);
        },
        [error],
    );

    return (
        <h1>
            {error.statusText || error.message}
        </h1>
    );
}

export default PageError;
