import { createContext } from 'react';

const DomainContext = createContext({
    // eslint-disable-next-line no-console
    register: () => { console.warn('DomainContext::register called before it was initialized'); },
    // eslint-disable-next-line no-console
    invalidate: () => { console.warn('DomainContext::invalidate called before it was initialized'); },
});

export default DomainContext;
