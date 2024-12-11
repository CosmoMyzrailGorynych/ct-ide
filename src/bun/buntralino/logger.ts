/* eslint-disable no-console */
import {color} from 'bun' with {type: 'macro'};

/**
 * Logs a given string, formatting the template tags with appropriate colors
 * and appending a timestamp.
 */

const number = color('yellow', 'ansi')!,
      string = color('teal', 'ansi')!,
      date = color('purple', 'ansi'),
      error = color('red', 'ansi')!,
      grey = color('grey', 'ansi')!,
      reset = '\x1b[0m';

export default function loggerStringTemplate(strings: TemplateStringsArray, ...inputs: unknown[]) {
    let result = `${grey}[${date}${(new Date()).toLocaleTimeString()}${grey}]${reset} 🥟 `;
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < inputs.length) {
            const input = inputs[i];
            if (typeof input === 'number') {
                result += number + input + reset;
            } else if (typeof input === 'string') {
                result += string + input + reset;
            } else if (input instanceof Error) {
                result += error + input.message + reset;
            } else {
                result += input;
            }
        }
    }
    console.log(result);
}
