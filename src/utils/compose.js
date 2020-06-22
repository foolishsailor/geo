/**
 * compose
 *
 * Composition utility to compose multiple functions with arrays of parameters
 *
 * Thank you Eric Elliot for the great one-liners!
 * https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
 */

const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

module.exports = { compose, pipe };
