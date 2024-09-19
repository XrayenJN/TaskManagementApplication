export const sortTaskByAToZ = (tasksDict) => {
    const taskArrays = Object.entries(tasksDict);
    taskArrays.sort(([, a], [, b]) => a.name > b.name);
    return Object.fromEntries(taskArrays);
}

export const sortTaskByZToA = (tasksDict) => {
    const taskArrays = Object.entries(tasksDict);
    taskArrays.sort(([, a], [, b]) => a.name < b.name);
    return Object.fromEntries(taskArrays);
}

export const sortTaskByDueDate = (tasksDict) => {
    const taskArrays = Object.entries(tasksDict);
    taskArrays.sort(([, a], [, b]) => new Date(a.endDate) - new Date(b.endDate));
    return Object.fromEntries(taskArrays);
}

export const filterTaskByActiveStatus = (tasksDict) => {
    const taskArrays = Object.entries(tasksDict);
    taskArrays.filter(([, a]) => new Date(a.endDate) < new Date());
    return Object.fromEntries(taskArrays);
}

export const filterTaskByExpiredStatus = (tasksDict) => {
    const taskArrays = Object.entries(tasksDict);
    taskArrays.filter(([, a]) => new Date(a.endDate) > new Date());
    return Object.fromEntries(taskArrays);
}

export const filterTaskByOwner = (taskDict, ownerDict) => {
    const taskArrays = Object.entries(taskDict);
    const ownerArrays = Object.entries(ownerDict);
    
    // Create a set of valid owners from ownerDict for quick lookup
    const validOwners = new Set(ownerArrays.map(([, owner]) => owner));
    // Filter tasks based on whether their owner is in the validOwners set
    const filteredTaskArrays = taskArrays.filter(([, task]) => validOwners.has(task.owner));

    // Sort tasks so that the owner appears first, respecting the order of owners in ownerDict
    filteredTaskArrays.sort(([, a], [, b]) => {
        const ownerA = a.owner;
        const ownerB = b.owner;
        const indexA = ownerArrays.findIndex(([, owner]) => owner === ownerA);
        const indexB = ownerArrays.findIndex(([, owner]) => owner === ownerB);
        return indexA - indexB;
    });

    return Object.fromEntries(filteredTaskArrays);
}