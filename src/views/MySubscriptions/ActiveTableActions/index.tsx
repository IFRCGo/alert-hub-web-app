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
            label={<MoreOptionsIcon />}
            labelStyleVariant="action"
            withoutDropdownIcon
            persistent
        >
            <DropdownMenuItem
                type="button"
                name="archive"
                onClick={onArchiveClick}
                before={<LayoutBottomLineIcon />}
            >
                {strings.archiveSubscriptionActions}
            </DropdownMenuItem>
            <DropdownMenuItem
                type="button"
                name="edit"
                onClick={onEditClick}
                before={<EditTwoLineIcon />}
            >
                {strings.editSubscriptionActions}
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

export default ActiveTableActions;
