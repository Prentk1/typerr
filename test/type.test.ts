/// <reference types="jest-environment-puppeteer" />

import { Page } from "puppeteer";
import path from "path";
import { CustomKey, Keyboard } from "../dist/index.js";

declare global {
  const page: Page;
}

describe("humanType E2E", () => {
  it("should type into the input correctly", async () => {
    const filePath = "file://" + path.resolve(__dirname, "index.html");
    await page.goto(filePath);

    const inputSelector = "#test-input";
    const textToType = `ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż ÄÖÜßäöü !@#$%^&*()_+-={}[]|\\:";'<>,.?/\`~ ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789.`;

    await page.click(inputSelector);

    const kb = new Keyboard(page);

    const polishLetters: CustomKey[] = [
      { char: "ą", upperChar: "Ą", baseKey: "A", modifiers: ["AltRight"] },
      { char: "ć", upperChar: "Ć", baseKey: "C", modifiers: ["AltRight"] },
      { char: "ę", upperChar: "Ę", baseKey: "E", modifiers: ["AltRight"] },
      { char: "ł", upperChar: "Ł", baseKey: "L", modifiers: ["AltRight"] },
      { char: "ń", upperChar: "Ń", baseKey: "N", modifiers: ["AltRight"] },
      { char: "ó", upperChar: "Ó", baseKey: "O", modifiers: ["AltRight"] },
      { char: "ś", upperChar: "Ś", baseKey: "S", modifiers: ["AltRight"] },
      { char: "ź", upperChar: "Ź", baseKey: "Z", modifiers: ["AltRight"] },
      { char: "ż", upperChar: "Ż", baseKey: "X", modifiers: ["AltRight"] },
    ];

    const germanLetters: CustomKey[] = [
      { char: "ä", upperChar: "Ä", baseKey: "A", modifiers: ["AltRight"] },
      { char: "ö", upperChar: "Ö", baseKey: "O", modifiers: ["AltRight"] },
      { char: "ü", upperChar: "Ü", baseKey: "U", modifiers: ["AltRight"] },
      { char: "ß", upperChar: "ß", baseKey: "S", modifiers: ["AltRight"] },
    ];

    const allSpecialLetters: CustomKey[] = [...polishLetters, ...germanLetters];

    kb.addCustomKeys(allSpecialLetters);
    await kb.type(textToType);

    await page.waitForFunction(
      (selector, expected) => {
        const el = document.querySelector<HTMLInputElement>(selector);
        return el?.value === expected;
      },
      {},
      inputSelector,
      textToType,
    );

    const inputValue = await page.$eval(
      inputSelector,
      (el) => (el as HTMLInputElement).value,
    );
    expect(inputValue).toBe(textToType);
  });
});
