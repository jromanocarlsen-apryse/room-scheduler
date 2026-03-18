export class Heap {

    //** 
    // Array to store the heap elements
    // Each element in the heap is an object with the following structure:
    // {
    //     roomId: string, // Unique identifier for the room
    //     nextAvailableTime: number // The next available time for the room (the maximum end time of all meetings in the room)
    // }
    //  */
    heap;

    constructor() {
        this.heap = [];
    }

    insert(node) {
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }

    // Return the minimum element in the heap (the root of the heap)
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    // Remove and return the minimum element in the heap (the root of the heap)
    extractMin() {
        if (this.heap.length === 0) {
            return null; // Heap is empty
        }
        if (this.heap.length === 1) {
            return this.heap.pop(); // Only one element in the heap
        }
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }

    // swap the element with its parent until the heap property is satisfied (i.e., the parent is smaller than the element)
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2); // formula for finding the parent's associated array index
            if (this.heap[index].nextAvailableTime < this.heap[parentIndex].nextAvailableTime) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break; // The heap property is satisfied
            }
        }
    }

    // Swap the element with its smallest child until the heap property is satisfied (i.e., the element is smaller than both children)
    bubbleDown(index) {
        const length = this.heap.length;
        const element = this.heap[index];
        while (true) {
            const leftChildIndex = 2 * index + 1; // formula for finding the left child's associated array index
            const rightChildIndex = 2 * index + 2; // formula for finding the right child's associated array index
            let smallest = index;
            if (leftChildIndex < length && this.heap[leftChildIndex].nextAvailableTime < this.heap[smallest].nextAvailableTime) {
                smallest = leftChildIndex;
            }
            if (rightChildIndex < length && this.heap[rightChildIndex].nextAvailableTime < this.heap[smallest].nextAvailableTime) {
                smallest = rightChildIndex;
            }
            if (smallest === index) break;
            this.swap(index, smallest);
            index = smallest;
        }
    }

    // Swap the elements at indices i and j in the heap array
    swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    // Build a heap from an array of elements
    buildHeap(array) {
        this.heap = array;
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.bubbleDown(i);
        }
    }
}