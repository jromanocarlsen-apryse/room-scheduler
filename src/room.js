export class Room {

    //** Unique identifier for the room */
    id;
    //** Map of meeting id to meeting object (Map<meetingId, [startTime, endTime]>) */
    meetingList;

    constructor(id) {
        this.id = id;
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

    getMeetings(sorted = false) {
        // return the meetingList map for the room
        // if sorted is true, return the meetings sorted by start time, otherwise return them in any order
        const meetingsArray = Array.from(this.meetingList.entries());
        if (sorted) {
            return meetingsArray.sort((a, b) => a[1][0] - b[1][0]);
        } else {
            return meetingsArray;
        }
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
                conflictingMeetings.push([meetingId, [meetingStart, meetingEnd]]);
            }
        }

        // return a list of conflicting meetings
        return conflictingMeetings;
    }
    
}