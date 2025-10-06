# AWMusic Documentation

This directory contains the documentation for the AWMusic project, automatically generated from TSDoc comments in the codebase.

## Prerequisites

You need either:

### Option 1: Nix (Recommended)
```bash
# Enter the development shell (includes all dependencies)
nix develop

# Or use direnv (if configured)
direnv allow
```

### Option 2: Devbox
```bash
# Install devbox: https://www.jetify.com/devbox/docs/installing_devbox/
devbox shell
```

### Option 3: Manual Installation
Install the following tools:
- **Node.js** 18+ with pnpm
- **Python** 3.12+
- **mdBook** - Install via: `cargo install mdbook`

## Usage

### Generate Documentation

Generate markdown files from TSDoc comments:

```bash
pnpm docs:gen
```

This will:
- Scan all `.ts` and `.tsx` files in the `packages/` directory
- Extract TSDoc comments
- Generate markdown files in `docs/src/`
- Organize documentation by package

### Build Documentation

Build the static HTML documentation:

```bash
pnpm docs:build
```

Output will be in `docs/book/`

### Serve Documentation Locally

Generate and serve documentation with live reload:

```bash
pnpm docs:serve
```

This will open your browser to `http://localhost:3000`

### Clean Documentation

Remove generated documentation files:

```bash
pnpm docs:clean
```

## Documentation Structure

```
docs/
├── README.md           # This file
├── book.toml           # mdBook configuration
├── src/                # Generated markdown files
│   ├── introduction.md # Auto-generated intro
│   ├── api-mobile.md   # Mobile package API
│   ├── api-desktop.md  # Desktop package API
│   ├── api-website.md  # Website package API
│   ├── api-api.md      # API package docs
│   └── api-shared.md   # Shared package docs
└── book/               # Generated HTML (gitignored)
```

## Writing Documentation

Add TSDoc comments to your TypeScript code:

```typescript
/**
 * Hook for managing theme colors with light/dark mode support.
 * 
 * @param props - Theme color configuration
 * @param props.light - Color value for light mode
 * @param props.dark - Color value for dark mode
 * @param colorName - Name of the color from theme constants
 * @returns The appropriate color value based on current theme
 * 
 * @example
 * ```typescript
 * const bgColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
 * ```
 * 
 * @see https://docs.expo.dev/guides/color-schemes/
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // implementation
}
```

### Supported TSDoc Tags

- `@param` - Parameter description
- `@returns` - Return value description
- `@throws` - Exception documentation
- `@example` - Usage examples
- `@remarks` - Additional notes
- `@see` - Related resources

## Customization

Edit `book.toml` to customize:
- Title and authors
- Theme (default: Ayu dark)
- Output formats
- Plugins and extensions

## Troubleshooting

**mdBook not found:**
```bash
# Install mdbook
cargo install mdbook

# Or use nix/devbox
nix develop
# or
devbox shell
```

**Python script fails:**
```bash
# Make sure Python 3.12+ is installed
python3 --version

# Run the script directly
python3 scripts/docs.py docs
```

**No documentation generated:**
- Ensure your code has TSDoc comments (`/** ... */`)
- Check that files are in the `packages/` directory
- Verify files aren't in excluded directories (node_modules, dist, etc.)

## Contributing

When adding new features or components:
1. Add TSDoc comments to your code
2. Run `pnpm docs:gen` to verify formatting
3. Review generated docs in `docs/src/`
4. Commit both code and updated docs

## Learn More

- [mdBook Documentation](https://rust-lang.github.io/mdBook/)
- [TSDoc Specification](https://tsdoc.org/)
- [TypeDoc](https://typedoc.org/) - Alternative documentation generator
