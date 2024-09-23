export class ProjectTask {
    constructor(name, description, startDate, endDate, comments, links, isMeeting, status, owners, time){
        this.name = name;
        this.description = description;
        this.comments = comments;
        this.links = links;
        this.isMeeting = isMeeting;
        this.status = status;
        this.owners = owners;


        // yyyy-mm-dd
        this.startDate = startDate;
        this.endDate = endDate;
        this.meetingTime = this.meetingTime;
    }
}

export const projectTaskConverter = {
    toFirestore: (projectTask) => {
        return {
            name: projectTask.name,
            description: projectTask.description,
            comments: projectTask.comments,
            links: projectTask.links,
            isMeeting: projectTask.isMeeting,
            status: projectTask.status,
            owners: projectTask.owners,
            startDate: projectTask.startDate,
            endDate: projectTask.endDate,
            startMeetingTime: projectTask.meetingTime
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new ProjectTask(data.name, data.description, data.startDate, data.endDate, data.comments, data.links, data.isMeeting, data.status, data.owners);
    }
}