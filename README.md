
# typerr

A Puppeteer utility for human-like typing simulation with natural delays, typos and real keyboard events.

## Installation

```bash
npm install typerr
```

## Usage
Quick Start

```ts
import { Keyboard } from 'typerr';

page.click(inputSelector); // Need to focus input before typing

const kb = new Keyboard(page);

await kb.type("Hello world!");
```

## Configuration
When creating a `Keyboard` instance, you need to provide a Puppeteer `page` along with optional configuration settings:

- `page: puppeteer.Page` – Puppeteer page

- `typoProbability?: number` – the probability of making a typo

- `fittsConfig?` – configuration for Fitts’s law delay calculation:

  - `baseDelay?: number` – base delay when moving between keys

  - `distanceFactor?: number` – how strongly distance between keys influences the delay

  - `noise?: number` – random noise factor, this ensures that even if the same key sequence occurs repeatedly, the delay will not be exactly the same every time, creating a more natural typing rhythm

#### Example
```ts
const kb = new Keyboard(page, {
  typoProbability: 0.05,
  fittsConfig: {
    baseDelay: 50,
    distanceFactor: 30,
    noise: 0.1,
  }
});
```

## Methods
`type(value: string)` Types the given string character by character, respecting the configured settings

`isKeyboardInput(char: string)` - checks if the given char exists in keyboardMap

`setLastKey(key: KeyboardChar)` - it is used to set which key was clicked last

> [!TIP]
> You can adjust the starting point for calculating the delay to the target key using the setLastKey function. By default, this starting point is the Space key.
After invoking the type method, the last key becomes the most recently pressed or released modifier key. This key is then used as the reference point for calculating the delay when the type method is called again

`getLastKey` - returns last clicked key

`addCustomKeys(customKeys: CustomKey[])` - this  method allows you to extend the keyboard with custom characters like Polish letters (ą, ć, ę), German umlauts (ä, ö, ü), emoji, or any Unicode symbol

```ts
export interface CustomKey {
  char: string;                    // Required: The character to type
  upperChar?: string;              // Optional: Uppercase version
  baseKey: KeyboardStandaloneChar; // Required: Physical key to press wchich exsists in KeyboardStandaloneChar
  modifiers: KeyboardChar[];       // Required: Modifier keys (can be empty [])
}
```

Fields:

 - `char` 
    - What it is: The exact character you want to type
    - Examples: 'ą', 'ß', '你'
    - Rules: Must be a single character/symbol

- `upperChar`
  - When to use: When the automatic uppercase conversion is wrong or unclear
  - When NOT to use: In most cases - let the system handle it automatically

  ``` ts
  {
    char: 'i',        // Dotless i
    upperChar: 'İ',   // Capital I with dot above
    baseKey: 'I',
    modifiers: ['AltRight']
  }

  {
    char: 'ą',  // 'ą'.toUpperCase() => 'Ą', system automatically creates 'Ą'
    baseKey: 'A',
    modifiers: ['AltRight']
  }
  ```

- `baseKey`
  - What it is: The physical keyboard key to press, is used to calculate the delay
  - Examples: 'A', 'S', 'E', 'Space'
  - Rules: Must exist in the KeyboardStandaloneChar layout

- `modifiers`
  - What it is: Additional keys to hold while pressing baseKey
  - Examples: ['AltRight', 'ControlLeft']
  - Rules: Can be empty array if no modifiers needed


## Example
```ts
import { CustomKey, Keyboard, UserConfig } from 'typerr';

async function run() {
  const config: UserConfig = {
    typoProbability: 0.05,
  };

  const kb = new Keyboard(page, config);

  const customKeys: CustomKey[] = [
    { char: 'ć', baseKey: 'C', modifiers: ['AltRight'] },                 // Creates ć + Ć 
    { char: '你', baseKey: 'N', modifiers: ['AltRight', 'ControlLeft'] }, // Creates 你 + 你 
    { char: 'ä', baseKey: 'A', modifiers: ['AltRight'] },                 // Creates ä + Ä
  ];

  kb.addCustomKeys(customKeys);

  await page.click(inputSelector);

  await kb.type("Demonstration: Ć, 你, ä");
}

run();
```

## Types

`KeyboardStandaloneChar` - contains all standard keyboard keys including alphanumeric characters, symbols, function keys, navigation keys, numpad keys, and modifier keys

```ts
export type KeyboardStandaloneChar =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "@"
  | "#"
  | "$"
  | "%"
  | "^"
  | "&"
  | "*"
  | "("
  | ")"
  | "-"
  | "_"
  | "+"
  | "="
  | "{"
  | "}"
  | "["
  | "]"
  | "|"
  | "\\"
  | ":"
  | ";"
  | "'"
  | '"'
  | "<"
  | ">"
  | ","
  | "."
  | "?"
  | "/"
  | "`"
  | "~"
  | "!"
  | "Space"
  | "Backspace"
  | "ShiftLeft"
  | "ShiftRight"
  | "AltRight"
  | "AltLeft"
  | "Tab"
  | "CapsLock"
  | "ControlLeft"
  | "ControlRight"
  | "MetaLeft"
  | "MetaRight"
  | "ContextMenu"
  | "Enter"
  | "Escape"
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12"
  | "Insert"
  | "Delete"
  | "Home"
  | "End"
  | "PageUp"
  | "PageDown"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "NumLock"
  | "NumpadDivide"
  | "NumpadMultiply"
  | "NumpadSubtract"
  | "NumpadAdd"
  | "Numpad0"
  | "Numpad1"
  | "Numpad2"
  | "Numpad3"
  | "Numpad4"
  | "Numpad5"
  | "Numpad6"
  | "Numpad7"
  | "Numpad8"
  | "Numpad9"
  | "NumpadDecimal"
  | "NumpadEnter"
  | "PrintScreen"
  | "ScrollLock"
  | "Pause";
```

`KeyboardChar` - this type includes all standard keyboard keys from `KeyboardStandaloneChar` and any additional custom keys you define
```ts
export type KeyboardChar = KeyboardStandaloneChar | string;
```

## How does it work?
Typerr computes a per-movement delay between successive keys using a Fitts’s law–based model. Each transition from one key to the next is delayed by an amount that reflects how a human finger would move: farther targets take longer, wider targets are easier (and thus faster)

What the model considers:

- Start and target keys - for every pair of keys, the library uses their exact centers to measure the straight-line distance between them

- Target width

- Distance

- Index of difficulty - difficulty is computed using the <a href="https://en.wikipedia.org/wiki/Fitts%27s_law">Fitts's Law</a>, if the next key is far away or very small, the movement is harder and takes longer. If the next key is close or large, it’s easier and faster

- Base reaction time (baseDelay) - a constant component that represents human reaction time that applies to every move, even when keys are very close

- Distance sensitivity (distanceFactor) - a scaling factor that controls how strongly distance and target size influence the delay

- Natural variability (noise) - a zero-mean random factor which multiplies computed delay to simulate human hesitations. Therefore it guarantees that even repeating combinations create their own unique delay, producing a human-like rhythm