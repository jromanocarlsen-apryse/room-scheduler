export class Room {

    //** Unique identifier for the room */
    roomId;
    //** Map of meeting id to meeting object (Map<meetingId, [startTime, endTime]>) */
    meetingList;

    constructor(id) {
        this.roomId = id;
        this.meetingList = new Map();
    }

    // add the meeting to the meetingList map with the meeting id as the key and an array containing the start and end time as the value
    addMeeting(meetingId, [startTime, endTime]) {
        this.meetingList.set(meetingId, [startTime, endTime]);
    }

    // remove the meeting from the meetingList map using the meeting id as the key
    removeMeeting(meetingId) {
        return this.meetingList.delete(meetingId);
    }

    // iterate through the meetingList map and find the maximum end time of all meetings in the room, which represents the next available time for the room
    getNextAvailableTime() {
        if (this.meetingList.size === 0) {
            return 0;
        }
        let maxEndTime = 0;
        for (const meeting of this.meetingList.values()) {
            const [_, endTime] = meeting;
            if (endTime > maxEndTime) {
                maxEndTime = endTime;
            }
        }
        return maxEndTime;
    }

    // return the meetingList map for the room
    getMeetings() {
        return Array.from(this.meetingList.entries());
    }

    // return the meetingList map for the room sorted by start time
    getSortedMeetings() {
        return this.getMeetings().sort((a, b) => a[1][0] - b[1][0]);
    }

    // return true if the meetingList map is empty, otherwise return false
    isEmpty() {
        return this.meetingList.size === 0;
    }

    // iterate through the meetingList map and find any meetings that conflict with the given start and end time
    findConflictingMeetings(startTime, endTime) {
        const conflictingMeetings = [];
        for (const [meetingId, [meetingStart, meetingEnd]] of this.meetingList.entries()) {
            if (startTime < meetingEnd && endTime > meetingStart) {
                const roomId = this.roomId;
                conflictingMeetings.push({ 
                    roomId, 
                    meetingId, 
                    startTime: meetingStart, 
                    endTime: meetingEnd 
                });
            }
        }
        return conflictingMeetings;
    }

    // check if a meeting can fit in the room without conflicting with any existing meetings
    canFit(startTime, endTime) {
        if (startTime < 0 || endTime <= startTime) {
            return false;
        }
        const sortedMeetings = this.getSortedMeetings();
        if (sortedMeetings.length === 0) {
            return true;
        }
        const firstMeetingStart = sortedMeetings[0][1][0];
        if (endTime <= firstMeetingStart) {
            return true;
        }
        for (let i = 0; i < sortedMeetings.length - 1; i++) {
            const currentMeetingEnd = sortedMeetings[i][1][1];
            const nextMeetingStart = sortedMeetings[i + 1][1][0];
            if (startTime >= currentMeetingEnd && endTime <= nextMeetingStart) {
                return true;
            }
        }
        const lastMeetingEnd = sortedMeetings[sortedMeetings.length - 1][1][1];
        if (startTime >= lastMeetingEnd) {
            return true;
        }
        return false;
    }
}