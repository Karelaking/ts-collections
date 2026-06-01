export interface ErrorContext {
	collectionType: string;
	operation: string;
	[key: string]: unknown;
}
