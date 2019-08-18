# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [0.1.0] - 2019-01-29

### Changed

- `Overlay` is now `Modal`
- `OverlayProvider` is now `ModalOverlay`
- `OverlayContext` is now `Overlay`
- `withUniqueId` HoC now takes options object with keys `identifier` and `includeGenerator`
- `withOverlay` HoC now takes options object that is passes to `withUniqueId`
- Components passed to `withUniqueId` can now have `uniqueId` prop, which is used instead of `identifier` when given

### Added

- `uniqueId` prop; `last`, `make` and `next` methods are included to returned object from `getMariaIdtools()`
- tests for Unique IDs

### Fixed

- Pressing escape or clicking body no longer removes `currentModalId`: only modal actually unmounting will do that


## [0.0.4] - 2018-06-05

### Changed

- Documentation and keywords have been improved, no functional changes
- Unique ID feature is now considered stable for production


## [0.0.3] - 2018-06-03

### Fixed

- Conflict with `id` and `name` provided by `OverlayProvider` for `Overlay`
- Missing defaultProps for `onClose` and `onOpen` in `OverlayProvider`


## [0.0.2] - 2018-06-03

### Fixed

- `children` propTypes now allow a function
- `currentOverlayId` was null and caused render errors
- `OverlayContext` crash on missing state object

### Removed

- `OverlayContext` is no longer exposed


## [0.0.1] - 2018-06-03

### Added

- `Overlay` components
- `uniqueId` management