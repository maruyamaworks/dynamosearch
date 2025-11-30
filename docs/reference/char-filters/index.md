# Character Filters

Character filters preprocess raw text before tokenization.

## Base Class

### [CharacterFilter](./character-filter.md)

Abstract base class for implementing custom character filters.

## Available Character Filters

### [ICUNormalizer](./icu-normalizer.md)

Unicode text normalization using ICU normalization forms.

**Normalization Forms:**
- **NFKC** (default): Compatibility Composition - Recommended for search
- **NFC**: Canonical Composition - For text storage and display
- **NFD**: Canonical Decomposition - For accent-insensitive search
- **NFKD**: Compatibility Decomposition - Maximum normalization

**Best for:** General search applications, normalizing ligatures and full-width characters, accent-insensitive search
