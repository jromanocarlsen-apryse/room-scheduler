# My Room Scheduler Application

Welcome to my meeting room scheduling application!

## How to run the application

1. git clone https://github.com/jromanocarlsen-apryse/room-scheduler.git
2. cd room-scheduler
3. npm install
4. npm run dev

## Whiteboard with unfiltered ideation, planning, and more:

See whiteboard here: https://apryse-my.sharepoint.com/:wb:/p/jacob_carlsen/IQDmmaUiki36R6cglKVluJgAAa1NV2IfbPzrHNKyrGStqWk?e=pumapp

## Approach

Firstly, most of the behavior of this application seemed to fall under one of three "concepts" 
- A "Meeting"
- The "Room" which hosts a schedule of meetings
- The list of "Meeting Rooms" used (which should be kept to a minimum)

Therefore, I separated responsibilities based into these 3 "concepts" and created methods where it made sense for each "concept" (see "PROMPT: Design" and "PROMPT: Internal Structures" in whiteboard)
- A "Meeting" is described to be [startTime, endTime], so keep this as a primitive array of 2 number elements, no functions necessary
- A "Room" would be responsible for tracking its current meetings, i.e. CRUD operations, sorting, and queries to the list of meetings
- The "List of Meeting Rooms" would be responsible for managing the rooms, optimizing where to insert meetings into and the number of rooms used, etc. 
    - The equivalent of the "Brain" of the application

As the design was implemented, with each "concept" complete, I used postman to run sample endpoints against the application to test all of the functions of the finished "concept" to ensure they functioned as intended (see "PROMPT: Approach")

Testing was planned by listing out each "operation" that took place in a function and creating a test for each potential "output" of the operation
- For example, scheduleMeeting has 3 scenarios:
    - Room is found which can fit the meeting at the end (minheap)
    - Room is not found which can fit at the end, but can fit in a gap
    - No available rooms, create a new room
- I would test the potential scenarios which lead to each of these 3 scenarios

To assist with the implementation, AI tools such as Copilot and ChatGPT were used as proofreaders to provide design feedback, verify test coverage and any edge cases missed.

## Data Structures Chosen

- heap : Priority Queue / Min heap
- meetingList: Map<meetingId, Meeting>
- rooms : Map<roomId, Room>
- meetingToRoomMap : Map<meetingId, roomId>

### Why these?

- Following the second interview where this concept was explored, I wanted to use a minHeap as it was discussed to be a very efficient way (log(n)) to access the "next available slot" for each room by tracking the latest endTime of each room.
    - This was pivotal as I could use this next available slot for inserting new meetings while maintaining the condition of "least number of rooms possible"
- MeetingList and rooms were chosen to be maps to assign ids for quick access through meetingToRoomMap
- meetingToRoomMap helped establish a O(1) method of finding a room via a meetingID, which is also leads to O(1) deletion for the rooms/meetingList Maps.
    - In essence, rather than searching through each room to find a meeting to cancel, having a 1:1 guide keeps overhead down, and can exist within existing functionality

## Time Complexities

### scheduleMeeting
O(n log n), n = num of rooms
- min-heap heap operations take O(log n) efficiency
- Fallback scan through all rooms operation takes O(n) efficiency
- Worse case would be operating through both algorithms, aka O(n log n)
### cancelMeeting
o(1)
- Due to implementation of Maps for meetingList / rooms / meetingToRoomMap, we have a constant efficiency for removing meetings (and potentially rooms) from existing maps using Map functions
### getConflictingMeetings
o(n), n = number of meetings across all rooms
- Needs to compare given startTime/endTime to all rooms

## Important Behaviors / Edge Cases Considered

- Scheduling fills gaps in existing rooms before creating new rooms
    - This includes at the beginning, a gap in the middle, or at the end (quickest)
- New rooms will be created if no gap present
- Cancelling meetings create gaps that can be used for future meetings
- You cannot cancel the same meeting twice
- Rooms are removed if they do not have any meetings in them
- **Conflicts between meetings to not include when one meeting ends at the EXACT time another starts

## Limitations / Tradeoffs

- Heap is only updated when the data is needed (i.e. for creating a new room using minheap), so this can create problems if not considered when creating new features which interacts with the heap
- Detecting conflicts currently requires reading through all rooms
    - Can't be solved by current min heap solution as it tracks the min endTimes, no access to the actual meeting details for conflict check
- Fallback scenario for scheduleMeetings (checking all rooms for a gap) drags down efficiency of the function, a more complex data structure may be needed to optimize gap tracking instead.
    - Tradeoff of not including this was whenever we canceled a meeting, the gap could never be filled, leading to potential unnecessary rooms
- scheduleMeetings may miss optimal number of rooms that could be found by moving some meetings around

## Future Improvements

- Optimize gap search to see if there is a better rearrangement of meetings across all rooms to minimize the number of rooms needed
- Data persistence of the application
- Optimize conflict findings (something like a map for each integer from minTime - maxTime, which contains a list of all meetings which occupy that "timespace")
