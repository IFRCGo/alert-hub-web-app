import { MoreOptionsIcon } from '@ifrc-go/icons';
import { DropdownMenu } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import DropdownMenuItem from '#components/DropdownMenuItem';

import i18n from './i18n.json';

function ArchiveTableActions() {
    const strings = useTranslation(i18n);

    return (
        <DropdownMenu
            icons={<MoreOptionsIcon />}
            variant="tertiary"
            withoutDropdownIcon
        >
            <DropdownMenuItem
                type="button"
                name="unArchive"
            >
                {strings.unarchiveSubscriptionActions}
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

export default ArchiveTableActions;
