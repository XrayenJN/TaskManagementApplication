export class Project {
    constructor(name, description, startDate, endDate, contributors){
        this.name = name;
        this.description = description;

        // yyyy-mm-dd
        this.startDate = startDate;
        this.endDate = endDate;

        //contributors
        this.contributors = contributors;
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