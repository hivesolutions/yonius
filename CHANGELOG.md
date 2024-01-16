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

## [0.13.11] - 2024-01-16

### Fixed

* Made `destroyMongo()` an `async` function

## [0.13.10] - 2023-10-25

### Changed

* Improved structure for ECONNRESET testing

## [0.13.9] - 2023-10-25

### Changed

* More context for hang up of sockets handled

# [0.13.8] - 2023-10-25

### Changed

* Less strict test for connection reset

## [0.13.7] - 2023-10-25

### Changed

* Made changes to the way connections are handled so that connections that are kept-alive are do not generate ECONNRESET - related to [node-fetch/node-fetch#1735](https://github.com/node-fetch/node-fetch/issues/1735)

## [0.13.6] - 2023-10-25

### Changed

* Bumped dependencies
* Made node-fetch support deno while unblocking its version

## [0.13.5] - 2023-03-18

### Fixed

* Coalescing issue in default find values

## [0.13.4] - 2023-03-17

### Fixed

* Issue related to the usage of `fixResponseChunkedTransferBadEnding()` method in node-fetch and deno, de-bumped node-fetch version to <2.6.7

## [0.13.3] - 2023-03-12

### Fixed

* Issue related to the `verify()` operation included in the `save()` method

## [0.13.2] - 2023-02-23

### Changed

* Improved Model's `save()` method to make more structured and safer to use

### Fixed

* Problem with the `fill` operation for the Model saving process, where situation with increments will create issues
* Export of `APIOptions` type
* Issue related to invalid presence testing in `Reference` object

## [0.13.1] - 2023-02-23

### Fixed

* Small issue with the `fill()` method

## [0.13.0] - 2023-02-06

### Changed

* Better fallback handling of API error messages

## [0.12.1] - 2023-01-14

### Fixed

* Test bundling

## [0.12.0] - 2023-01-14

### Changed

* Bumped most of the packages, making Node.js<14 versions incompatible with the build system
* Made ESM modules the default import system for Yonius 🙌

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
