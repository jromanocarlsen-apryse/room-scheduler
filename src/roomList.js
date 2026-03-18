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

        // iterate through all rooms and update the heap with the next available time for each room

        // sort the heap based on the next available time for each room
    }

    //** Function to add a room to the room list */
    addRoom(startTime, endTime) {
        // TODO
        
        // call syncHeap

        // peak at the top of the heap to get the room with the earliest next available time

        // if the heap is empty, create room 1 and add the meeting to that room

        // if the heap is not empty, check the top room

        // get actual availability if room by calling getNextAvailableTime on the room object

        // if the actual avail is different than the avail in the heap, update the heap with the actual avail

        // if the top room is available before the start time of the meeting reuse the room

        // if the top room is not available before the start time of the meeting, create a new room

        // add the meeting to the room
        
        // update the meetingToRoomMap with the room id for the meeting id

        // update the heap with the new next available time for the room
    }

    //** Function to remove a room from the room list via id */
    removeRoom(roomId) {
        // TODO

        // lookup roomId via meetingToRoomMap to get the room object

        // remove the meeting from the room object

        // remove the meeting from the meetingToRoomMap

        // if the room is empty after removing the meeting, remove the room from the rooms map
    }

    //** Function to get a room from the room list via id */
    getRoom(roomId) {
        // TODO

        // return the room object for the given room id
    }

    //** Function to get the schedule of a room via id */
    getRoomSchedule(roomId) {
        // TODO

        // lookup roomId via meetingToRoomMap to get the room object

        // return the list of meetings for the room
    }

    //** Function to get all rooms in the room list */
    getAllRooms() {
        // TODO
        // const rooms = [
        //     {
        //         roomId: '1',
        //         meetings: [
        //             { meetingId: 'TESTING1', startTime: '100', endTime: '200' },
        //             { meetingId: 'TESTING2', startTime: '400', endTime: '500' }
        //         ],
        //     },
        //     {
        //         roomId: '2',
        //         meetings: [
        //             { meetingId: 'TESTING3', startTime: '150', endTime: '250' },
        //             { meetingId: 'TESTING4', startTime: '300', endTime: '400' }
        //         ],
        //     }
        // ]; // Replace this with actual logic to retrieve the list of rooms
        // return rooms;

        // call syncHeap to make sure the heap is up to date

        // return a list of all rooms with their meetings
    }

    getRoomCounter() {
        // TODO

        // return the number of rooms currently in the room list
    }

    getConflictingMeetings(startTime, endTime) {
        // TODO

        // iterate through all rooms

        // for each room, call findConflictingMeetings on the room object to get a list of conflicting meetings for that room

        // add the conflicting meetings to a list of conflicts along with their room ids

        // return the list of conflicting meetings along with their room ids
    }


}