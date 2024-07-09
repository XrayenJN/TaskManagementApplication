export class User {
    constructor(name, email){
        this.name = name;
        this.email = email;
    }
}

export const userConverter = {
    toFirestore: (user) => {
        return {
            name: user.name,
            email: user.email
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.name, data.email);
    }
}
