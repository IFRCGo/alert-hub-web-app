import { useCallback } from 'react';
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
    onSubscriptionRemove: () => void;
    onUnArchive?: () => void;
}

function ArchiveTableActions(props: Props) {
    const {
        onSubscriptionRemove,
        onUnArchive,
    } = props;

    const strings = useTranslation(i18n);

    const handleDelete = useCallback(() => {
        onSubscriptionRemove();
    }, [onSubscriptionRemove]);

    return (
        <DropdownMenu
            label={<MoreOptionsIcon />}
            labelStyleVariant="action"
            withoutDropdownIcon
            persistent
        >
            <DropdownMenuItem
                type="button"
                name="unArchive"
                onClick={onUnArchive}
                before={<LayoutBottomLineIcon />}
            >
                {strings.unarchiveSubscriptionActions}
            </DropdownMenuItem>
            <DropdownMenuItem
                type="confirm-button"
                name="delete"
                onConfirm={handleDelete}
                confirmMessage={strings.confirmationMessage}
                before={<DeleteBinSixLineIcon />}
                persist
            >
                {strings.deleteSubscriptionActions}
            </DropdownMenuItem>
        </DropdownMenu>
    );
}

export default ArchiveTableActions;
