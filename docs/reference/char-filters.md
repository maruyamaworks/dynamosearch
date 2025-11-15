# Character Filters

Character filters preprocess raw text before tokenization.

## Type Definition

```typescript
type CharacterFilter = (str: string) => string;
```

Character filters are simple functions that transform strings.

## Custom Character Filters

### HTML Strip Filter

Remove HTML tags:

```typescript
const htmlStripFilter: CharacterFilter = (str) => {
  return str.replace(/<[^>]*>/g, '');
};
```

### Pattern Replace Filter

Replace patterns in text:

```typescript
const patternReplaceFilter = (
  pattern: RegExp,
  replacement: string
): CharacterFilter => {
  return (str) => str.replace(pattern, replacement);
};

// Usage: Normalize phone numbers
const phoneNormalizer = patternReplaceFilter(/[()-\s]/g, '');
phoneNormalizer('(555) 123-4567');  // '5551234567'
```

### Mapping Filter

Map characters to replacements:

```typescript
const mappingFilter = (mappings: Record<string, string>): CharacterFilter => {
  return (str) => {
    let result = str;
    for (const [from, to] of Object.entries(mappings)) {
      result = result.replaceAll(from, to);
    }
    return result;
  };
};

// Usage: Normalize special characters
const specialCharMapper = mappingFilter({
  '©': '(c)',
  '®': '(r)',
  '™': '(tm)',
  '&': 'and'
});
```

### Whitespace Normalizer

Normalize whitespace:

```typescript
const whitespaceNormalizer: CharacterFilter = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

whitespaceNormalizer('hello    world\n\tfoo');
// 'hello world foo'
```
