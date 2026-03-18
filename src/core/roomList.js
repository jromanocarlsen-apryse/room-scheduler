import { Room } from "./room.js";
import { Heap } from "./heap.js";

export class RoomList {
    //** Map<roomId, Room> */
    rooms;
    //** Map<meetingId, roomId> */
    meetingToRoomMap;
    //** Min-heap to keep track of rooms based on their next available time */
    heap;


    constructor() {
        this.rooms = new Map();
        this.meetingToRoomMap = new Map();
        this.heap = new Heap();

        // Counters for unique room and meeting ids
        this.roomIdCounter = 1;
        this.meetingIdCounter = 1;
    }

    //** Internal function to increment room counter */
    incrementRoomCounter() {
        return `r${this.roomIdCounter++}`;
    }

    //** Internal function to increment meeting counter */
    incrementMeetingCounter() {
        return `m${this.meetingIdCounter++}`;
    }

    //** Internal function to synchronize the heap with the current state of rooms */
    syncHeap() {
        const nodes = [];
        // iterate through all rooms and update the heap with the next available time for each room
        for (const [roomId, room] of this.rooms) {
            const nextAvailableTime = room.getNextAvailableTime();
            nodes.push({ roomId, nextAvailableTime });
        }

        // sort the heap based on the next available time for each room
        this.heap.buildHeap(nodes);
    }

    //** 
    // Function to schedule a meeting in the room list
    // Complexity: O(log n) where n is the number of rooms in the room list, since we are using a min-heap to keep track of the next available times for the rooms, and we need to insert/update the heap when scheduling a meeting
    //  */
    scheduleMeeting(startTime, endTime) {

        // lazily sync the heap to make sure it's up to date before trying to schedule the meeting, so that we can get the most accurate next available times for the rooms
        this.syncHeap();

        const meetingId = this.incrementMeetingCounter(); // Generate a unique meeting id
        let targetRoom = null;

        // if the heap is not empty, check the top room
        // peak at the top of the heap to get the room with the earliest next available time
        const bestRoom = this.heap.peek();

        // OPTIMIZATION: Use heap sort where possible
        // get actual availability if room by calling getNextAvailableTime on the room object
        if (bestRoom && bestRoom.nextAvailableTime <= startTime) {
            targetRoom = this.rooms.get(bestRoom.roomId); // Reuse the room if it's available before the start time of the meeting
        } else {
            // OPTIMIZATION: Fallback: Scan rooms for gaps
            for (const room of this.rooms.values()) {
                if (room.canFit(startTime, endTime)) {
                    targetRoom = room; // Reuse the room if it's available before the start time of the meeting
                    break;
                }
            }

            // No room fits the meeting, so we need to create a new room
            if (!targetRoom) {
                const roomId = this.incrementRoomCounter(); // Generate a unique room id
                targetRoom = new Room(roomId);
                this.rooms.set(roomId, targetRoom); // Add the new room to the rooms map
            }
        }

        targetRoom.addMeeting(meetingId, [startTime, endTime]); // Add the meeting to the room
        this.meetingToRoomMap.set(meetingId, targetRoom.roomId); // Update the meetingToRoomMap with the room id for the meeting id

        // syncHeap in next call will update the heap with the new next available time for the room, so we don't need to update the heap here

        return meetingId; // Return the unique id for the scheduled meeting
    }

    //** 
    // Function to cancel a meeting in the room list via meeting id
    // Remove the meeting from the room it is scheduled in, and if the room becomes empty after removing the meeting, remove the room from the rooms map
    // Returns true if the room was successfully removed, otherwise returns false
    // Complexity: O(1) as getting the room id, room object, and removing the meeting from the room are all O(1) operations due to the use of maps
    //  */
    cancelMeeting(meetingId) {
        // lookup roomId via meetingToRoomMap to get the room object
        const roomId = this.meetingToRoomMap.get(meetingId);
        if (!roomId) {
            return false; // Room does not exist
        }
        const room = this.rooms.get(roomId);

        // remove the meeting from the room object
        room.removeMeeting(meetingId);

        // remove the meeting from the meetingToRoomMap
        this.meetingToRoomMap.delete(meetingId);

        // if the room is empty after removing the meeting, remove the room from the rooms map
        if (room.isEmpty()) {
            this.rooms.delete(roomId);
        }
        return true;
    }

    //** Function to get the schedule of a room via id */
    getRoomSchedule(roomId) {
        // lookup roomId via meetingToRoomMap to get the room object
        const room = this.rooms.get(roomId);
        if (!room) {
            return null; // Room does not exist
        }
        // return the schedule of the room by calling getSortedMeetings on the room object
        return room.getSortedMeetings(); // getSortedMeetings() returns the meetings sorted by start time
    }

    //** 
    // Function to get all rooms in the room list 
    // Complexity: O(n) where n is the number of rooms in the room list
    // */
    getAllRooms() {

        // lazy sync the heap to make sure it's up to date before trying to get all rooms, so that we can get the most accurate next available times for the rooms
        this.syncHeap();

        // return a list of all rooms with their meetings
        const allRooms = [];
        for (const [roomId, room] of this.rooms) {
            allRooms.push({ roomId, meetings: room.getSortedMeetings() }); // getSortedMeetings() returns the meetings sorted by start time
        }
        return allRooms;
    }

    getRoomCounter() {
        // return the number of rooms currently in the room list
        return this.rooms.size;
    }

    getConflictingMeetings(startTime, endTime) {
        const conflicts = [];

        // iterate through all rooms
        for (const [_, room] of this.rooms) {
            // for each room, call findConflictingMeetings on the room object to get a list of conflicting meetings for that room
            // add the conflicting meetings to the overall list of conflicts
            const roomConflicts = room.findConflictingMeetings(startTime, endTime);
            conflicts.push(...roomConflicts);
        }
        // Return the list of conflicting meetings
        return conflicts;
    }


}