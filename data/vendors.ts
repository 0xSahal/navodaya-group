/** Category tree for vendor registration (form + page legend). */
export const vendorCategories = [
  {
    group: 'Sub Contractor',
    options: [
      { value: 'sub-contractor-civil', label: 'Civil' },
      { value: 'sub-contractor-interiors', label: 'Interiors' },
    ],
  },
  {
    group: 'Raw Material',
    options: [{ value: 'raw-material', label: 'Raw Material' }],
  },
  {
    group: 'Others',
    options: [{ value: 'others', label: 'Others' }],
  },
] as const
