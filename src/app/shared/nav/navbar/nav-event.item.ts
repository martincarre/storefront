import { NavItem } from "./nav-item/nav-item.model";

export interface NavEvent {
    type: string;
    label: string;
    route?: string;   
    subItems?: NavItem[];
}