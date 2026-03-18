import { RoomList } from "../src/core/roomList.js";

describe('RoomList tests', () => {
    let roomList;

    function generateSampleMeetings() {
        // Helper function to generate sample meetings for testing
        roomList.scheduleMeeting(5, 10); // m1
        roomList.scheduleMeeting(0, 3);  // m2
        roomList.scheduleMeeting(10, 18); // m3
        roomList.scheduleMeeting(15, 20); // m4

        //** Expected roomList.meetings: 
        // {
        //     r1: {
        //         m2: [0, 3],
        //         m1: [5, 10],
        //         m3: [10, 18]
        //     },
        //     r2: {
        //         m4: [15, 20]
        //     }
        // }
        // */
    }

    beforeEach(() => {
        roomList = new RoomList();
    });

    describe('scheduleMeeting tests', () => {
        test('should create single room for empty room list and schedule the meeting', () => {
            const meetingId = roomList.scheduleMeeting(5, 10);
            expect(roomList.meetingToRoomMap.get(meetingId)).toBe('r1');
        });

        test('should schedule meetings in the same room if they do not conflict', () => {
            roomList.scheduleMeeting(5, 10); // m1 in r1
            const meetingId = roomList.scheduleMeeting(20, 30); // m2 in r1
            expect(roomList.meetingToRoomMap.get(meetingId)).toBe('r1');
        });

        test('should handle multiple conflicts without creating unnecessary rooms', () => {
            roomList.scheduleMeeting(5, 50); // m1 in r1
            roomList.scheduleMeeting(10, 20); // m2 in r2
            roomList.scheduleMeeting(30, 40); // m3 should go to r2 due to conflict with m1 and m2 in r1
            expect(roomList.getRoomCounter()).toBe(2); // Only 2 rooms should be created (r1 and r2)
        });

        test('should fill in gaps in existing rooms before creating new rooms', () => {
            roomList.scheduleMeeting(20, 30); // m1 in r1
            roomList.scheduleMeeting(5, 10); // m2 should fill the gap in r1
            expect(roomList.getRoomCounter()).toBe(1); // Only 1 room should be created (r1)
        });

        test('should create new room if gap present but too small to fit the meeting', () => {
            roomList.scheduleMeeting(20, 30); // m1 in r1
            roomList.scheduleMeeting(5, 25); // m2 should not fit in r1 due to conflict with m1, so it should go to r2
            expect(roomList.getRoomCounter()).toBe(2); // 2 rooms should be created (r1 and r2)
        });

        test('should create new room if meeting conflicts with all existing rooms', () => {
            roomList.scheduleMeeting(5, 15); // m1 in r1
            roomList.scheduleMeeting(20, 30); // m2 in r1
            const meetingId = roomList.scheduleMeeting(10, 25); // m3 should conflict with both m1 and m2, so it should go to r2
            expect(roomList.getRoomCounter()).toBe(2); // 2 rooms should be created (r1 and r2)
            expect(roomList.meetingToRoomMap.get(meetingId)).toBe('r2');
        });
    });

    describe('cancelMeeting tests', () => {
        test('should return false when trying to cancel a non-existent meeting', () => {
            generateSampleMeetings();
            const room1ScheduleBefore = roomList.getRoomSchedule('r1');
            const room2ScheduleBefore = roomList.getRoomSchedule('r2');
            const result = roomList.cancelMeeting('nonExistentMeetingId');
            const room1ScheduleAfter = roomList.getRoomSchedule('r1');
            const room2ScheduleAfter = roomList.getRoomSchedule('r2');
            expect(result).toBe(false);
            expect(room1ScheduleAfter).toEqual(room1ScheduleBefore);
            expect(room2ScheduleAfter).toEqual(room2ScheduleBefore);
        });

        test('should cancel an existing meeting and remove the room if it becomes empty', () => {
            const meetingId = roomList.scheduleMeeting(5, 10); // m1 in r1
            const roomCounterBefore = roomList.getRoomCounter();
            const roomsBefore = roomList.getAllRooms();
            const result = roomList.cancelMeeting(meetingId);
            const roomCounterAfter = roomList.getRoomCounter();
            const roomsAfter = roomList.getAllRooms();
            expect(result).toBe(true);
            expect(roomList.getRoomSchedule('r1')).toBeNull(); // r1 should be removed since it becomes empty after cancelling m1
            expect(roomCounterAfter).toBe(roomCounterBefore - 1); // The room should be removed since it becomes empty after cancelling the meeting
            expect(roomsAfter.length).toBe(roomsBefore.length - 1); // The rooms list should be updated accordingly
        });

        test('should cancel an existing meeting and keep the room if it still has other meetings', () => {
            roomList.scheduleMeeting(5, 10); // m1 in r1
            const meetingId = roomList.scheduleMeeting(20, 30); // m2 in r1
            const roomCounterBefore = roomList.getRoomCounter();
            const roomScheduleBefore = roomList.getRoomSchedule('r1');
            const result = roomList.cancelMeeting(meetingId);
            const roomCounterAfter = roomList.getRoomCounter();
            const roomScheduleAfter = roomList.getRoomSchedule('r1');
            expect(result).toBe(true);
            expect(roomScheduleAfter.length).toBe(roomScheduleBefore.length - 1); // r1 should have one less meeting after cancelling m2
            expect(roomScheduleAfter[0][0]).toBe(roomScheduleBefore[0][0]); // m1 should still be the first meeting in r1 (sorted) after cancelling m2
            expect(roomCounterAfter).toBe(roomCounterBefore); // The room should not be removed since it still has another meeting (m1) after cancelling m2
        });

        test('cancelling a meeting should create a gap which can be filled by future meetings', () => {
            generateSampleMeetings();
            const scheduleBeginning = roomList.getRoomSchedule('r1');
            const roomCounterBefore = roomList.getRoomCounter();
            roomList.cancelMeeting('m1');
            const scheduleWithGap = roomList.getRoomSchedule('r1');
            roomList.scheduleMeeting(6, 8);
            const scheduleEnd = roomList.getRoomSchedule('r1');
            const roomCounterAfter = roomList.getRoomCounter();
            expect(roomCounterAfter).toBe(roomCounterBefore); // The room counter should not increase since the new meeting should fit in the gap created by cancelling m1 and should not require creating a new room
            expect(scheduleWithGap.length).toBe(scheduleBeginning.length - 1); // r1 should have one less meeting after cancelling m1
            expect(scheduleEnd.length).toBe(scheduleWithGap.length + 1);
        });

        test('should not be able to delete the same meeting twice immediately', () => {
            generateSampleMeetings();
            const result1 = roomList.cancelMeeting('m1'); // Cancel m1 in r1
            const result2 = roomList.cancelMeeting('m1'); // Try to cancel m1 again immediately after cancelling it
            expect(result1).toBe(true); // The first cancellation should succeed
            expect(result2).toBe(false); // The second cancellation should fail since m1 has already been cancelled and removed from the room list
        });



    });

    describe('getRoomSchedule', () => {
        test('should return a list of meetings sorted by start time when calling getRoomSchedule with a valid room id', () => {
            generateSampleMeetings();
            const room1Schedule = roomList.getRoomSchedule('r1');
            expect(room1Schedule).toEqual([
                ['m2', [0, 3]],
                ['m1', [5, 10]],
                ['m3', [10, 18]]
            ]); // The meetings in r1 should be returned sorted by start time
        });

        test('should return null when calling getRoomSchedule with an invalid room id', () => {
            const result = roomList.getRoomSchedule('nonExistentRoomId');
            expect(result).toBeNull(); // getRoomSchedule should return null for a non-existent room id
        });
    });

    describe('Conflict Detection', () => {
        beforeEach(() => {
            generateSampleMeetings();
        });

        test('should detect a single conflict in a room', () => {
            const conflicts = roomList.getConflictingMeetings(6, 9); // overlaps with m1 in r1
            expect(conflicts).toEqual([
                { roomId: 'r1', meetingId: 'm1', startTime: 5, endTime: 10 }
            ]);
        });

        test('should detect multiple conflicts in one room', () => {
            const conflicts = roomList.getConflictingMeetings(8, 12); // overlaps with m1 and m3 in r1
            expect(conflicts).toEqual([
                { roomId: 'r1', meetingId: 'm1', startTime: 5, endTime: 10 },
                { roomId: 'r1', meetingId: 'm3', startTime: 10, endTime: 18 }
            ]);
        });

        test('should detect conflicts across multiple rooms', () => {
            const conflicts = roomList.getConflictingMeetings(14, 17); // overlaps m3 in r1 and m4 in r2
            expect(conflicts).toEqual([
                { roomId: 'r1', meetingId: 'm3', startTime: 10, endTime: 18 },
                { roomId: 'r2', meetingId: 'm4', startTime: 15, endTime: 20 }
            ]);
        });

        test('should return an empty array when no conflicts exist', () => {
            const conflicts = roomList.getConflictingMeetings(21, 25); // no overlaps with any meetings
            expect(conflicts).toEqual([]);
        });

        test('should return no conflicts for a meeting that starts exactly when another meeting ends', () => {
            const conflicts = roomList.getConflictingMeetings(20, 25); // starts exactly when m4 in r2 ends
            expect(conflicts).toEqual([]);
        });
    });
});