export class User {
    constructor(name, email, projects){
        this.name = name;
        this.email = email;
        this.projects = projects;
    }
}

export const userConverter = {
    toFirestore: (user) => {
        return {
            name: user.name,
            email: user.email,
            projects: user.projects
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.name, data.email, data.projects);
    }
}
