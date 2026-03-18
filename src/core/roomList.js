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
        for (const [roomId, room] of this.rooms) {
            const nextAvailableTime = room.getNextAvailableTime();
            nodes.push({ roomId, nextAvailableTime });
        }
        // sort the heap based on the next available time for each room
        this.heap.buildHeap(nodes);
    }

    //** 
    // Function to schedule a meeting in the room list given a start and end time for the meeting
    //  */
    scheduleMeeting(startTime, endTime) {
        // lazily sync the heap to make sure it's up to date before trying to schedule the meeting, so that we can get the most accurate next available times for the rooms
        this.syncHeap();

        const meetingId = this.incrementMeetingCounter();
        let targetRoom = null;
        const bestRoom = this.heap.peek();
        if (bestRoom && bestRoom.nextAvailableTime <= startTime) {
            targetRoom = this.rooms.get(bestRoom.roomId);
        } else {
            // OPTIMIZATION: Fallback: Scan rooms for gaps
            for (const room of this.rooms.values()) {
                if (room.canFit(startTime, endTime)) {
                    targetRoom = room;
                    break;
                }
            }
            // No room fits the meeting, so we need to create a new room
            if (!targetRoom) {
                const roomId = this.incrementRoomCounter();
                targetRoom = new Room(roomId);
                this.rooms.set(roomId, targetRoom);
            }
        }
        targetRoom.addMeeting(meetingId, [startTime, endTime]);
        this.meetingToRoomMap.set(meetingId, targetRoom.roomId);
        return meetingId;
    }

    //** 
    // Function to cancel a meeting in the room list via meeting id and if the room becomes empty, remove the room
    // Returns true if the meeting was successfully removed, otherwise returns false
    //  */
    cancelMeeting(meetingId) {
        const roomId = this.meetingToRoomMap.get(meetingId);
        if (!roomId) {
            return false;
        }
        const room = this.rooms.get(roomId);
        room.removeMeeting(meetingId);
        this.meetingToRoomMap.delete(meetingId);
        if (room.isEmpty()) {
            this.rooms.delete(roomId);
        }
        return true;
    }

    //** Function to get the schedule of a room via id */
    getRoomSchedule(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return null;
        }
        return room.getSortedMeetings();
    }

    //** 
    // Function to get all rooms in the room list 
    // */
    getAllRooms() {
        const allRooms = [];
        for (const [roomId, room] of this.rooms) {
            allRooms.push({ roomId, meetings: room.getSortedMeetings() });
        }
        return allRooms;
    }

    // return the number of rooms currently in the room list
    getRoomCounter() {
        return this.rooms.size;
    }

    // Function to find all meetings that conflict with a given meeting time range across all rooms in the room list
    getConflictingMeetings(startTime, endTime) {
        const conflicts = [];
        for (const [_, room] of this.rooms) {
            const roomConflicts = room.findConflictingMeetings(startTime, endTime);
            conflicts.push(...roomConflicts);
        }
        return conflicts;
    }
}