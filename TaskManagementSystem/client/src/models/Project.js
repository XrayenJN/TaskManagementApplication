export class Project {
    constructor(name, description, startDate, endDate){
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export const projectConverter = {
    toFirestore: (project) => {
        return {
            name: project.name,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Project(data.name, data.description, data.startDate, data.endDate);
    }
}