# Type-Safe Validation Quick Reference

## Import Everything You Need

```typescript
import {
  // Collections
  ArrayList,
  HashSet,
  HashMap,
  LinkedQueue,
  // Validation utilities
  validateSafe,
  createValidator,
  createUnionValidator,
  formatValidationError,
  createTransformingValidator,
  // Types
  type TypeValidationOptions,
  type MapTypeValidationOptions,
  type ValidationResult,
  type ValidationError,
} from 'ts-collections';
import { z } from 'zod';
```

## Quick Examples

### ArrayList with Zod

```typescript
const numbers = new ArrayList<number>({
  schema: z.number().int().positive()
});

numbers.add(42);   // ✓
numbers.add(-1);   // ✗ Throws TypeError
```

### HashSet with Enum

```typescript
const statuses = new HashSet<'active' | 'inactive'>({
  schema: z.enum(['active', 'inactive'])
});

statuses.add('active');   // ✓
statuses.add('unknown');  // ✗ Throws TypeError
```

### HashMap with Keys and Values

```typescript
const products = new HashMap<string, number>({
  keySchema: z.string().min(1),
  valueSchema: z.number().positive()
});

products.put('apple', 1.99);    // ✓
products.put('banana', -5);     // ✗ Throws TypeError
```

### LinkedQueue

```typescript
const queue = new LinkedQueue<Task>({
  schema: TaskSchema
});

queue.offer(validTask);   // ✓
queue.offer(invalidTask); // ✗ Throws TypeError
```

## Complex Types

### Objects

```typescript
const schema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  email: z.string().email()
});

const items = new ArrayList<z.infer<typeof schema>>({
  schema
});
```

### Arrays

```typescript
const schema = z.array(z.string().min(1).max(20)).min(1).max(10);
const tags = new ArrayList<string[]>({
  schema
});
```

### Unions

```typescript
const schema = z.union([
  z.object({ type: z.literal('email'), to: z.string().email() }),
  z.object({ type: z.literal('sms'), phone: z.string() })
]);

const items = new ArrayList<z.infer<typeof schema>>({
  schema
});
```

### Discriminated Unions

```typescript
const schema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('email'), to: z.string().email() }),
  z.object({ type: z.literal('sms'), phone: z.string() })
]);
```

## Validation Utilities

### Safe Validation (No Throw)

```typescript
const result = validateSafe(schema, data);

if (result.success) {
  console.log('Valid:', result.data);
} else {
  console.log('Error:', formatValidationError(result.error));
}
```

### Create Reusable Validators

```typescript
const validateEmail = createValidator(z.string().email());

// Use anywhere
const email = validateEmail(userInput);
```

### Union Validators

```typescript
const validate = createUnionValidator([
  z.string(),
  z.number(),
  z.boolean()
]);

const value = validate(input); // Works with any of the types
```

### Transform and Validate

```typescript
const schema = z.string().transform(str => str.toUpperCase());
const validator = createTransformingValidator(schema);

const result = validator('hello'); // Returns 'HELLO'
```

## Validation Strategies

### Strategy 1: Zod (Recommended)

```typescript
new ArrayList<T>({
  schema: z.object({...}) // Recommended!
})
```

### Strategy 2: Custom Validator

```typescript
new ArrayList<number>({
  typeValidator: (val) => {
    return typeof val === 'number' && val > 0;
  }
})
```

### Strategy 3: Strict Type

```typescript
new ArrayList<string>({
  strictType: true
})
```

### Strategy 4: No Validation

```typescript
new ArrayList<T>()
```

## Error Messages

### Zod Schema Errors

```typescript
try {
  list.add(invalidValue);
} catch (error) {
  console.log(error.message);
  // "Validation failed: root: Expected number, received string"
}
```

### Custom Validator Errors

```typescript
// "Type validation failed: element does not match the expected type"
```

### Strict Type Errors

```typescript
// "Type mismatch: expected string, but got number"
```

## TypeScript Types

### Extract Type from Schema

```typescript
const UserSchema = z.object({
  id: z.number(),
  name: z.string()
});

type User = z.infer<typeof UserSchema>;

const users = new ArrayList<User>({
  schema: UserSchema
});
```

### Validation Options Type

```typescript
const options: TypeValidationOptions<number> = {
  schema: z.number().positive()
};

const list = new ArrayList<number>(options);
```

### Map Validation Options Type

```typescript
const options: MapTypeValidationOptions<string, number> = {
  keySchema: z.string(),
  valueSchema: z.number()
};

const map = new HashMap<string, number>(options);
```

## Best Practices

✅ **DO:**
- Use Zod schemas in production
- Define schemas at module level
- Use `z.infer` for types
- Validate at system boundaries
- Test validation edge cases

❌ **DON'T:**
- Create schemas in loops
- Mix validation strategies
- Ignore validation errors
- Assume TypeScript alone prevents runtime errors
- Create `any` types

## Performance Tips

1. **Validate before collection**
   ```typescript
   // Better: validate once
   const validated = validateSafe(schema, data);
   if (validated.success) {
     list.add(validated.data);
   }
   ```

2. **Use strictType for simple types**
   ```typescript
   // Faster for simple cases
   const list = new ArrayList<number>({
     strictType: true
   });
   ```

3. **Reuse validators**
   ```typescript
   // Create once
   const validator = createValidator(schema);
   
   // Use many times
   for (const item of items) {
     validator(item);
   }
   ```

## Common Schemas

### Email

```typescript
z.string().email()
```

### UUID

```typescript
z.string().uuid()
```

### URL

```typescript
z.string().url()
```

### Positive Integer

```typescript
z.number().int().positive()
```

### Non-empty String

```typescript
z.string().min(1)
```

### Optional Field

```typescript
z.string().optional()
```

### Default Value

```typescript
z.string().default('default')
```

### Array with Constraints

```typescript
z.array(z.string()).min(1).max(10)
```

### Enum

```typescript
z.enum(['active', 'inactive', 'pending'])
```

## Getting Help

- [Zod Documentation](https://zod.dev)
- [ts-collections Documentation](./RUNTIME_VALIDATION.md)
- [Advanced Examples](./advanced-validation-examples.ts)
- [Implementation Notes](./IMPLEMENTATION_NOTES.md)

## Next Steps

1. **Read** [RUNTIME_VALIDATION.md](./RUNTIME_VALIDATION.md) for comprehensive guide
2. **Review** [advanced-validation-examples.ts](./advanced-validation-examples.ts) for working examples
3. **Check** [Zod docs](https://zod.dev) for more schema options
4. **Start** using type-safe collections in your project!
