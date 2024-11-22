import {
    DeleteBinSixLineIcon,
    LayoutBottomLineIcon,
    MoreOptionsIcon,
} from '@ifrc-go/icons';
import { DropdownMenu } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import DropdownMenuItem from '#components/DropdownMenuItem';

import i18n from './i18n.json';

interface Props {
    onSubscriptionRemove?: () => void;
    onUnArchive?: () => void;
}

function ArchiveTableActions(props: Props) {
    const {
        onSubscriptionRemove,
        onUnArchive,
    } = props;

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
                onClick={onUnArchive}
                icons={<LayoutBottomLineIcon />}
            >
                {strings.unarchiveSubscriptionActions}
            </DropdownMenuItem>
            <DropdownMenuItem
                type="button"
                name="delete"
                onClick={onSubscriptionRemove}
                icons={<DeleteBinSixLineIcon />}
            >
                {strings.deleteSubscriptionActions}
            </DropdownMenuItem>
        </DropdownMenu>
    );
}

export default ArchiveTableActions;
