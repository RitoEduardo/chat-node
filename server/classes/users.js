class Users {

    constructor() {
        this.people = [];
    }

    addUser(id, name) {
        let person = { id, name, rooms: [] };
        this.people.push(person);
        return this.people;
    }

    addRoomPerson(id, room) {
        let item = this.people.find((item) => item.id == id);
        if (item) {
            item.rooms.push(room);
        }
    }

    getUser(id) {
        return this.people.filter(p => p.id === id)[0];
    }

    getUserForRoom(room) {
        return this.people.filter((person) => {
            let x = person.rooms.find((item) => item == room);
            console.log(x, person.name);
            if (x) { return true };
        })
    }

    getPeople() {
        return this.people;
    }

    getPeopleForRoom(room) {

    }

    deleteUser(id) {
        let user = this.getUser(id);
        this.people = this.people.filter(p => p.id != id);
        return user;
    }

}

module.exports = {
    Users
}