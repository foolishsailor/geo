/**
 * compose
 *
 * Composition utility to compose multiple functions with arrays of parameters
 */

/*
 const compose = (...fns) => (...args) =>
  fns.reduceRight((acc, fn) => [fn(...args)], args);*/

const compose = (...fns) => (args) =>
  fns.reduceRight((acc, fn) => fn(acc), args);

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

module.exports = { compose, pipe };
