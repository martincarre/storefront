export interface NavItem {
    tooltip: string;
    icon: string;
    coloredIcon?: boolean;
    route?: string;
    subItems?: NavItem[];
    signedInDisplay?: boolean;
    onClickAction?: Function | null;
}