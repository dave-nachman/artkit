import { executionWorker } from "./executionWorker";
import { lookupPrecomputed } from "./precomputed";

export interface Evaluator {
  evaluate: (input: string, seed: number, tick: number) => Promise<Element>;
  onReady: (callback: () => void) => void;
}

export const webAssemblyEvaluator = {
  alreadyReady: false,
  onReady: (callback: () => void) => {
    if (webAssemblyEvaluator.alreadyReady) {
      return callback();
    }
    executionWorker.addEventListener("message", (e) => {
      const { results, error, ready } = e.data;
      if (ready) {
        webAssemblyEvaluator.alreadyReady = true;
        callback();
      }
    });
  },
  evaluate: (input: string, seed: number, tick: number) => {
    if (lookupPrecomputed(input, seed)) {
      return new Promise((resolve) => resolve(lookupPrecomputed(input, seed)!));
    }

    const ident = Math.floor(Math.random() * 100000);

    return new Promise((resolve, reject) => {
      const eventListener = (e: any) => {
        const { results, error, ready } = e.data;

        if (results) {
          if (results[0] === ident) {
            resolve(results[1]);
            executionWorker.removeEventListener("message", eventListener);
          }
        } else {
          reject(error);
        }
      };
      executionWorker.addEventListener("message", eventListener);
      const identVariable = `ident${ident}`;
      const message = {
        [identVariable]: ident,
        seed,
        tick,
        python:
          `
from js import ${identVariable}, seed, tick
import random

random.seed(int(seed))
` +
          input +
          `
import inspect

x = None

if "tick" in inspect.signature(draw).parameters:
    x = [${identVariable}, serialize(draw(tick))]
else:
    x = [${identVariable}, serialize(draw())]

x
      `,
      };

      executionWorker.postMessage(message);
    });
  },
};

export default webAssemblyEvaluator;
