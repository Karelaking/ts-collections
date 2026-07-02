// src/abstracts/AbstractMap.ts
import { ZodError } from 'zod';

abstract class AbstractMap<K, V> {
  protected strict: boolean;

  constructor(strict: boolean = true) {
    this.strict = strict;
  }

  protected validateKeyType(key: K, method: string = 'put'): void {
    if (!this.strict) return;

    try {
      // existing validation
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const collectionName = this.constructor.name;
        const index = this.getIndexForErrorMessage();
        const value = this.getValueForErrorMessage();
        const message = this.formatErrorMessage(method, key, error, index, value);
        throw new TypeError(message);
      } else {
        throw error;
      }
    }
  }

  private formatErrorMessage(method: string, key: any, error: Error, index?: string, value?: string): string {
    const collectionName = this.constructor.name;
    const message = `${collectionName}.${method}() key validation failed: ${error.message}${index ? ` at index ${index}` : ''}${value ? ` for value ${value}` : ''}`;
    return message;
  }

  private getIndexForErrorMessage(): string | undefined {
    return undefined;
  }

  private getValueForErrorMessage(): string | undefined {
    return undefined;
  }
}

export { AbstractMap };