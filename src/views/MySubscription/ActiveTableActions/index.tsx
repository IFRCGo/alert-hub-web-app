import { MoreOptionsIcon } from '@ifrc-go/icons';
import { DropdownMenu } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import DropdownMenuItem from '#components/DropdownMenuItem';

import i18n from './i18n.json';

function ActiveTableActions() {
    const strings = useTranslation(i18n);

    return (
        <DropdownMenu
            icons={<MoreOptionsIcon />}
            variant="tertiary"
            withoutDropdownIcon
        >
            <DropdownMenuItem
                type="button"
                name="archive"
                onClick={undefined}
            >
                {strings.archiveSubscriptionActions}
            </DropdownMenuItem>
            <DropdownMenuItem
                type="button"
                name="edit"
            >
                {strings.editSubscriptionActions}
            </DropdownMenuItem>
            <DropdownMenuItem
                type="button"
                name="delete"
                onClick={undefined}
            >
                {strings.deleteSubscriptionActions}
            </DropdownMenuItem>
        </DropdownMenu>
    );
}

export default ActiveTableActions;
