/**
 * TypeCache - WeakMap-based type detection caching
 *
 * Performance characteristics:
 * - Primitive cache: Direct detection (~5-10ns)
 * - Cached object lookup: O(1) WeakMap access (~15-20ns)
 * - Cache miss (first detection): O(n) where n = instanceof checks (~30-50ns)
 * - No memory leaks: Objects auto-removed when garbage collected
 * - No object mutation: Original objects untouched
 *
 * Memory profile:
 * - WeakMap overhead: ~1KB per collection instance
 * - Per-object cache entry: ~16 bytes (pointer + type code)
 * - Auto-cleanup: No manual management needed
 */

import { globalTypeDetector, type TypeDetector } from "./TypeDetector";
import type { TypeCode } from "./TypeSystem";

export interface CacheStats {
	cacheHits: number;
	cacheMisses: number;
	hitRate: number;
	objectLookups: number;
	primitiveChecks: number;
}

export class TypeCache {
	private detector: TypeDetector;
	private objectCache: WeakMap<object, TypeCode>;

	// Statistics (optional, can be disabled in production)
	private stats: CacheStats = {
		primitiveChecks: 0,
		objectLookups: 0,
		cacheHits: 0,
		cacheMisses: 0,
		hitRate: 0,
	};

	private trackStats = false;

	/**
	 * Create a new type cache
	 *
	 * @param detector - TypeDetector instance to use (or global singleton)
	 * @param trackStats - Enable statistics tracking (useful for benchmarking)
	 */
	constructor(detector?: TypeDetector, trackStats = false) {
		this.detector = detector || globalTypeDetector;
		this.objectCache = new WeakMap();
		this.trackStats = trackStats;
	}

	/**
	 * Get cached type for a value
	 *
	 * For primitives:
	 * - Direct detection (no caching needed, typeof is ~5ns)
	 * - No memory overhead
	 *
	 * For objects:
	 * - Check WeakMap first
	 * - On miss: detect and cache
	 * - Reuse cached value on subsequent calls
	 *
	 * @param value The value to check
	 * @returns TypeCode (0-15)
	 */
	getType(value: unknown): TypeCode {
		// Fast-path: Primitives don't need caching (typeof is already O(1))
		if (typeof value !== "object") {
			if (this.trackStats) {
				this.stats.primitiveChecks++;
			}
			return this.detector.detect(value);
		}

		// Null is an object in typeof but handled specially
		if (value === null) {
			if (this.trackStats) {
				this.stats.primitiveChecks++;
			}
			return this.detector.detect(value);
		}

		// Slow-path: Check cache for object types
		if (this.trackStats) {
			this.stats.objectLookups++;
		}

		const cached = this.objectCache.get(value);
		if (cached !== undefined) {
			if (this.trackStats) {
				this.stats.cacheHits++;
			}
			return cached;
		}

		// Cache miss: detect and store
		if (this.trackStats) {
			this.stats.cacheMisses++;
		}
		const code = this.detector.detect(value);
		this.objectCache.set(value, code);
		return code;
	}

	/**
	 * Pre-populate cache with known types
	 * Useful for bulk validation scenarios
	 *
	 * @param objects Array of objects to pre-cache
	 */
	preCache(objects: object[]): void {
		for (const obj of objects) {
			if (!this.objectCache.has(obj)) {
				const code = this.detector.detect(obj);
				this.objectCache.set(obj, code);
			}
		}
	}

	/**
	 * Check if a value's type is cached
	 * Useful for monitoring cache effectiveness
	 *
	 * @param value The value to check
	 * @returns true if type is cached (for objects)
	 */
	isCached(value: unknown): boolean {
		if (typeof value !== "object" || value === null) {
			return false; // Primitives don't use cache
		}
		return this.objectCache.has(value);
	}

	/**
	 * Get cache statistics
	 * Only populated if tracking was enabled
	 *
	 * @returns CacheStats object with hit rate, etc.
	 */
	getStats(): CacheStats {
		if (!this.trackStats) {
			return {
				primitiveChecks: 0,
				objectLookups: 0,
				cacheHits: 0,
				cacheMisses: 0,
				hitRate: 0,
			};
		}

		const totalLookups = this.stats.cacheHits + this.stats.cacheMisses;
		const hitRate = totalLookups > 0 ? this.stats.cacheHits / totalLookups : 0;

		return {
			...this.stats,
			hitRate,
		};
	}

	/**
	 * Reset statistics (useful between benchmarks)
	 */
	resetStats(): void {
		this.stats = {
			primitiveChecks: 0,
			objectLookups: 0,
			cacheHits: 0,
			cacheMisses: 0,
			hitRate: 0,
		};
	}

	/**
	 * Get detector instance used by this cache
	 */
	getDetector(): TypeDetector {
		return this.detector;
	}

	/**
	 * Compare types of two values
	 * Useful for type matching/validation
	 *
	 * @param value1 First value
	 * @param value2 Second value
	 * @returns true if both values have same type code
	 */
	typeMatch(value1: unknown, value2: unknown): boolean {
		const type1 = this.getType(value1);
		const type2 = this.getType(value2);
		return type1 === type2;
	}

	/**
	 * Validate value matches expected type code
	 * For use in validation flows
	 *
	 * @param value The value to validate
	 * @param expectedCode Expected type code
	 * @returns true if value matches type
	 */
	validateType(value: unknown, expectedCode: TypeCode): boolean {
		return this.getType(value) === expectedCode;
	}

	/**
	 * Validate value matches any of expected type codes
	 *
	 * @param value The value to validate
	 * @param expectedCodes Acceptable type codes
	 * @returns true if value matches any expected type
	 */
	validateOneOf(value: unknown, expectedCodes: TypeCode[]): boolean {
		const code = this.getType(value);
		return expectedCodes.includes(code);
	}
}

/**
 * Global singleton cache
 * Shared across entire application
 */
export const globalTypeCache = new TypeCache(globalTypeDetector, false);

/**
 * Convenience functions using global cache
 */
export const cachedGetType = (value: unknown): TypeCode =>
	globalTypeCache.getType(value);

export const cachedTypeMatch = (value1: unknown, value2: unknown): boolean =>
	globalTypeCache.typeMatch(value1, value2);

export const cachedValidateType = (value: unknown, code: TypeCode): boolean =>
	globalTypeCache.validateType(value, code);
