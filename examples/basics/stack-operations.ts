import { LinkedStack } from "ts-collections";

// Create a stack of numbers using LinkedStack implementation
// Stack follows LIFO (Last In, First Out) principle
const stack = new LinkedStack<number>();

// Push elements onto the stack
// 10 is at bottom, 30 is at top
stack.push(10);
stack.push(20);
stack.push(30);

// Peek returns the top element without removing it
console.log(stack.peek()); // Output: 30

// Pop elements from the stack until it becomes empty
// pop() removes and returns the top element (LIFO order)
while (!stack.isEmpty()) {
	console.log(stack.pop());
}
