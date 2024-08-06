export const projectListSortedByEndDate = (projects) => projects.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

export const projectListSortedByStartDate = (projects) => projects.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

export const projectListSortedByName = (projects) => projects.sort((a, b) => a.name > b.name);