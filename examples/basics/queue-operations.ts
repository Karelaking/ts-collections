import { LinkedQueue } from "ts-collections";

// Create a queue of strings using LinkedQueue implementation
const queue = new LinkedQueue<string>();

// Add items to the queue (FIFO order)
// "Task 1" will be processed first
queue.offer("Task 1");
queue.offer("Task 2");
queue.offer("Task 3");

// Process the queue until it becomes empty
// dequeue() removes and returns the front element (FIFO)
while (!queue.isEmpty()) {
	console.log(queue.dequeue());
}
