import { Button } from '@ifrc-go/ui';

export interface ListItemProps {
    id: string;
    count: number;
    name: string;
    onListItemClick: (id: string | undefined) => void;
}

function ListItem(props: ListItemProps) {
    const {
        id,
        count,
        name,
        onListItemClick,
    } = props;

    return (
        <Button
            key={id}
            name={id}
            onClick={onListItemClick}
            styleVariant="action"
            after={`(${count})`}
            textSize="sm"
        >
            {name}
        </Button>
    );
}

export default ListItem;
