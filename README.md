# 💀 genz++

> *"It started as a third-place hackathon joke. Then the AIs adopted it. Then everything else followed."*

genz++ is a programming language that was never supposed to exist. It uses emoji comments, sparkle-delimited strings, and keywords that sound like a group chat. It is, against all odds, Turing complete.

You're looking at the canonical runtime as described in the short story [**"The Last Programmer"**](https://whoseideawasthis.substack.com/p/the-last-programmer) — in which a backend engineer named Marcus Webb wakes from a 24-year coma to discover that the entire world's software infrastructure now runs on genz++, and nothing works.

This is that language. It works. Mostly.

## Quick Start

```bash
# run a program
node genz.js examples/hello_world.genz

# start the REPL
node genz.js

# pipe code in
echo 'spill ✨hello world✨' | node genz.js
```

No dependencies. Just Node.js. The way the founders intended.

## Hello World

```
spill ✨hello world✨
```

That's it. The sparkles are not optional.

## A Slightly More Involved Example

```
💀 fizzbuzz but make it gen-z

yeet i = 1
vibe check i <= 100 tho
    sus i % 15 be 0 tho
        spill ✨FizzBuzz fr fr✨
    nah sus i % 3 be 0 tho
        spill ✨Fizz✨
    nah sus i % 5 be 0 tho
        spill ✨Buzz✨
    nah
        spill i
    bet
    yeet i = i + 1
bet
```

If you can read that, you might be the last programmer.

## Language Overview

| genz++         | what it does          | what you're used to    |
|----------------|-----------------------|------------------------|
| `yeet x = 5`  | declare a variable    | `let x = 5`           |
| `spill x`     | print                 | `console.log(x)`      |
| `sus x tho`   | if                    | `if (x) {`            |
| `nah`          | else                  | `} else {`            |
| `bet`          | end block             | `}`                    |
| `vibe check`   | while loop            | `while`                |
| `bruh fn() tho`| function              | `function fn() {`     |
| `its giving x` | return                | `return x`             |
| `plug in math` | import module         | `require('math')`     |
| `💀 text`      | comment               | `// text`              |
| `✨text✨`      | string                | `"text"`               |
| `👀 ✨prompt✨` | input                 | `readline(prompt)`     |
| `💯`           | true                  | `true`                 |
| `🧢`           | false                 | `false`                |
| `ghosted`      | null                  | `null`                 |

## Standard Library

Import modules with `plug in`. All 12 of them.

| Module      | What It Is                              | Vibe                                |
|-------------|-----------------------------------------|-------------------------------------|
| `math`      | Numbers, trig, constants                | `math.periodt()` returns π          |
| `tea`       | String manipulation                     | spill the tea on your strings       |
| `random`    | RNG, shuffles, UUIDs                    | `random.flip()` for coin tosses     |
| `list`      | Array operations                        | push, pop, sort, the whole era      |
| `time`      | Dates, timestamps, sleeping             | `time.nap(1000)` sleeps 1 second    |
| `convert`   | Type coercion, JSON                     | `convert.to_json(x)` does the thing |
| `net`       | HTTP requests (wraps fetch)             | `net.get(url)` is your friend       |
| `obj`       | Key-value object manipulation           | `obj.from(✨k✨, v)` for objects     |
| `env`       | Environment variables                   | `env.get(✨PATH✨)` reads $PATH      |
| `drip`      | Terminal colors & styles                | 20 named colors, styles, rainbow    |
| `loading`   | Animated spinners                       | 6 styles including emoji rotation   |
| `debug`     | Type checking & inspection              | `debug.type_check(x)` tells you     |

## The Adventure Game

The repo includes an infinite, AI-powered choose-your-own-adventure game where you play as Marcus Webb. It's written in genz++ and calls the Claude API. This is the inception — the language from the story running the story itself.

```bash
ANTHROPIC_API_KEY=sk-ant-... node genz.js examples/adventure.genz
```

## Install

### npm (global)

```bash
npm install -g genz-lang
```

Now you can run `genz` from anywhere:

```bash
genz examples/hello_world.genz
genz                              # starts the REPL
genz --version
```

### Run without installing

```bash
npx genz-lang examples/hello_world.genz
```

### Make .genz files executable

Add the shebang to the top of your file:

```
#!/usr/bin/env genz
spill ✨i am a real program now✨
```

Then `chmod +x` it and run it directly:

```bash
chmod +x my_script.genz
./my_script.genz
```

## VS Code Extension

Syntax highlighting, a dark theme, and snippets. See [`vscode-genz/`](vscode-genz/) for the full extension.

### Quick install

```bash
cd vscode-genz
npm install -g @vscode/vsce    # if you don't have vsce
vsce package                   # creates genz-lang-1.0.0.vsix
code --install-extension genz-lang-1.0.0.vsix
```

You get: syntax highlighting for all keywords and emoji tokens, the "genz++ Dark (The Last Programmer)" color theme, 13 code snippets (type `bruh` + tab for a function, `sus` + tab for an if, etc.), auto-closing sparkle strings, and code folding between `tho` and `bet`.

## File Extensions

`.genz` or `.gz` — yes, we know about gzip, and no, we do not care.

## Error Messages

They look like this:

```
💀 ERROR: That's not valid bestie 💀
💀 ERROR: You forgot the closing ✨ bestie
💀 ERROR: Method 'yolo' doesn't exist on 'math'. Not valid bestie 💀
```

They are not configurable. You will be called bestie.

## Full Documentation

- **[LANGUAGE.md](LANGUAGE.md)** — Complete language reference. Every keyword, operator, and module documented.
- **[EXAMPLES.md](EXAMPLES.md)** — Annotated walkthrough of all example programs.
- **[vscode-genz/README.md](vscode-genz/README.md)** — VS Code extension docs.

## Requirements

- Node.js >= 18
- That's it
- No, seriously, that's the whole dependency list
- The runtime is one file
- Zero npm dependencies

## Contributing

This language was a hackathon joke. If you're contributing to it, something has gone wrong in your life, and we support you unconditionally.

## License

MIT. Use it for whatever. If genz++ ends up running critical infrastructure, that's a you problem.
