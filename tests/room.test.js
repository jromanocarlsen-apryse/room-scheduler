import { Room } from "../src/core/room.js";

describe('Room tests', () => {
    let room;

    beforeEach(() => {
        room = new Room('r1');
    });

    describe('CRUD operations with meetings', () => {
        test('should add meetings and store them correctly', () => {
            room.addMeeting('m1', [5, 10]);
            room.addMeeting('m2', [0, 3]);
            const sorted = room.getSortedMeetings();
            expect(sorted).toEqual([
                ['m2', [0, 3]],
                ['m1', [5, 10]]
            ]);
        });

        test('should remove a meeting correctly', () => {
            room.addMeeting('m1', [5, 10]);
            expect(room.isEmpty()).toBe(false);
            room.removeMeeting('m1');
            expect(room.isEmpty()).toBe(true);
            expect(room.getSortedMeetings()).toEqual([]);
        });

        test('update isEmpty correctly when adding meetings', () => {
            expect(room.isEmpty()).toBe(true);
            room.addMeeting('m1', [5, 10]);
            expect(room.isEmpty()).toBe(false);
        });

        test('update isEmpty correctly when removing meetings', () => {
            room.addMeeting('m1', [5, 10]);
            expect(room.isEmpty()).toBe(false);
            room.removeMeeting('m1');
            expect(room.isEmpty()).toBe(true);
        });

    });

    describe('canFit tests', () => {
        beforeEach(() => {
            room.addMeeting('m1', [5, 10]);
            room.addMeeting('m2', [15, 20]);
        });

        test('should return true for a meeting that fits before existing meetings', () => {
            expect(room.canFit(0, 3)).toBe(true); // before m1
        });

        test('should return true for a meeting that fits between existing meetings', () => {
            expect(room.canFit(10, 15)).toBe(true); // between m1 and m2
        });

        test('should return false for a meeting that overlaps with an existing meeting', () => {
            expect(room.canFit(8, 12)).toBe(false); // overlaps m1
        });

        test('should return true for a meeting that fits after existing meetings', () => {
            expect(room.canFit(20, 25)).toBe(true); // after m2
        });
    });

    describe('getNextAvailableTime tests', () => {
        test('should return 0 for an empty room', () => {
            expect(room.getNextAvailableTime()).toBe(0);
        });

        test('should return the maximum end time of all meetings', () => {
            room.addMeeting('m1', [5, 10]);
            room.addMeeting('m2', [0, 3]);
            room.addMeeting('m3', [10, 15]);
            expect(room.getNextAvailableTime()).toBe(15);
        });
    });

    describe('findConflictingMeetings tests', () => {
        beforeEach(() => {
            room.addMeeting('m1', [5, 10]);
            room.addMeeting('m2', [0, 3]);
            room.addMeeting('m3', [10, 15]);
        });

        test('should return meetings that conflict with a given time range', () => {
            expect(room.findConflictingMeetings(6, 9)).toEqual([{
                roomId: 'r1',
                meetingId: 'm1',
                startTime: 5,
                endTime: 10
            }]);
        });

        test('should not return meetings where one meeting ends exactly where another begins', () => {
            expect(room.findConflictingMeetings(15, 30)).toEqual([]);
            expect(room.findConflictingMeetings(4, 5)).toEqual([]);
         });

        test('should return an empty array when no meetings conflict', () => {
            expect(room.findConflictingMeetings(20, 25)).toEqual([]);
        });
    });
});