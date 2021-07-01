export interface TableColumn {
    name: string; // (Optional) Column name that will be visible
    dataKey: string; // (Optional) name of key of the actual data in this column
    position?: 'right' | 'left'; // (Optional) should it be right-aligned or left-aligned?
    isSortable?: boolean; // (Optional) can a column be sorted?
    showBooleanIcon?: boolean; // (Optional) Is boolean, and must be shown with icon?
    showBooleanCustomIcon?: string; // (Optional) When Boolean is true, icon name to show (from material icons)
    showBooleanCustomIconFalse?: string; // (Optional) When Boolean is false, icon name to show (from material icons)
    isDate?: boolean; // (Optional) Is date?
}
