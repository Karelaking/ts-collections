if (process.env.NODE_ENV === "production" || process.env.CI) {
	process.exit(0);
}

const husky = (await import("husky")).default;
husky();
