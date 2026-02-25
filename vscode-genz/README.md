# 💀 genz++ for VS Code

Syntax highlighting, code snippets, and a custom dark theme for the [genz++ programming language](https://whoseideawasthis.substack.com/p/the-last-programmer).

## Features

- **Syntax highlighting** for all genz++ keywords, emoji tokens, sparkle strings, and module names
- **Custom dark theme** — "genz++ Dark (The Last Programmer)"
- **Code snippets** — type `bruh`, `sus`, `vibe`, `yeet`, `spill`, etc. and tab-complete into full structures
- **Auto-closing** sparkle strings (type `✨` and the closing `✨` appears)
- **Code folding** between `tho` and `bet`
- **Auto-indentation** after `tho`, de-indent on `bet` and `nah`

## Install

### From VSIX (local install)

1. Install [vsce](https://github.com/microsoft/vscode-vsce) if you don't have it:

```bash
npm install -g @vscode/vsce
```

2. Build the extension:

```bash
cd vscode-genz
vsce package
```

3. This creates `genz-lang-1.0.0.vsix`. Install it in VS Code:

```bash
code --install-extension genz-lang-1.0.0.vsix
```

Or in VS Code: `Cmd+Shift+P` → "Extensions: Install from VSIX..." → select the `.vsix` file.

### From Source (development)

For hacking on the extension itself:

```bash
cd vscode-genz
# Open in VS Code
code .
# Press F5 to launch Extension Development Host
```

### From Marketplace

Coming soon. We're working up the courage.

## Theme

The extension includes **genz++ Dark (The Last Programmer)** — a dark theme with:

- 💀 Italic gray comments
- ✨ Light blue sparkle strings
- `yeet` / `bruh` in purple (declaration keywords)
- `sus` / `nah` / `bet` in red (control flow)
- `spill` / `👀` in green (I/O)
- Module names in orange italic
- Numbers in amber
- A very dark background, for the vibes

To activate: `Cmd+Shift+P` → "Preferences: Color Theme" → select "genz++ Dark (The Last Programmer)"

## Snippets

| Prefix     | Expands To                         |
|------------|------------------------------------|
| `bruh`     | Function declaration               |
| `sus`      | If statement                       |
| `susnah`   | If/Else statement                  |
| `vibe`     | While loop                         |
| `yeet`     | Variable declaration               |
| `spill`    | Print statement                    |
| `its`      | Return statement                   |
| `plug`     | Module import (with dropdown)      |
| `input`    | User input with prompt             |
| `forloop`  | Manual for-loop pattern            |
| `objfrom`  | Object creation                    |
| `netget`   | HTTP GET request                   |
| `drip`     | Colored output (with style picker) |

## File Associations

The extension registers `.genz` and `.gz` files. Yes, we know `.gz` is conventionally gzip. The genz++ community has chosen to simply not acknowledge this.

## Links

- [The Last Programmer](https://whoseideawasthis.substack.com/p/the-last-programmer) — the short story that started it all

## License

MIT
