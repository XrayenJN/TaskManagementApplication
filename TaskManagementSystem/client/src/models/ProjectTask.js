export class ProjectTask {
    constructor(name, description, startDate, endDate, comments, links, isMilestone, status, owners){
        this.name = name;
        this.description = description;
        this.comments = comments;
        this.links = links;
        this.isMilestone = isMilestone;
        this.status = status;
        this.owners = owners;

        // yyyy-mm-dd
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export const projectTaskConverter = {
    toFirestore: (projectTask) => {
        return {
            name: projectTask.name,
            description: projectTask.description,
            comments: projectTask.comments,
            links: projectTask.links,
            isMilestone: projectTask.isMilestone,
            status: projectTask.status,
            owners: projectTask.owners,
            startDate: projectTask.startDate,
            endDate: projectTask.endDate,
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new ProjectTask(data.name, data.description, data.startDate, data.endDate, data.comments, data.links, data.isMilestone, data.status, data.owners);
    }
}