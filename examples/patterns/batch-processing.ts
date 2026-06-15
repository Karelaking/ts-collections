import { ArrayList, LinkedQueue } from "ts-collections";

// Define the structure of a Task object
interface Task {
	id: number;
	name: string;
}

// Create a queue to store tasks in FIFO order
const queue = new LinkedQueue<Task>();

// Add 12 tasks into the queue
for (let i = 1; i <= 12; i++) {
	queue.offer({ id: i, name: `Task ${i}` });
}

// Define batch size (number of tasks to process at once)
const batchSize = 5;

// Temporary storage for current batch of tasks
const batch = new ArrayList<Task>();

let task: Task | undefined;

// Dequeue tasks one by one and add them to batch
while (true) {
	task = queue.dequeue();
	if (task === undefined) {
		break;
	}

	batch.add(task);

	// When batch reaches required size, process it
	if (batch.size() === batchSize) {
		processBatch(batch);

		// Clear batch after processing
		batch.clear();
	}
}

// Process remaining tasks that didn't fill a full batch
if (!batch.isEmpty()) {
	processBatch(batch);
}

// Function to process a batch of tasks
function processBatch(batch: ArrayList<Task>) {
	console.log(`Processing ${batch.size()} tasks`);
}
