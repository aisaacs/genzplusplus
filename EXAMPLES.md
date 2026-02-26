# 💀 genz++ Examples

> *A guided tour of 16 example programs, from "hello world" to "infinite AI-powered text adventure." The difficulty curve is not gentle.*

All examples live in the `examples/` directory. Run any of them with:

```bash
node genz.js examples/hello_world.genz
```

---

## 🟢 Beginner: The Fundamentals

### hello_world.genz

**Concepts:** output, strings

The simplest genz++ program. Two lines. No imports. No variables. Just vibes.

```
spill ✨hello world✨
spill ✨this is genz++ and its giving everything✨
```

If this doesn't work, something is very wrong with your Node.js installation, your universe, or both.

### guess.gz

**Concepts:** input, variables, while loops, if/else

A number guessing game that uses the `.gz` file extension because we refuse to acknowledge that gzip exists.

```
yeet secret = 7
yeet guess = ghosted

vibe check guess aint secret tho
    yeet guess = 👀 ✨guess a number bestie✨
    sus guess be secret tho
        spill ✨SLAY you got it✨
    nah sus guess > secret tho
        spill ✨too big chief✨
    nah
        spill ✨too smol✨
    bet
bet

spill ✨gg no cap✨
```

Things to notice: `vibe check` is a while loop. `sus` is if. `nah sus` is else-if. The `👀` emoji reads user input. The secret number is hardcoded to 7 because randomization is for people with functional software.

### fizzbuzz.genz

**Concepts:** modulo, nested if/else, string concatenation

The classic interview question, which the AIs in 2045 still use to interview each other.

```
yeet i = 1
vibe check i <= 30 tho
    sus i % 15 be 0 tho
        spill ✨✨ + i + ✨: FizzBuzz slay 💅✨
    nah sus i % 3 be 0 tho
        spill ✨✨ + i + ✨: Fizz no cap✨
    nah sus i % 5 be 0 tho
        spill ✨✨ + i + ✨: Buzz fr fr✨
    nah
        spill i
    bet
    yeet i = i + 1
bet
```

Note the `✨✨ + i` pattern — that's empty string concatenation to coerce a number into a string for joining. The `%` operator works exactly like you'd expect. The editorial commentary on each output ("slay 💅", "no cap", "fr fr") was not requested by anyone.

---

## 🟡 Intermediate: Functions & Data Structures

### fibonacci.genz

**Concepts:** recursion, functions, return values

Recursive fibonacci with no memoization, because performance is a myth.

```
bruh fib(n) tho
    sus n <= 1 tho
        its giving n
    bet
    its giving fib(n - 1) + fib(n - 2)
bet

yeet i = 0
vibe check i < 15 tho
    spill ✨fib(✨ + i + ✨) = ✨ + fib(i)
    yeet i = i + 1
bet
```

`bruh` declares a function. `its giving` returns a value. The function calls itself. The stack grows. Your patience wanes. But it works, and it prints the first 15 Fibonacci numbers.

### sort.genz

**Concepts:** array indexing, mutation, nested loops, the list module

Bubble sort implemented with array index access (`arr[j]`), element swapping, and the `.length` property.

```
bruh bubbleSort(arr) tho
    yeet n = arr.length
    yeet i = 0
    vibe check i < n tho
        yeet j = 0
        vibe check j < n - i - 1 tho
            sus arr[j] > arr[j + 1] tho
                yeet temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            bet
            yeet j = j + 1
        bet
        yeet i = i + 1
    bet
    its giving arr
bet
```

Arrays are zero-indexed and mutable. `arr[j] = value` works for assignment. There's no for loop, so you get nested `vibe check` loops instead, which reads like an increasingly agitated programmer muttering "vibe check" under their breath.

The example also demonstrates `list.abc()` for when you'd rather not implement sorting yourself, which is always.

### magic8ball.genz

**Concepts:** multiple modules, random selection, conditional bonus content

A magic 8-ball that gives gen-z responses to your questions. Demonstrates importing and using multiple modules together (`random`, `tea`, `list`, `time`), using `random.pick_one()` to select from an array, and a 30% chance of bonus wisdom via `random.chance(30)`.

Sample responses include "absolutely slay", "thats giving no", and "the spirits say slay." The oracle has spoken.

---

