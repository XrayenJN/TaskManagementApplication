export const sortTaskByAToZ = (taskArrays) => {
    return taskArrays.sort((a, b) => a.name.localeCompare(b.name));
}

export const sortTaskByZToA = (taskArrays) => {
    return taskArrays.sort((a, b) => b.name.localeCompare(a.name));
}

export const sortTaskByDueDate = (taskArrays) => {
    return taskArrays.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
}

export const filterTaskByActiveStatus = (taskArrays) => {
    const currentDate = new Date();
    return taskArrays.filter(task => new Date(task.endDate) >= currentDate);
}

export const filterTaskByExpiredStatus = (taskArrays) => {
    const currentDate = new Date();
    return taskArrays.filter(task => new Date(task.endDate) < currentDate);
}

export const filterTaskByOwner = (taskArrays, owner) => {
    return taskArrays.filter(task => task.owners && task.owners.includes(owner));
}