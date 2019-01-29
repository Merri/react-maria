# Unique IDs

React does not provide native means to ensure generation of unique IDs to use with HTML input components. This means
that making dynamically generated IDs for label `htmlFor` and input `id` attributes needs a lot of thinking to get it
right, especially when making universally rendering applications and both server generated HTML and client generated DOM
should have the same IDs.

React Maria solves this problem by providing a HOC `withUniqueId` method:

```js
export default withUniqueId({ identifier: 'my-component' })(MyComponent);
```

With this code in place your component will receive two new props: `uniqueId` and `uniqueIdGen`. The first one can be
used directly with one element and is guaranteed to have a unique ID that has a running number added after the defined
`identifier`.

In render you can do `const uid = uniqueIdGen()` to start generating more sub-IDs for the current `uniqueId`, thus
allowing more than one element to have unique ID within the same render. The returned `uid` has two methods: `next()`
and `last()`. `next()` generates a new unique ID and returns it. `last()` returns the latest ID generated by `next()`.