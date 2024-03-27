import {
    Link,
    LinkProps,
} from 'react-router-dom';
import {
    type Column,
    HeaderCell,
    type HeaderCellProps,
    ReducedListDisplay,
    type ReducedListDisplayProps,
    type SortDirection,
    TableActionsProps,
} from '@ifrc-go/ui';

import type { Props as CountryLinkProps } from './CountryLink';
import type { Props as RegionLinkProps } from './RegionLink';

type Options<D, K, CompProps, HeaderProps> = {
    sortable?: boolean,
    defaultSortDirection?: SortDirection,

    columnClassName?: string;
    headerCellRendererClassName?: string;
    headerContainerClassName?: string;
    cellRendererClassName?: string;
    cellContainerClassName?: string;
    columnWidth?: Column<D, K, CompProps, HeaderProps>['columnWidth'];
    columnStretch?: Column<D, K, CompProps, HeaderProps>['columnStretch'];
    columnStyle?: Column<D, K, CompProps, HeaderProps>['columnStyle'];

    headerInfoTitle?: HeaderCellProps['infoTitle'];
    headerInfoDescription?: HeaderCellProps['infoDescription'];
}

export function createLinkColumn<D, K>(
    id: string,
    title: string,
    accessor: (item: D) => React.ReactNode,
    rendererParams: (item: D) => LinkProps,
    options?: Options<D, K, LinkProps, HeaderCellProps>,
) {
    const item: Column<D, K, LinkProps, HeaderCellProps> & {
        valueSelector: (item: D) => string | undefined | null,
        valueComparator: (foo: D, bar: D) => number,
    } = {
        id,
        title,
        headerCellRenderer: HeaderCell,
        headerCellRendererParams: {
            sortable: options?.sortable,
            infoTitle: options?.headerInfoTitle,
            infoDescription: options?.headerInfoDescription,
        },
        cellRenderer: Link,
        cellRendererParams: (_: K, datum: D): LinkProps => ({
            children: accessor(datum) || '--',
            ...rendererParams(datum),
        }),
        valueSelector: () => '',
        valueComparator: () => 0,
        cellRendererClassName: options?.cellRendererClassName,
        columnClassName: options?.columnClassName,
        headerCellRendererClassName: options?.headerCellRendererClassName,
        cellContainerClassName: options?.cellContainerClassName,
        columnWidth: options?.columnWidth,
        columnStretch: options?.columnStretch,
        columnStyle: options?.columnStyle,
    };

    return item;
}

export function createCountryListColumn<DATUM, KEY>(
    id: string,
    title: string,
    options?: Options<DATUM, KEY, TableActionsProps, HeaderCellProps>,
) {
    const item: Column<
        DATUM,
        KEY,
        ReducedListDisplayProps<CountryLinkProps, []>,
        HeaderCellProps
    > = {
        id,
        title,
        headerCellRenderer: HeaderCell,
        headerCellRendererParams: {
            sortable: false,
        },
        headerContainerClassName: options?.headerContainerClassName,
        cellRenderer: ReducedListDisplay,
        cellRendererClassName: options?.cellRendererClassName,
        columnClassName: options?.columnClassName,
        headerCellRendererClassName: options?.headerCellRendererClassName,
        cellContainerClassName: options?.cellContainerClassName,
        columnWidth: options?.columnWidth,
        columnStretch: options?.columnStretch,
        columnStyle: options?.columnStyle,
        cellRendererParams(): Omit<ReducedListDisplayProps<CountryLinkProps, []>, 'name' | 'className'> {
            throw new Error('Function not implemented.');
        },
    };

    return item;
}

export function createRegionListColumn<DATUM, KEY>(
    id: string,
    title: string,
    options?: Options<DATUM, KEY, TableActionsProps, HeaderCellProps>,
) {
    const item: Column<
        DATUM,
        KEY,
        ReducedListDisplayProps<[], RegionLinkProps>,
        HeaderCellProps
    > = {
        id,
        title,
        headerCellRenderer: HeaderCell,
        headerCellRendererParams: {
            sortable: false,
        },
        headerContainerClassName: options?.headerContainerClassName,
        cellRenderer: ReducedListDisplay,
        cellRendererClassName: options?.cellRendererClassName,
        columnClassName: options?.columnClassName,
        headerCellRendererClassName: options?.headerCellRendererClassName,
        cellContainerClassName: options?.cellContainerClassName,
        columnWidth: options?.columnWidth,
        columnStretch: options?.columnStretch,
        columnStyle: options?.columnStyle,
        cellRendererParams(): Omit<ReducedListDisplayProps<[], RegionLinkProps>, 'name' | 'className'> {
            throw new Error('Function not implemented.');
        },
    };

    return item;
}
