import {
    isNotDefined,
    isTruthyString,
} from '@togglecorp/fujs';

interface User {
    firstName: string | undefined | null;
    lastName: string | undefined | null;
    displayName: string;
}

// eslint-disable-next-line import/prefer-default-export
export function getUserName(user: User | undefined) {
    if (isNotDefined(user)) {
        return 'Unknown user';
    }

    const name = [user.firstName, user.lastName].filter(isTruthyString).join(' ');
    if (isTruthyString(name)) {
        return name;
    }

    // NOTE: Username can also be email
    // so stripping out the domain part
    const index = user.displayName.indexOf('@');
    if (index === -1) {
        return user.displayName;
    }

    return user.displayName.substring(0, index);
}
