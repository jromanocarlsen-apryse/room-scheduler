export class Room {

    //** Map of meeting id to meeting object */
    meetingList;

    //** Next available time for the room */
    nextAvailableTime;

    constructor() {
        this.meetingList = new Map();
        this.nextAvailableTime = 0;
    }

    addMeeting(meetingId, startTime, endTime) {
        // TODO

        // add the meeting to the meetingList map with the meeting id as the key and an object containing the start and end time as the value

        // update the next available time for the room if the end time of the meeting is later than the current next available time
    }

    removeMeeting(meetingId) {
        // TODO

        // remove the meeting from the meetingList map using the meeting id as the key
    }

    getNextAvailableTime() {
        // TODO

        // return the next available time for the room
    }

    getMeetings() {
        // TODO

        // return the meetingList map for the room
    }

    isEmpty() {
        // TODO

        // return true if the meetingList map is empty, otherwise return false
    }

    findConflictingMeetings(startTime, endTime) {
        // TODO

        // iterate through the meetingList map and find any meetings that conflict with the given start and end time

        // return a list of conflicting meetings
    }
    
}