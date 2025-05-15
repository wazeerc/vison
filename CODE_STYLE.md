# Code Style and Formatting Guide

This project uses ESLint and Prettier to enforce consistent code style and formatting. This document provides an overview of the setup and instructions for developers.

## Tools Used

- **Prettier**: For consistent code formatting
- **ESLint**: For code quality and style rules
- **eslint-config-prettier**: To disable ESLint rules that might conflict with Prettier

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run format` | Format all files using Prettier |
| `npm run format:check` | Check if files are properly formatted |
| `npm run lint` | Run ESLint to check for issues |
| `npm run lint:fix` | Run ESLint and automatically fix issues |
| `npm run fix` | Format files and fix lint issues (combines format and lint:fix) |
| `npm run validate` | Validate formatting and linting (for CI) |

## VSCode Integration

The project includes VSCode settings that enable:

- Format on save
- ESLint error highlighting
- Type checking

## Recommended Extensions

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Code Spell Checker
- Error Lens
- TypeScript Next

## Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "auto",
  "jsxSingleQuote": false,
  "bracketSameLine": false,
  "quoteProps": "as-needed",
  "embeddedLanguageFormatting": "auto"
}
```

## ESLint Configuration

The ESLint configuration uses the flat config format and includes:

- TypeScript ESLint rules
- React Hooks rules
- React Refresh rules
- Prettier integration to prevent conflicts

## Common Issues and Solutions

### ESLint and Prettier Conflicts

If you see conflicting rules between ESLint and Prettier, check that:

1. `eslint-config-prettier` is properly configured
2. Prettier is the last configuration in the ESLint config file

### Format on Save Not Working

1. Make sure the Prettier extension is installed
2. Check that your VSCode settings include:
   ```json
   "editor.formatOnSave": true,
   "editor.defaultFormatter": "esbenp.prettier-vscode"
   ```

### Known Limitations

- The React Refresh plugin may show warnings for certain exported utility functions from component files. We've configured exceptions for common pattern exports.
