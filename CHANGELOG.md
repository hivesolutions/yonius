# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

*

### Changed

*

### Fixed

*

## [0.11.7] - 2022-05-16

### Fixed

* Typescript declaration issues

## [0.11.6] - 2022-05-13

### Added

* Add `fromArrayBuffer` and `fromBlob` to `FileTuple`

## [0.11.5] - 2022-02-15

### Changed

* Improved `package.json` compatibility

## [0.11.4] - 2022-02-13

### Changed

* Improved `import` compatibility for ESM

## [0.11.3] - 2022-02-07

### Changed

* Made safe keys support to allow verify

## [0.11.2] - 2022-02-07

### Changed

* Added better validation exception on save

## [0.11.1] - 2022-02-07

### Fixed

* Export module issues

## [0.11.0] - 2022-02-07

### Changed

* Made fastify types optional, avoid required dependency

## [0.10.0] - 2022-02-07

### Changed

* New undefined validation behavior

## [0.9.2] - 2022-02-06

### Fixed

* `YoniusError` extending `Error`

## [0.9.1] - 2022-02-06

### Fixed

* Error type definition

## [0.9.0] - 2022-01-24

### Added

* Support for the `underscoreToCamel` function

## [0.8.3] - 2021-12-05

### Fixed

* Issue related with wrong order in the model structure retrieval for the save operation

## [0.8.2] - 2021-08-03

### Added

* Date comparison support to `equal()` method

## [0.8.1] - 2021-07-15

### Changed

* Encoding of multipart form data directly using a string value
* Made encoding of string multipart backwards compatible with `Uint8Array`

## [0.8.0] - 2021-07-09

### Added

* Support for custom `getAgent` options
* Support for `options` in `buildGetAgent`

## [0.7.7] - 2021-05-18

### Added

* Support for references in Model relations 🎉
* Made `_hasPermission` public
