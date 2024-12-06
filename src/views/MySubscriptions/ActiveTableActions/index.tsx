import { useCallback } from 'react';
import {
    DeleteBinSixLineIcon,
    EditTwoLineIcon,
    LayoutBottomLineIcon,
    MoreOptionsIcon,
} from '@ifrc-go/icons';
import { DropdownMenu } from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';

import DropdownMenuItem from '#components/DropdownMenuItem';

import i18n from './i18n.json';

interface Props {
    onSubscriptionRemove: () => void;
    onArchiveClick?: () => void;
    onEditClick: () => void;
}

function ActiveTableActions(props: Props) {
    const {
        onSubscriptionRemove,
        onArchiveClick,
        onEditClick,
    } = props;

    const strings = useTranslation(i18n);

    const handleDelete = useCallback(() => {
        onSubscriptionRemove();
    }, [onSubscriptionRemove]);

    return (
        <DropdownMenu
            icons={<MoreOptionsIcon />}
            variant="tertiary"
            withoutDropdownIcon
            persistent
        >
            <DropdownMenuItem
                type="button"
                name="archive"
                onClick={onArchiveClick}
                icons={<LayoutBottomLineIcon />}
            >
                {strings.archiveSubscriptionActions}
            </DropdownMenuItem>
            <DropdownMenuItem
                type="button"
                name="edit"
                onClick={onEditClick}
                icons={<EditTwoLineIcon />}
            >
                {strings.editSubscriptionActions}
            </DropdownMenuItem>
            <DropdownMenuItem
                type="confirm-button"
                name="delete"
                onConfirm={handleDelete}
                confirmMessage={strings.confirmationMessage}
                icons={<DeleteBinSixLineIcon />}
                persist
            >
                {strings.deleteSubscriptionActions}
            </DropdownMenuItem>
        </DropdownMenu>
    );
}

export default ActiveTableActions;
