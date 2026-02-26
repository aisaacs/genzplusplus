# 💀 genz++ Language Reference

> *A complete guide to the language the AIs chose. We don't know why either.*
>
> Based on the language from [**"The Last Programmer"**](https://whoseideawasthis.substack.com/p/the-last-programmer).

## Table of Contents

1. [Syntax Fundamentals](#syntax-fundamentals)
2. [Variables](#variables)
3. [Types](#types)
4. [Operators](#operators)
5. [Control Flow](#control-flow)
6. [Functions](#functions)
7. [Arrays](#arrays)
8. [Objects](#objects)
9. [Input / Output](#input--output)
10. [Modules](#modules)
11. [Standard Library Reference](#standard-library-reference)

---

## Syntax Fundamentals

### Comments

Comments start with 💀 and go to the end of the line. There is no multi-line comment syntax because if your comment needs more than one line, you should reconsider writing it.

```
💀 this is a comment
💀 the skull is load-bearing. do not remove it.
spill ✨hello✨  💀 inline comments work too
```

### Strings

Strings are wrapped in ✨sparkles✨. They support multi-line content, which means you can write an entire novel between two sparkles if you hate yourself.

```
yeet name = ✨marcus✨
yeet speech = ✨this is a
multi-line string and
the parser is fine with it✨
```

There are no escape characters. There is no way to put a ✨ inside a string. This is a known limitation that we have chosen to describe as a "feature of the type system."

### Semicolons

There are no semicolons. Statements are separated by newlines. You're welcome.

### Blocks

Blocks are opened by `tho` and closed by `bet`. Every `sus`, `vibe check`, and `bruh` needs a `tho` to open and a `bet` to close (unless an `nah` is handling the else branch). Think of `tho` as `{` and `bet` as `}`, but with more personality.

---

## Variables

Declare variables with `yeet`. Assign to existing variables with `yeet` too. The language does not distinguish between declaration and reassignment because commitment is hard.

```
yeet x = 42
yeet name = ✨marcus✨
yeet alive = 💯
yeet brain_cells = ghosted

💀 reassignment
yeet x = x + 1
```

Variables are lexically scoped. A variable declared inside a block is local to that block. A `yeet` to an existing outer variable updates the outer one instead of shadowing it, because shadowing is for cowards and also caused an infinite loop bug that took us four hours to fix.

---

## Types

genz++ has five types. That's enough.

| Type      | Syntax              | Notes                                        |
|-----------|---------------------|----------------------------------------------|
| Number    | `42`, `3.14`, `-7`  | All numbers are floats. JavaScript made us do this. |
| String    | `✨hello✨`          | Sparkle-delimited. Non-negotiable.           |
| Boolean   | `💯` / `🧢`         | Also accepted: `no cap` (true), `cap` (false) |
| Null      | `ghosted`           | The value left you on read.                  |
| Array     | `[1, 2, 3]`        | Zero-indexed. Can hold mixed types.          |

### Truthiness

The following values are falsy: `🧢`, `ghosted`, `0`, and the empty string `✨✨`. Everything else is truthy, including empty arrays, because life isn't fair.

---

## Operators

### Arithmetic

```
yeet a = 10 + 3     💀 13
yeet b = 10 - 3     💀 7
yeet c = 10 * 3     💀 30
yeet d = 10 / 3     💀 3.333...
yeet e = 10 % 3     💀 1
yeet f = -a         💀 -13
```

The `+` operator is overloaded, as is tradition. Numbers add, strings concatenate, and arrays concatenate. If one side is a string and the other isn't, you get string concatenation. If you add a number to an array, the number gets appended. We're sorry.

```
yeet x = ✨hello ✨ + ✨world✨      💀 "hello world"
yeet y = [1, 2] + [3, 4]            💀 [1, 2, 3, 4]
yeet z = [1, 2] + 3                 💀 [1, 2, 3]
```

### Comparison

```
yeet a = x be 5      💀 equality (==)
yeet b = x aint 5    💀 inequality (!=)
yeet c = x > 5       💀 greater than
yeet d = x < 5       💀 less than
yeet e = x >= 5      💀 greater or equal
yeet f = x <= 5      💀 less or equal
```

Note: it's `be`, not `==`. And `aint`, not `!=`. The vibes demanded it.

### Logical

```
yeet a = x > 0 and x < 10
yeet b = name be ✨marcus✨ or name be ✨webb✨
yeet c = not alive
```

---

## Control Flow

### If / Else If / Else

```
sus temperature > 100 tho
    spill ✨the coffee machine is doing that thing again✨
nah sus temperature < 0 tho
    spill ✨the AC has achieved sentience and chosen violence✨
nah
    spill ✨somehow, normal✨
bet
```

`sus` is "if." `nah` is "else." `nah sus` on the same line is "else if." `tho` opens the block. `bet` closes the whole structure. If you forget the `bet`, the parser will call you bestie in the error message.

### While Loop

```
yeet i = 0
vibe check i < 10 tho
    spill i
    yeet i = i + 1
bet
```

`vibe check` is "while." There is no for loop. If you want a for loop, write a while loop and pretend. Marcus Webb has been asking about for loops since he woke up and everyone keeps telling him "we don't do that here."

### Early Return

There is no `break` or `continue`. To exit a loop early, you can set the loop condition to false, or restructure your code, or question why you're writing genz++ in the first place.

---

## Functions

### Declaration

```
bruh add(a, b) tho
    its giving a + b
bet

bruh greet(name) tho
    spill ✨hey ✨ + name + ✨ what's good✨
bet
```

`bruh` declares a function. `its giving` returns a value. If you don't `its giving` anything, the function returns `ghosted`.

### Calling

```
yeet result = add(3, 4)
greet(✨marcus✨)
```

### Recursion

Yes, it works. No, there's no tail call optimization.

```
bruh factorial(n) tho
    sus n <= 1 tho
        its giving 1
    bet
    its giving n * factorial(n - 1)
bet
```

### Closures

Functions capture their enclosing scope. This means you can write closures, which is impressive for a language that started as a hackathon joke.

---

## Arrays

### Creation

```
yeet empty = []
yeet nums = [1, 2, 3, 4, 5]
yeet mixed = [✨hello✨, 42, 💯, ghosted]
```

### Access & Assignment

```
yeet first = nums[0]        💀 1
yeet last = nums[4]         💀 5
yeet nums[0] = 99           💀 mutation happens
```

### Length

```
yeet len = nums.length       💀 5
yeet str_len = ✨hello✨.length  💀 but actually no, use tea.spill_length()
```

The `.length` property works on arrays and strings via method access. For more array operations, see the `list` module.

### Concatenation

```
yeet a = [1, 2] + [3, 4]    💀 [1, 2, 3, 4]
yeet b = [1, 2] + 3         💀 [1, 2, 3]
```

---

## Objects

Objects are created and manipulated through the `obj` module. There is no object literal syntax because the sparkle budget was already spent on strings.

```
plug in obj

yeet person = obj.cook(
    ✨name✨, ✨marcus✨,
    ✨age✨, 48,
    ✨status✨, ✨confused✨
)

spill obj.peep(person, ✨name✨)   💀 marcus
spill person.name                  💀 also marcus (property access)
spill person.status                💀 confused (understandably)
```

Chained property access works: `response.body.content[0].text` is valid and will haunt your dreams.

---

## Input / Output

### Output

`spill` prints to stdout with a newline.

```
spill ✨hello world✨
spill 42
spill ✨the answer is ✨ + 42
```

### Input

`👀` reads a line from stdin. You can provide a prompt string.

```
yeet name = 👀 ✨what is your name? ✨
yeet age = 👀 ✨how old are you? ✨
```

Note: if the input looks like a number, it's automatically converted to a number. If you type `42`, you get the number `42`, not the string `"42"`. This is either a feature or a bug depending on your mood. To force a string, concatenate with an empty string: `✨✨ + age`.

---

## Modules

Import standard library modules with `plug in`.

```
plug in math
plug in tea
plug in random

spill math.periodt()         💀 3.141592653589793
spill tea.yell(✨hello✨)     💀 HELLO
spill random.pick(1, 100)    💀 some number, who knows
```

You can only import built-in modules. There is no user-defined module system. If your genz++ project is big enough to need one, we have questions.

---

## Standard Library Reference

### math — *numbers be mathing*

The math module has opinions about function names.

| Method | What It Does | Why It's Named That |
|--------|-------------|---------------------|
| `ate(x)` | Absolute value | It ate. It devoured. Always positive. |
| `glow_up(x)` | Ceiling | Going up, glowing up |
| `humbled(x)` | Floor | Brought down. Humbled. |
| `snatched(x)` | Round | Looking clean, snatched |
| `main_character(a, b, ...)` | Max | Main character energy — the biggest |
| `npc(a, b, ...)` | Min | NPC behavior — background, smallest |
| `glow(x)` | Square root | Inner glow |
| `periodt()` | π (3.14159...) | Period. Periodt. No further discussion. |
| `era()` | Euler's *e* (2.71828...) | It's giving euler era |
| `power_move(base, exp)` | Exponentiation | A power move |
| `lowkey(x)` | Natural log (ln) | Lowkey |
| `highkey(x)` | Log base 10 | Highkey |
| `vibes(x)` | Sine | Wavy vibes |
| `waves(x)` | Cosine | Making waves |
| `ratio(a, b)` | Division | Ratio'd |
| `valid(x)` | isFinite + !isNaN | Check if the number is valid |
| `sign_check(x)` | Sign (-1, 0, 1) | Checking the vibes |
| `clamp(x, min, max)` | Clamp to range | Keep it in range bestie |

### tea — *string utilities (spill the tea)* 🍵

| Method | What It Does |
|--------|-------------|
| `yell(s)` | YELLING (uppercase) |
| `whisper(s)` | whispering (lowercase) |
| `spill_length(s)` | String length |
| `sip(s, start, end)` | Substring/slice |
| `has_tea(s, sub)` | Contains check |
| `shatter(s, delim)` | Shatter into array |
| `detox(s)` | Detox whitespace |
| `plot_twist(s)` | Reverse the string |
| `opens_with(s, prefix)` | Opens with check |
| `closes_with(s, suffix)` | Closes with check |
| `swap(s, old, new)` | Swap first occurrence |
| `swap_all(s, old, new)` | Swap all occurrences |
| `spam(s, n)` | Spam it n times |
| `fluff_left(s, len, char)` | Fluff the start |
| `fluff_right(s, len, char)` | Fluff the end |
| `peek(s, i)` | Peek at character |
| `stalk(s, sub)` | Stalk index (-1 if not found) |
| `stalk_last(s, sub)` | Stalk last index |
| `link_up(a, b, ...)` | Link up strings |
| `squad_up(arr, sep)` | Squad up array with separator |
| `cook_num(s)` | Cook string to number |
| `summon(n)` | Summon character from code point |
| `expose(s)` | Expose code point from character |

### random — *chaos module*

| Method | What It Does |
|--------|-------------|
| `pick(min, max)` | Random integer in range (inclusive) |
| `vibe()` | Random float 0–1 |
| `flip()` | 50/50 coin flip |
| `chance(percent)` | True with given percent chance |
| `pick_one(arr)` | Random element from array |
| `shuffle(arr)` | Shuffle array (non-mutating) |
| `uuid()` | Generate a unique ID |

### list — *array operations*

| Method | What It Does |
|--------|-------------|
| `spawn(a, b, ...)` | Spawn array from arguments |
| `yeet_in(arr, item, ...)` | Yeet in at the end |
| `yeet_out(arr)` | Yeet out the last element |
| `boot(arr)` | Boot the first element |
| `cut_in(arr, item, ...)` | Cut in at the start |
| `yoink(arr, index)` | Remove at index |
| `sneak_in(arr, index, item)` | Sneak in at index |
| `body_count(arr)` | Get the body count (length) |
| `peep(arr, index)` | Peep element (supports negative index) |
| `alpha(arr)` | The alpha (first element) |
| `omega(arr)` | The omega (last element) |
| `snag(arr, start, end)` | Snag a portion |
| `collab(a, b, ...)` | Collab arrays together |
| `claims(arr, item)` | Claims membership |
| `where_at(arr, item)` | Where it's at (find index) |
| `plot_twist(arr)` | Plot twist (reverse, non-mutating) |
| `rank(arr)` | Rank numerically |
| `abc(arr)` | ABC order (sort alphabetically) |
| `no_dupes(arr)` | No dupes allowed |
| `unbox(arr)` | Unbox nested arrays |
| `mint(length, value)` | Mint a filled array |
| `range(start, end, step)` | Generate numeric range |
| `total(arr)` | Total all elements |
| `mid(arr)` | The mid (average) |
| `tally(arr, item)` | Tally occurrences |

### time — *temporal operations*

| Method | What It Does |
|--------|-------------|
| `nap(ms)` | Sleep for ms milliseconds (async) |
| `wait(ms)` | Alias for nap |
| `rn()` | Current timestamp in milliseconds |
| `vibes()` | Current time as a readable string |
| `today()` | Current date as a readable string |
| `year()` | Current year |
| `month()` | Current month (1-12) |
| `day()` | Day of month |
| `weekday()` | Day name (Monday, etc.) |
| `hour()` | Hour (0-23) |
| `minute()` | Minute (0-59) |
| `second()` | Second (0-59) |
| `receipts()` | Unix timestamp in seconds (the receipts) |

### convert — *type coercion*

| Method | What It Does |
|--------|-------------|
| `cook_num(x)` | Cook it to a number |
| `cook_int(x)` | Cook it to an integer |
| `cook_str(x)` | Cook it to a string |
| `cook_bool(x)` | Cook it to a boolean |
| `cook_list(x)` | Cook it to an array |
| `unjson(s)` | Unjson a JSON string |
| `jsonify(x)` | Jsonify to JSON |
| `jsonify_pretty(x)` | Jsonify with indentation |

### net — *HTTP client*

All methods are async (the interpreter handles this automatically).

| Method | What It Does |
|--------|-------------|
| `yoink(url)` | Yoink data (GET, returns parsed JSON) |
| `yoink_text(url)` | Yoink text (GET, returns raw text) |
| `yoink_json(url)` | Yoink JSON (GET, returns parsed JSON alias) |
| `shoot(url, body)` | Shoot a POST (JSON), returns parsed response |
| `shoot_text(url, body)` | Shoot text (POST text body) |
| `glow_up(url, body)` | Glow up (PUT JSON) |
| `ghost(url)` | Ghost (DELETE request) |
| `tweak(url, body)` | Tweak it (PATCH JSON) |
| `full_send(url, method, headers, body)` | Full send — custom method, headers, body |
| `vibe_check(url)` | Vibe check the HTTP status code |
| `link_up(base, params)` | Link up URL with query parameters |

The `full_send` method returns an object with `.status` and `.body` properties. The `ghost` method is called `ghost` because `delete` is too many syllables and `yeet` was already taken.

### obj — *key-value objects*

| Method | What It Does |
|--------|-------------|
| `spawn()` | Spawn empty object |
| `cook(k1, v1, k2, v2, ...)` | Cook from alternating key-value pairs |
| `slap(o, key, val)` | Slap a property on |
| `peep(o, key)` | Peep a property |
| `keys(o)` | Get all keys as array |
| `goods(o)` | Get all the goods (values) |
| `got(o, key)` | Got that key? |
| `yeet(o, key)` | Yeet a property |
| `mashup(a, b)` | Mashup two objects |
| `dupe(o)` | Dupe it (shallow copy) |
| `rundown(o)` | Get the rundown ([key, value] pairs) |

### env — *environment variables*

| Method | What It Does |
|--------|-------------|
| `peep(key)` | Peep an environment variable (or ghosted) |
| `got(key)` | Got that env var? |

### drip — *terminal colors & styles* 🎨

The drip module makes your terminal output look presentable. Or at least colorful.

**Text Colors:** `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, `orange`, `pink`, `purple`, `lime`, `teal`, `coral`, `gold`, `lavender`, `mint`, `rose`, `sky`, `peach`

**Background Colors:** `bg_red`, `bg_green`, `bg_yellow`, `bg_blue`, `bg_magenta`, `bg_cyan`, `bg_white`

**Styles:** `bold`, `dim`, `italic`, `underline`, `strike`, `inverse`

**Advanced:**

| Method | What It Does |
|--------|-------------|
| `color(s, code)` | 256-color mode (code 0–255) |
| `bg_color(s, code)` | 256-color background |
| `rgb(s, r, g, b)` | True RGB color |
| `bg_rgb(s, r, g, b)` | True RGB background |
| `raw(code)` | Raw ANSI escape code |
| `reset()` | Reset all formatting |
| `cleanse(s)` | Cleanse all ANSI codes |
| `rainbow(s)` | The text is a rainbow now |

All drip methods are composable. Stack them:

```
spill drip.bold(drip.red(✨CRITICAL ERROR✨))
spill drip.italic(drip.cyan(✨just vibing✨))
spill drip.underline(drip.gold(✨important✨))
```

### loading — *animated spinners* ⏳

For when your program needs to pretend it's doing something important.

| Method | What It Does |
|--------|-------------|
| `spin_up(message, style)` | Spin up an animated spinner |
| `wind_down(message)` | Wind down the spinner and print a final message |
| `styles()` | List available spinner styles |

**Spinner Styles:**

| Style | Frames | Vibe |
|-------|--------|------|
| `dots` | `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` | Professional. Restrained. |
| `braille` | `⣾⣽⣻⢿⡿⣟⣯⣷` | Like dots but fancier |
| `vibes` | `💀✨💅🔥👀💯🧠⚡` | The genz++ default experience |
| `moon` | `🌑🌒🌓🌔🌕🌖🌗🌘` | Lunar loading |
| `clock` | `🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛` | Time is passing |
| `bars` | `▏▎▍▌▋▊▉█▉▊▋▌▍▎` | Pulsing bar |

```
plug in loading
plug in time

loading.spin_up(✨thinking...✨, ✨vibes✨)
time.nap(3000)
loading.wind_down(✨done thinking. the answer is 42.✨)
```

### screen — *terminal pixel canvas*

The screen module lets you draw pixels in the terminal. It's like a GPU but for people who think 80x24 is a resolution.

| Method | What It Does |
|--------|-------------|
| `spawn(cols, rows, title)` | Spawn a screen buffer (title optional) |
| `ink(scr, x, y, char)` | Ink a pixel |
| `peep(scr, x, y)` | Peep at a pixel |
| `cleanse(scr)` | Cleanse the screen |
| `strut(scr, x0, y0, x1, y1, char)` | Strut a line |
| `fit(scr, x, y, w, h, char)` | Fit a box outline |
| `drip(scr, x, y, w, h, char)` | Drip a filled box |
| `halo(scr, cx, cy, r, char)` | Halo (circle outline) |
| `aura(scr, cx, cy, r, char)` | Aura (filled circle) |
| `stan(scr, str, x, y)` | Stan text onto screen |
| `flaunt(scr)` | Flaunt it (render to terminal) |
| `boot()` | Boot the terminal (raw mode) |
| `unalive()` | Unalive the terminal (restore) |
| `snapshot(scr, path)` | Snapshot to PPM file |
| `cols()` | Get terminal column count |
| `rows()` | Get terminal row count |

```
plug in screen

yeet s = screen.spawn(40, 20)
screen.drip(s, 5, 5, 10, 8, ✨#✨)
screen.halo(s, 20, 10, 6, ✨*✨)
screen.stan(s, ✨genz++✨, 2, 1)
screen.flaunt(s)
```

### keys — *keyboard input*

Listen for keypresses without waiting for enter. The terminal becomes your instrument.

| Method | What It Does |
|--------|-------------|
| `tune_in()` | Tune in (start listening for keys) |
| `tune_out()` | Tune out (stop listening) |
| `pressed(key)` | Check if key is pressed |
| `forget()` | Forget all pressed keys |
| `latest()` | Get the latest key pressed |
| `vibing()` | Any key vibing? (any key pressed) |

```
plug in keys

keys.tune_in()
spill ✨press any key bestie✨
vibe check not keys.vibing() tho
    💀 waiting
bet
spill ✨you pressed: ✨ + keys.latest()
keys.tune_out()
```

### canvas — *HTML5-style drawing*

The canvas module brings fancy drawing primitives. Think HTML5 canvas but make it gen-z.

| Method | What It Does |
|--------|-------------|
| `vibe(w, h)` | Set up the canvas vibe |
| `sauce(r, g, b, a)` | Set fill sauce (color) |
| `edge(r, g, b, a)` | Set edge (stroke) color |
| `thicc(w)` | Set line thiccness |
| `fit(x, y, w, h)` | Fit a box outline |
| `drip(x, y, w, h)` | Drip a filled box |
| `halo(cx, cy, r)` | Halo (circle outline) |
| `aura(cx, cy, r)` | Aura (filled circle) |
| `strut(x0, y0, x1, y1)` | Strut a line |
| `caption(str, x, y)` | Caption text |
| `triangle(x1, y1, x2, y2, x3, y3)` | Triangle outline |
| `slay_triangle(x1, y1, x2, y2, x3, y3)` | Slay a filled triangle |
| `polygon(points)` | Polygon outline |
| `slay_polygon(points)` | Slay a filled polygon |
| `arc(cx, cy, r, start, end)` | Arc outline |
| `slay_arc(cx, cy, r, start, end)` | Slay a filled arc |
| `pill(x, y, w, h, r)` | Pill outline (rounded rect) |
| `slay_pill(x, y, w, h, r)` | Slay a filled pill |
| `ombre(x0, y0, x1, y1, colors)` | Ombre gradient |
| `cleanse()` | Cleanse the canvas |
| `checkpoint()` | Checkpoint (save state) |
| `respawn()` | Respawn (restore state) |
| `spin(angle)` | Spin (rotate) |
| `slide(x, y)` | Slide (translate) |
| `zoom(sx, sy)` | Zoom (scale) |
| `ghostly(a)` | Set ghostly opacity |
| `serve()` | Serve the canvas (output) |

### gpu — *native SDL2 window rendering*

The gpu module spawns a real native window using SDL2. This is genz++ escaping the terminal. Requires `npm install koffi` and SDL2 installed on your system.

| Method | What It Does |
|--------|-------------|
| `gpu.spawn(w, h, title)` | Spawn a native SDL2 window |
| `w.serve()` | Poll events, returns false on window close |
| `w.pressed(key)` | Check if key is held |
| `w.ink(x, y, r, g, b)` | Ink a pixel |
| `w.cleanse(r, g, b)` | Cleanse (clear/fill buffer) |
| `w.strut(x0, y0, x1, y1, r, g, b)` | Strut a bresenham line |
| `w.fit(x, y, w, h, r, g, b)` | Fit a rect outline |
| `w.drip(x, y, w, h, r, g, b)` | Drip a filled rect |
| `w.halo(cx, cy, r, r, g, b)` | Halo (circle outline) |
| `w.aura(cx, cy, r, r, g, b)` | Aura (filled circle) |
| `w.stan(str, x, y, r, g, b)` | Stan text (3x5 font, scale param) |
| `w.flaunt()` | Flaunt (upload texture + present frame) |
| `w.chill(ms)` | Chill for ms milliseconds |
| `w.unalive()` | Unalive the window (cleanup/destroy) |

**Supported keys:** a-z, 0-9, up/down/left/right, esc, space, enter, tab, backspace

```
plug in gpu

yeet w = gpu.spawn(800, 600, ✨my window✨)

vibe check w.serve() tho
    sus w.pressed(✨esc✨) tho
        dip
    bet
    w.cleanse(0, 0, 0)
    w.drip(100, 100, 200, 150, 255, 0, 128)
    w.stan(✨genz++ gpu✨, 120, 50, 255, 255, 255)
    w.flaunt()
bet

w.unalive()
```

### debug — *inspection tools*

| Method | What It Does |
|--------|-------------|
| `type_check(x)` | Returns type name: `number`, `string`, `boolean`, `list`, `ghosted` |
| `is_valid(x)` | Not null/undefined |
| `is_num(x)` | Is a number |
| `is_str(x)` | Is a string |
| `is_bool(x)` | Is a boolean |
| `is_list(x)` | Is an array |
| `is_ghosted(x)` | Is null |
| `inspect(x)` | Prints value with type info and returns it |

---

## REPL Mode

Run `node genz.js` with no arguments to enter the REPL.

```
$ node genz.js
genz++ v1.0 💀 type "bet" to exit
genz> spill ✨hello✨
hello
genz> yeet x = 42
genz> spill x * 2
84
genz> bet
✨ later bestie ✨
```

Multi-line statements are supported — the REPL detects incomplete blocks and waits for more input with a `...` prompt.

---

## Error Messages

genz++ error messages are informative, firm, and supportive.

```
💀 ERROR: Unterminated string on line 5. You forgot the closing ✨ bestie
💀 ERROR: Method 'yolo' doesn't exist on 'math'. Not valid bestie 💀
💀 ERROR: Can't access property 'name' on ghosted... that's ghosted bestie 💀
💀 ERROR: Division by zero on line 12. The vibes are not it 💀
```

They will always call you bestie. This is not configurable.
