# React Maria
> Maria? &hellip; mARIA? &hellip; &hellip; &hellip; por qúe Maria?

This is ARIA components under construction where I'm getting rid of legacy complexity issues in `react-tabbordion` and
avoiding problems like the universal rendering issue that exist in other similar component libraries such as
`react-aria`.

These components will be built on top of the latest and greatest features in React, requiring React 16.4 or later.


## Stable features as of v0.1.0

These features are "mature" and are unlikely to be changed greatly from now on. Full 100% test coverage.

- [Unique IDs](https://github.com/Merri/react-maria/tree/master/docs): `withUniqueId` HOC, `getMariaIdTools()` etc.


## Unstable features: Components

These features have not yet had the care and time to be anywhere near final: no docs, no tests, likely to change a lot.

### Overlays: for dialogs, dropdowns, popups, tooltips...
- `Modal`: for any component that pops on top of regular content, be it list dropdown or full screen modal dialog
- `ModalOverlay`: required for modals to function, multi-modal management
- `withOverlay`: HoC that handles `freezeScroll` and `id` props, manages communication to `ModalOverlay`

### Todo thoughts
- `Accordion`
- `Tabs`
- Actually make use of Storybook