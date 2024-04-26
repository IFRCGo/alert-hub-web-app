import { Link } from 'react-router-dom';
import { useTranslation } from '@ifrc-go/ui/hooks';

import wrappedRoutes from '../../App/routes';

import i18n from './i18n.json';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const strings = useTranslation(i18n);
    return (
        <>
            <h1>
                {strings.preferencesTitle}
            </h1>
            <Link to={wrappedRoutes.root.absolutePath}>
                {strings.preferencesGoToHome}
            </Link>
        </>
    );
}

Component.displayName = 'Preferences';
