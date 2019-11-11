# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changes that are *meta*, like updating community files, changing the readme, or
modifying templates, will be under the heading *Meta*. These changes don't affect 
the app functionality.

## [Unreleased]

## [0.2.0] - 2019-06-04
### Added
- Loading page to indicate the progress in retreiving the user scrobbles
- Time Series component that plots the weekly scrobbles over the last year
### Changed
- Stop drawing plots incrementally. Fetch first, plot later.

## [0.1.3] - 2019-06-29
### Fixed
- Fix the imports in UserPage replacing import with require

## [0.1.2] - 2019-06-29
### Fixed
- Specify node version in package.json to fix Heroku deployment

## [0.1.1] - 2019-06-29
### Changed
- Draw Heatmap incrementally, updating every time UserPage fetches another page of
scrobbles
- The Heatmap cells have an id based on the date they display. Previously, it was
based on the days elapsed since the start of the displayed period.
- Change the color palete of the Heatmap. 
- Reduce the number of color tags from 8 to 4.

### Fixed
- Tooltip no longer goes offscreen but instead now flips to the left

## [0.1.0] - 2019-06-26
### Added
- Create a React project
- Manage routes `/user/:user`
- Create a form to ask for the username to fetch
- Get a list of all the scrobbles from the user in `user/:user`
- Display a Heatmap of the last year (Today but one year ago, today)

#### Meta
- Create a basic GitHub repository
- Add community files: templates, contributing, code of conduct.
- Write a useful Readme

[Unreleased]: https://github.com/davidomarf/lastfm/compare/v0.2.0..develop
[0.2.0]: https://github.com/davidomarf/lastfm/compare/tag/v0.2.0
[0.1.3]: https://github.com/davidomarf/lastfm/compare/tag/v0.1.3
[0.1.2]: https://github.com/davidomarf/lastfm/compare/tag/v0.1.2
[0.1.1]: https://github.com/davidomarf/lastfm/compare/tag/v0.1.1
[0.1.0]: https://github.com/davidomarf/lastfm/releases/tag/v0.1.0
