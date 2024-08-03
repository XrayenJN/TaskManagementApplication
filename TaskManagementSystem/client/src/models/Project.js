export class Project {
    constructor(name, description, startDate, endDate, contributors){
        this.name = name;
        this.description = description;
        this.contributors = contributors;

        // yyyy-mm-dd
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
            contributors: project.contributors
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Project(data.name, data.description, data.startDate, data.endDate, data.contributors);
    }
}