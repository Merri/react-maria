# React Maria
> Maria? &hellip; mARIA? &hellip; &hellip; &hellip; por qúe Maria?

This is ARIA components under construction where I'm getting rid of legacy complexity issues in `react-tabbordion` and
avoiding problems like the universal rendering issue that exist in other similar component libraries such as
`react-aria`.

These components will be built on top of the latest and greatest features in React, requiring React 16.4 or later.


## Unique ID management for universal rendering

These tools allow making components that have no render conflicts between server and client.

- `clearUniqueIds`: call before rendering static markup on server side to ensure client will use same uniqueIds
- `registerUniqueId` and `unregisterUniqueId`: if you want a custom `withUniqueId` implementation
- `withUniqueId`: HOC that gives `uniqueId` prop to a given component

```js
// returns a component which is guaranteed to have uniqueId prop that is truly
// unique on rendered React app (first uniqueId: 'my-component1')
export default withUniqueId(MyComponent, 'my-component')
```

### Why Maria implements this feature?

React does not provide anything for this issue, see [RFC #32: isomorphic IDs](https://github.com/reactjs/rfcs/pull/32).
There are other solutions to this problem, but...

**... they have no universal render**:

- [`react-id-decorator`](https://www.npmjs.com/package/react-id-decorator)
- [`react-sequential-id`](https://www.npmjs.com/package/react-sequential-id)
- [`react-stable-uniqueid`](https://www.npmjs.com/package/react-stable-uniqueid)
- [`react-uniqueid`](https://www.npmjs.com/package/react-uniqueid)
- [`@team-griffin/react-unique-id`](https://www.npmjs.com/package/@team-griffin/react-unique-id)

**... or they mutate your component like a mixin (antipattern)**:

- [`react-html-id`](https://www.npmjs.com/package/react-html-id)

**... or they have no documentation at all**:

- [`@xo-union/react-unique-id`](https://www.npmjs.com/package/@xo-union/react-unique-id)

And the remaining solutions that can be found have clearly not spent time to think about the problem.


## Components

### Overlays: for dialogs, dropdowns, popups, tooltips...
- `Overlay`: for any component that pops on top of regular content, be it list dropdown or full screen modal dialog
- `OverlayProvider`: required for overlays to function, multi-overlay management
- `withOverlay`: HOC that handles `freezeScroll` and `id` props, manages communication to `OverlayProvider`

### Todo thoughts
- `Accordion`
- `Tabs`