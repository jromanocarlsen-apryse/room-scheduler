// Check if startTime and endTime are provided and are numbers
export function validateMeetingTimeInput(startTime, endTime) {
    if (startTime === undefined || endTime === undefined) {
        return { valid: false, error: 'Both startTime and endTime are required.' };
    }
    if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
        return { valid: false, error: 'Invalid input: startTime and endTime must be numbers.' };
    }
    if (startTime < 0 || endTime < 0 || endTime <= startTime) {
        return { valid: false, error: 'Invalid input: startTime and endTime must be non-negative numbers, and endTime must be greater than startTime.' };
    }
    return { valid: true };
}

// Check if meetingId is provided and is a string
export function validateMeetingIdInput(meetingId) {
    if (!meetingId) {
        return { valid: false, error: 'Meeting ID is required.' };
    }
    if (typeof meetingId !== 'string') {
        return { valid: false, error: 'Invalid input: meetingId must be a string.' };
    }
    return { valid: true };
}

// Check if roomId is provided and is a string
export function validateRoomIdInput(roomId) {
    if (!roomId) {
        return { valid: false, error: 'Room ID is required.' };
    }
    if (typeof roomId !== 'string') {
        return { valid: false, error: 'Invalid input: roomId must be a string.' };
    }
    return { valid: true };
}