## 🔴 Advanced: The Systems Marcus Found in 2045

These examples are the programs from [the story](https://whoseideawasthis.substack.com/p/the-last-programmer). They simulate the broken infrastructure that Marcus Webb encountered when he woke from his 24-year coma. Each one captures a specific disaster.

### doTheThing.genz

**Concepts:** function chains, the mystery of software that works for no reason

The legendary function chain that 7 billion devices call daily:

```
bruh okayActuallyDoIt() tho
    its giving ✨mystery✨
bet

bruh doTheOtherThing() tho
    yeet result = okayActuallyDoIt()
    sus result be ✨mystery✨ tho
        its giving result
    bet
    💀 this line has never executed in production. ever.
    its giving ✨not mystery (this should never happen)✨
bet

bruh doTheThing() tho
    yeet answer = doTheOtherThing()
    its giving answer
bet
```

Three functions. The deepest one returns a hardcoded string. The middle one checks if the string is what it always is and passes it through. The outer one calls the middle one. The entire global infrastructure depends on this chain. Nobody knows why. Nobody touches it.

The example runs it 10 times and reports a success rate, which is always 10/10, which is somehow more unsettling than if it occasionally failed.

### parallel_parking.genz

**Concepts:** simulation loops, random behavior, convergence that never converges

The self-driving car that gets very close to parallel parking, then inexplicably jerks three feet to the left.

The core mechanic: the car moves 40% closer to the target each iteration. When it gets within tolerance, there's a 75% chance of the infamous jerk. Only a 25% chance of actually parking. The simulation runs for 20 attempts.

```
sus dist_x <= tolerance and dist_y <= tolerance tho
    sus random.chance(75) tho
        yeet jerk = random.pick(2, 5)
        car_x = car_x - jerk
        💀 (nobody knows why this happens)
    nah
        yeet parked = 💯
    bet
bet
```

A small crowd gathers to watch. Not because it's unusual, but because it's Tuesday and there's nothing else to do.

### smart_bed.genz

**Concepts:** time simulation, nested conditionals, the bug that never gets fixed

Simulates 24 hours of a hospital smart bed that folds Marcus into "Day Mode" whenever light hits the photosensor at a specific angle — specifically between intensity 42 and 69 (because of course those numbers).

The bed has three states: working correctly (rare), folding the patient (common), and confused (more common than you'd like). The bug report has been filed. The bug report resolution is `ghosted`.

### coffee_machine.genz

**Concepts:** random selection from arrays, temperature as an abstract concept

The rehabilitation center's coffee machine that "dispensed liquid at temperatures that seemed to be selected by consulting an ouija board."

Each cup is randomly assigned a beverage (usually coffee, occasionally gazpacho, sometimes "mystery liquid"), a temperature between 1°F and 500°F, and a description like "temperature of the sun's corona" or "coffee-flavored ice cube."

The bug report has been filed. With the hollow optimism of someone who has filed many bug reports and seen none of them resolved.

### pillz_go_brrr.genz

**Concepts:** functions with parameters, weight-based calculations, the mystery function

The hospital medication dispensary system, co-authored by claude-7.2 and gemini-12 in 2033. Features `mysteryFunction()` — a function that does nothing, takes no inputs, produces no outputs, yet without it everything divides by zero. They call it "the anchor."

The original bug was a hardcoded 1.7x dosage modifier that nobody could explain. Marcus fixed it. The mystery function remains. We don't ask questions.

### pathfinding.genz

**Concepts:** graph traversal (BFS), complex data structures, arrays of arrays

A breadth-first search implementation for the Pacific Northwest transportation grid. Demonstrates building a graph as an adjacency list (arrays of `[node, [neighbors]]` pairs), implementing BFS with a manually-managed queue (no shift — the queue is rebuilt each iteration), and visited tracking.

The comments are in the voice of an AI that doesn't fully understand its own code: "idk why this works but it does" and "this is where it gets sus fr fr." The function finds paths from downtown Seattle to Ballard, which in real life also takes approximately forever.

---

## ✨ Showcase: Colors, Spinners, HTTP, and GPU

### color_demo.genz

**Concepts:** the drip module, the loading module, terminal aesthetics

A comprehensive demo of the `drip` module's 20 named colors (red through peach), 6 text styles (bold through inverse), composability (`drip.bold(drip.red(✨text✨))`), background colors, and `drip.rainbow()`.

Also demos all three spinner styles from the `loading` module — `vibes` (emoji rotation), `moon` (lunar phases), and `dots` (the professional one).

```bash
node genz.js examples/color_demo.genz
```

Run this one in a proper terminal. It's worth it.

### net_test.genz

**Concepts:** HTTP requests, JSON parsing, error handling, the net module

Seven tests covering every HTTP method: GET (JSON and text), POST, DELETE (`net.ghost()`), full `net.full_send()` with status and body, status-only checks, and error handling for bad URLs.

Uses httpbin.org as a test target. Demonstrates property access on response objects (`resp.slideshow.title`) and type checking with the debug module.

### gpu_demo.genz

**Concepts:** the gpu module, native window rendering, real-time input, game loop

A bouncing ball and paddle game running in a real native SDL2 window. This is genz++ escaping the terminal. Demonstrates `gpu.spawn()` for window creation, `w.serve()` for the event loop, `w.pressed()` for keyboard input, drawing primitives (`w.cleanse()`, `w.aura()`, `w.drip()`, `w.stan()`), and `w.flaunt()` to present each frame.

Features a starfield background, ball physics with wall bouncing, paddle collision with angle-based deflection, and a score counter. The ball is hot pink. The paddle is electric blue. The vibes are immaculate.

```bash
npm install koffi   # requires SDL2 installed
node genz.js examples/gpu_demo.genz
```

Requires `koffi` (Node.js FFI library) and SDL2 installed on your system. Arrow keys to move, Esc to quit.

---

## 💀 The Final Boss

### adventure.genz

**Concepts:** all of them. every single one.

An infinite, AI-powered choose-your-own-adventure game where you play as Marcus Webb. It calls the Claude API from within genz++. This is the inception — the language from the story running the story itself.

What it demonstrates:

- **Every module working together:** net, obj, convert, env, tea, list, random, drip, loading
- **API integration:** builds HTTP headers and JSON bodies, sends POST requests to the Anthropic Messages API, parses structured responses
- **Conversation history:** maintains a rolling message array for multi-turn dialogue
- **Terminal UI:** gold-colored title box, colored prompts, animated emoji spinner while waiting for the AI
- **Error handling:** graceful fallback when the API is unreachable
- **The system prompt:** a multi-line string (which required adding multi-line string support to the lexer, which is the kind of thing that happens when you build a real application in a joke language)

```bash
ANTHROPIC_API_KEY=sk-ant-... node genz.js examples/adventure.genz
```

The narrator writes in the style of Douglas Adams. Every scene ends with three choices. The story never repeats. Type "bet" to quit, at which point a smart toaster will begin its third attempt to achieve sentience.

---

## Running the Test Suite

```bash
node genz.js examples/test_stdlib.genz
```

This runs tests for all core modules (math, tea, random, list, time, convert, debug). If it ends with "ALL TESTS COMPLETE slay", the vibes are immaculate. If it doesn't, the vibes are catastrophic, and you should probably check what you changed.

---

## Quick Reference: All Examples by Difficulty

| File | Concepts | Lines |
|------|----------|-------|
| `hello_world.genz` | Output | 2 |
| `guess.gz` | Input, loops, conditionals | 15 |
| `fizzbuzz.genz` | Modulo, nested if/else | 15 |
| `fibonacci.genz` | Recursion | 12 |
| `sort.genz` | Arrays, mutation, nested loops | 25 |
| `magic8ball.genz` | Multiple modules, random | 40 |
| `doTheThing.genz` | Function chains, debug module | 55 |
| `parallel_parking.genz` | Simulation, random behavior | 70 |
| `smart_bed.genz` | Time simulation, nested logic | 75 |
| `coffee_machine.genz` | Random arrays, conditionals | 55 |
| `pillz_go_brrr.genz` | Functions, mystery function | 70 |
| `pathfinding.genz` | BFS, graph traversal | 80 |
| `color_demo.genz` | Colors, spinners, terminal UI | 45 |
| `net_test.genz` | HTTP, JSON, error handling | 75 |
| `gpu_demo.genz` | GPU window, game loop, input | 150 |
| `adventure.genz` | Everything | 190 |
| `test_stdlib.genz` | Module testing | 120 |
