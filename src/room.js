export class Room {

    //** Unique identifier for the room */
    roomId;
    //** Map of meeting id to meeting object (Map<meetingId, [startTime, endTime]>) */
    meetingList;

    constructor(id) {
        this.roomId = id;
        this.meetingList = new Map();
    }

    addMeeting(meetingId, [startTime, endTime]) {
        // add the meeting to the meetingList map with the meeting id as the key and an array containing the start and end time as the value
        this.meetingList.set(meetingId, [startTime, endTime]);
    }

    removeMeeting(meetingId) {
        // remove the meeting from the meetingList map using the meeting id as the key
        // return true if the meeting was successfully removed, otherwise return false
        return this.meetingList.delete(meetingId);
    }

    getNextAvailableTime() {
        if (this.meetingList.size === 0) {
            return 0; // if there are no meetings, the room is available at time 0
        }

        // iterate through the meetingList map and find the maximum end time of all meetings
        let maxEndTime = 0;
        for (const meeting of this.meetingList.values()) {
            const [_, endTime] = meeting;
            if (endTime > maxEndTime) {
                maxEndTime = endTime;
            }
        }

        // return the maximum end time as the next available time for the room
        return maxEndTime;
    }

    getMeetings() {
        // return the meetingList map for the room
        return Array.from(this.meetingList.entries());
    }

    getSortedMeetings() {
        // return the meetingList map for the room sorted by start time
        return this.getMeetings().sort((a, b) => a[1][0] - b[1][0]);
    }

    isEmpty() {
        // return true if the meetingList map is empty, otherwise return false
        return this.meetingList.size === 0;
    }

    findConflictingMeetings(startTime, endTime) {
        // iterate through the meetingList map and find any meetings that conflict with the given start and end time
        const conflictingMeetings = [];
        for (const [meetingId, [meetingStart, meetingEnd]] of this.meetingList.entries()) {
            if (startTime < meetingEnd && endTime > meetingStart) {
                const roomId = this.roomId;
                conflictingMeetings.push({ roomId, meetingId, meetingStart, meetingEnd });
            }
        }

        // return a list of conflicting meetings
        return conflictingMeetings;
    }

    canFit(startTime, endTime) {
        if (startTime < 0 || endTime <= startTime) {
            return false; // invalid meeting time
        }

        const sortedMeetings = this.getSortedMeetings();

        // boundary case: if there are no meetings in the room, the meeting can fit
        if (sortedMeetings.length === 0) {
            return true;
        }

        // check if the meeting can fit before the first meeting in the room
        const firstMeetingStart = sortedMeetings[0][1][0];
        if (endTime <= firstMeetingStart) {
            return true;
        }

        // check if the meeting can fit between any two meetings in the room
        for (let i = 0; i < sortedMeetings.length - 1; i++) {
            const currentMeetingEnd = sortedMeetings[i][1][1];
            const nextMeetingStart = sortedMeetings[i + 1][1][0];
            if (startTime >= currentMeetingEnd && endTime <= nextMeetingStart) {
                return true;
            }
        }

        // check if the meeting can fit after the last meeting in the room
        const lastMeetingEnd = sortedMeetings[sortedMeetings.length - 1][1][1];
        if (startTime >= lastMeetingEnd) {
            return true;
        }

        // the meeting cannot fit in the room
        return false;
    }
}