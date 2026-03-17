import { Room } from "./room.js";

export class RoomList {
    //** Map of room id to room object */
    rooms;
    meetingToRoomMap;
    heap;


    constructor() {
        this.rooms = new Map();
        this.meetingToRoomMap = new Map();
        this.heap = [];
    }

    //** Internal function to synchronize the heap with the current state of rooms */
    syncHeap() {
        // TODO
    }

    //** Function to add a room to the room list */
    addRoom(startTime, endTime) {
        // TODO
    }

    //** Function to remove a room from the room list via id */
    removeRoom(roomId) {
        // TODO
    }

    //** Function to get a room from the room list via id */
    getRoom(roomId) {
        // TODO
    }

    //** Function to get all rooms in the room list */
    getAllRooms() {
        // TODO
        const rooms = [
            {
                roomId: '1',
                meetings: [
                    { meetingId: 'TESTING1', startTime: '100', endTime: '200' },
                    { meetingId: 'TESTING2', startTime: '400', endTime: '500' }
                ],
            },
            {
                roomId: '2',
                meetings: [
                    { meetingId: 'TESTING3', startTime: '150', endTime: '250' },
                    { meetingId: 'TESTING4', startTime: '300', endTime: '400' }
                ],
            }
        ]; // Replace this with actual logic to retrieve the list of rooms
        return rooms;
    }

    getRoomCounter() {
        // TODO
    }

    getConflictingMeetings(startTime, endTime) {
        // TODO
    }


}