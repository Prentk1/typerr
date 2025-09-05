import { KeyInput } from "puppeteer";

export interface KeyData {
  custom?: boolean;
  key: KeyInput;
  center_x: number;
  center_y: number;
  w: number;
  h: number;
  neighbors: string[];
  modifiers: string[];
}

export interface KeyboardMap {
  [key: KeyboardChar]: KeyData;
}

export interface resolvedKey extends KeyData {
  keyboardChar: KeyboardChar;
  outputChar?: string;
}

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

const STANDALONE_CHARS_LIST: readonly KeyboardStandaloneChar[] = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",

  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",

  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "+",
  "=",
  "{",
  "}",
  "[",
  "]",
  "|",
  "\\",
  ":",
  ";",
  "'",
  '"',
  "<",
  ">",
  ",",
  ".",
  "?",
  "/",
  "`",
  "~",
  "!",

  "Space",
  "Backspace",
  "ShiftLeft",
  "ShiftRight",
  "AltRight",
  "AltLeft",
  "Tab",
  "CapsLock",
  "ControlLeft",
  "ControlRight",
  "MetaLeft",
  "MetaRight",
  "ContextMenu",
  "Enter",

  "Escape",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",

  "Insert",
  "Delete",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",

  "NumLock",
  "NumpadDivide",
  "NumpadMultiply",
  "NumpadSubtract",
  "NumpadAdd",
  "Numpad0",
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
  "NumpadDecimal",
  "NumpadEnter",

  "PrintScreen",
  "ScrollLock",
  "Pause",
];

export const KEYBOARD_CHARS: KeyboardChar[] = [...STANDALONE_CHARS_LIST];

export type KeyboardChar = KeyboardStandaloneChar | string;

export interface Config {
  typoProbability: number;
  fittsConfig: {
    baseDelay: number;
    distanceFactor: number;
    noise: number;
  };
}

export interface UserConfig {
  typoProbability?: number;
  fittsConfig?: {
    baseDelay?: number;
    distanceFactor?: number;
    noise?: number;
  };
}

export interface CustomKey {
  char: string; // ą
  upperChar?: string; // Ą
  baseKey: KeyboardStandaloneChar; // A
  modifiers: KeyboardChar[]; // ['AltRight']
}
