export const projectListSortedByEndDate = (projectsDict) => {
  // Convert the dictionary to an array of [projectid, project] pairs
  const projectsArray = Object.entries(projectsDict);

  // Sort the array by the endDate of the project
  projectsArray.sort(([, a], [, b]) => new Date(a.endDate) - new Date(b.endDate));

  // Optionally convert the sorted array back to a dictionary
  const sortedProjectsDict = Object.fromEntries(projectsArray);

  return sortedProjectsDict;
};

export const projectListSortedByStartDate = (projectsDict) => {
  // Convert the dictionary to an array of [projectid, project] pairs
  const projectsArray = Object.entries(projectsDict);

  // Sort the array by the endDate of the project
  projectsArray.sort(([, a], [, b]) => new Date(a.startDate) - new Date(b.startDate));

  // Optionally convert the sorted array back to a dictionary
  const sortedProjectsDict = Object.fromEntries(projectsArray);

  return sortedProjectsDict;
};

const projectListSortedByName = (projectsDict) => {
  // Convert the dictionary to an array of [projectid, project] pairs
  const projectsArray = Object.entries(projectsDict);

  // Sort the array by the name of the project
  projectsArray.sort(([, a], [, b]) => a.name > b.name);

  // Optionally convert the sorted array back to a dictionary
  const sortedProjectsDict = Object.fromEntries(projectsArray);

  return sortedProjectsDict;
};

export const reverseDictionary = (dict) => {
  // Convert the dictionary to an array of [key, value] pairs
  const entriesArray = Object.entries(dict);

  // Reverse the array
  const reversedArray = entriesArray.reverse();

  // Convert the reversed array back to a dictionary
  const reversedDict = Object.fromEntries(reversedArray);

  return reversedDict;
};