export type Menu = {
    icon?: string;
    name: string;
    staticURL?: string;
    url?: string;
    nextLevelItems?: MenuListType;
};

export type MenuListType = Array<Menu>;

export type ProductStateTypes = {
    menu: MenuListType;
    loading: boolean;
};
