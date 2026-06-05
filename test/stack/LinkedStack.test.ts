import { LinkedStack } from "../../src/stack/LinkedStack";
import { describeStack } from "../interfaces/Stack";

// Run shared Stack interface tests
describeStack(() => new LinkedStack<number>());

// Additional LinkedStack-specific tests have been split into separate files
