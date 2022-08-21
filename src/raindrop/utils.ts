/**
 * See https://github.com/ilyamkin/dev-to-js/blob/master/src/utils.ts
 * https://www.typescriptlang.org/docs/handbook/mixins.html
 */
 export function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null)
        );
      });
    });
  }