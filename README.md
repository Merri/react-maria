# React Maria
> Maria? &hellip; mARIA? &hellip; &hellip; &hellip; por qúe Maria?

This is ARIA components under construction where I'm getting rid of legacy complexity issues in `react-tabbordion` and
avoiding problems like the universal rendering issue that exist in other similar component libraries such as
`react-aria`.

These components will be built on top of the latest and greatest features in React, requiring React 16.4 or later.

## Components

### Unique ID management for universal rendering

These tools allow making components that have no render conflicts between server and client. React does not provide
anything for this issue, see [RFC #32: isomorphic IDs](https://github.com/reactjs/rfcs/pull/32).

- `clearUniqueIds`: call before rendering static markup on server side to ensure client will use same uniqueIds
- `registerUniqueId` and `unregisterUniqueId`: if you want a custom `withUniqueId` implementation
- `withUniqueId`: HOC that gives `uniqueId` prop to a given component

```js
// returns a component which is guaranteed to have uniqueId prop that is truly
// unique on rendered React app (first uniqueId: 'my-component1')
export default withUniqueId(MyComponent, 'my-component')
```

### Overlays: for dialogs, dropdowns, popups, tooltips...
- `Overlay`: for any component that pops on top of regular content, be it list dropdown or full screen modal dialog
- `OverlayProvider`: required for overlays to function, multi-overlay management
- `OverlayContext`: for creating customized replacements of `OverlayProvider` and `withOverlay`
- `withOverlay`: HOC that handles `freezeScroll` and `id` props, manages communication to `OverlayProvider`

### Todo thoughts
- `Accordion`
- `Tabs`