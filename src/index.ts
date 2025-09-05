import type { Page } from "puppeteer";
import { randomNormal } from "./math";

import {
  Config,
  CustomKey,
  KEYBOARD_CHARS,
  KeyboardChar,
  resolvedKey,
  UserConfig,
} from "./types";
import { keyboardMap } from "./keyboard-map";

export class Keyboard {
  private config;
  lastKey: KeyboardChar = "Space";

  constructor(
    private page: Page,
    userConfig: UserConfig = {},
  ) {
    const defaultConfig: Config = {
      typoProbability: 0.05,
      fittsConfig: {
        baseDelay: 70,
        distanceFactor: 60,
        noise: 0.2,
      },
    };

    this.config = { ...defaultConfig, ...userConfig };
  }

  private async fittsDelay(fromKey: resolvedKey, toKey: resolvedKey) {
    const { baseDelay, distanceFactor, noise } = this.config.fittsConfig;

    const dx = toKey.center_x - fromKey.center_x;
    const dy = toKey.center_y - fromKey.center_y;
    const D = Math.sqrt(dx * dx + dy * dy);
    const W = toKey.w;

    const base = baseDelay! + distanceFactor! * Math.log2(D / W + 1);

    const noiseFactor = randomNormal(0, noise);
    const ms = base * (1 + noiseFactor);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static isKeyboardInput(char: string): KeyboardChar {
    if (keyboardMap[char as KeyboardChar]) {
      return char as KeyboardChar;
    }

    // check if key exsits
    if (KEYBOARD_CHARS.includes(char as KeyboardChar)) {
      return char as KeyboardChar;
    }

    throw new Error(
      `Invalid input: "${char}" is not a valid standalone keyboard key. If you're using custom keys, make sure they are properly configured.`,
    );
  }

  public setLastKey(key: KeyboardChar): void {
    this.lastKey = Keyboard.isKeyboardInput(key);
  }

  public getLastKey(): KeyboardChar {
    return this.lastKey;
  }

  static keyResolver(char: string): resolvedKey {
    let keyboardChar: KeyboardChar;

    try {
      keyboardChar = Keyboard.isKeyboardInput(char);
    } catch {
      try {
        const upperChar = char.toUpperCase();
        keyboardChar = Keyboard.isKeyboardInput(upperChar);
      } catch {
        throw new Error(`No keyboardMap data for character: "${char}"`);
      }
    }

    const entry = keyboardMap[keyboardChar];
    if (!entry) {
      throw new Error(`No keyboardMap data for key: ${keyboardChar}`);
    }

    const resolvedKey: resolvedKey = {
      ...entry,
      modifiers: [...(entry.modifiers ?? [])],
      neighbors: [...(entry.neighbors ?? [])],
      keyboardChar: keyboardChar,
      outputChar: char,
    };

    if (!entry.custom) {
      const isUpperAlpha =
        char === char.toUpperCase() && char !== char.toLowerCase();
      if (isUpperAlpha && !resolvedKey.modifiers.includes("ShiftLeft")) {
        resolvedKey.modifiers.unshift("ShiftLeft");
      }
    }

    return resolvedKey;
  }

  static specialKeyResolver(key: KeyboardChar): resolvedKey {
    const keyboardChar = Keyboard.isKeyboardInput(key);
    const entry = keyboardMap[keyboardChar];

    if (!entry) throw new Error(`No keyboardMap data for key: ${keyboardChar}`);

    return { ...entry, keyboardChar: keyboardChar };
  }

  private async makeTypo(resolvedKey: resolvedKey): Promise<void> {
    if (Math.random() < this.config.typoProbability) {
      const keyNeighbors = resolvedKey.neighbors;
      if (keyNeighbors.length === 0) return;
      const typo =
        keyNeighbors[Math.floor(Math.random() * keyNeighbors.length)];

      const resolvedToKey = Keyboard.specialKeyResolver(typo);
      let resolvedLastKey = Keyboard.specialKeyResolver(this.lastKey);

      await this.fittsDelay(resolvedLastKey, resolvedToKey);
      await this.page.keyboard.press(resolvedToKey.key);
      this.setLastKey(resolvedToKey.keyboardChar);

      resolvedLastKey = Keyboard.specialKeyResolver(this.lastKey);
      const resolvedBacksapce = Keyboard.specialKeyResolver("Backspace");

      await this.fittsDelay(resolvedLastKey, resolvedBacksapce);
      await this.page.keyboard.press("Backspace");
      this.setLastKey("Backspace");
    } else {
      return;
    }
  }

  private async typeChar(resolvedKey: resolvedKey): Promise<void> {
    if (resolvedKey.modifiers.length !== 0) {
      for (const modifier of resolvedKey.modifiers) {
        const resolvedLastKey = Keyboard.specialKeyResolver(this.lastKey);
        const resolvedModifier = Keyboard.specialKeyResolver(modifier);

        await this.fittsDelay(resolvedLastKey, resolvedModifier);
        await this.page.keyboard.down(resolvedModifier.key);
        this.setLastKey(resolvedModifier.keyboardChar);
      }
    }

    const resolvedLastKey = Keyboard.specialKeyResolver(this.lastKey);

    await this.fittsDelay(resolvedLastKey, resolvedKey);
    await this.page.keyboard.press(resolvedKey.key);
    this.setLastKey(resolvedKey.keyboardChar);

    for (const modifier of resolvedKey.modifiers.reverse()) {
      const resolvedLastKey = Keyboard.specialKeyResolver(this.lastKey);
      const resolvedModifier = Keyboard.specialKeyResolver(modifier);

      await this.fittsDelay(resolvedLastKey, resolvedModifier);
      await this.page.keyboard.up(resolvedModifier.key);
      this.setLastKey(resolvedModifier.keyboardChar);
    }
    return;
  }

  private async typeCustomChar(resolvedKey: resolvedKey): Promise<void> {
    if (resolvedKey.modifiers.length !== 0) {
      for (const modifier of resolvedKey.modifiers) {
        const resolvedLastKey = Keyboard.specialKeyResolver(this.lastKey);
        const resolvedModifier = Keyboard.specialKeyResolver(modifier);

        await this.fittsDelay(resolvedLastKey, resolvedModifier);
        await this.page.keyboard.down(resolvedModifier.key);
        this.setLastKey(resolvedModifier.keyboardChar);
      }
    }

    const resolvedLastKey = Keyboard.specialKeyResolver(this.lastKey);

    await this.fittsDelay(resolvedLastKey, resolvedKey);
    await this.page.keyboard.sendCharacter(resolvedKey.outputChar!);
    this.setLastKey(resolvedKey.keyboardChar);

    for (const modifier of resolvedKey.modifiers.reverse()) {
      const resolvedLastKey = Keyboard.specialKeyResolver(this.lastKey);
      const resolvedModifier = Keyboard.specialKeyResolver(modifier);

      await this.fittsDelay(resolvedLastKey, resolvedModifier);
      await this.page.keyboard.up(resolvedModifier.key);
      this.setLastKey(resolvedModifier.keyboardChar);
    }
    return;
  }

  public addCustomKeys(customKeys: CustomKey[]) {
    for (const customKey of customKeys) {
      const base = keyboardMap[customKey.baseKey];
      if (!base) throw new Error(`Base key ${customKey.baseKey} not found`);

      const lowerChar = customKey.char;
      keyboardMap[lowerChar as KeyboardChar] = {
        custom: true,
        key: base.key,
        center_x: base.center_x,
        center_y: base.center_y,
        w: base.w,
        h: base.h,
        neighbors: base.neighbors,
        modifiers: customKey.modifiers,
      };

      const upperChar = customKey.upperChar || customKey.char.toUpperCase();
      if (upperChar !== lowerChar) {
        keyboardMap[upperChar as KeyboardChar] = {
          custom: true,
          key: base.key,
          center_x: base.center_x,
          center_y: base.center_y,
          w: base.w,
          h: base.h,
          neighbors: base.neighbors,
          modifiers: [...customKey.modifiers, "ShiftLeft"], // Dodaj Shift dla wielkiej litery
        };
      }

      // add to KEYBOARD_CHARS
      if (!KEYBOARD_CHARS.includes(lowerChar as KeyboardChar)) {
        KEYBOARD_CHARS.push(lowerChar as KeyboardChar);
      }
      if (
        upperChar !== lowerChar &&
        !KEYBOARD_CHARS.includes(upperChar as KeyboardChar)
      ) {
        KEYBOARD_CHARS.push(upperChar as KeyboardChar);
      }
    }
  }

  public async type(value: string): Promise<void> {
    for (let char of value) {
      let resolvedKey;
      if (char == " ") {
        char = "Space";
        resolvedKey = Keyboard.specialKeyResolver(char);
      } else {
        resolvedKey = Keyboard.keyResolver(char);
      }
      await this.makeTypo(resolvedKey);
      if (resolvedKey.custom) {
        await this.typeCustomChar(resolvedKey);
      } else {
        await this.typeChar(resolvedKey);
      }
    }
  }
}

export type { CustomKey, UserConfig };
