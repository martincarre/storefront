export interface NavItem {
    tooltip: string;
    icon: string;
    route: string;
    subItems?: NavItem[];
}