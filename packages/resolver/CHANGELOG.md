# Changelog

## [1.0.10](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.9...parcel-resolver-react-router-experimental-v1.0.10) (2025-05-11)


### Bug Fixes

* better route ID generation ([#37](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/37)) ([6bb7e40](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/6bb7e40311075c509800b3b73fe9560cf9811e0d))
* make sure `@react-router/fs-routes` works ([#33](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/33)) ([92d86f7](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/92d86f73ef31028560f6d5cc7463b672535aae52))
* support more file extensions for "root" and "react-router.config" ([#35](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/35)) ([38679d4](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/38679d40e76a97123db31d90068072acf34ff83a))

## [1.0.9](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.8...parcel-resolver-react-router-experimental-v1.0.9) (2025-05-07)


### Bug Fixes

* adopt generateResponse API in RR to support middleware ([#32](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/32)) ([f1aac26](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/f1aac26d0d540d9240e53af2ca5555dc2dabf2c5))
* cleanup ssr entry file ([#27](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/27)) ([7c13a91](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/7c13a911c80475a611993bbc340bb5330f1133db))
* surface CSS resources for route components ([#31](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/31)) ([f016c37](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/f016c37e89e76c9c89738dafc77cbf02d06ad9f0))
* update entrypoint to use new deferred decoding API ([#30](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/30)) ([f2c5abc](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/f2c5abc53ce3614345c5015876a5db3d0f5f19d2))

## [1.0.8](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.7...parcel-resolver-react-router-experimental-v1.0.8) (2025-04-18)


### Bug Fixes

* Update to use the latest RR experimental with updated export names ([#25](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/25)) ([e9d4191](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/e9d41915990fba2b067d5926e0d92b2f4adc5524))

## [1.0.7](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.6...parcel-resolver-react-router-experimental-v1.0.7) (2025-04-18)


### Bug Fixes

* one server component, all server component ([b3ef593](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/b3ef593a5ab6a2ecb0d70b89ed552fdc59227859))

## [1.0.6](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.5...parcel-resolver-react-router-experimental-v1.0.6) (2025-04-18)


### Bug Fixes

* remove debug log ([#19](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/19)) ([e747d18](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/e747d1839597ddefcac996e0ad55ba3fe44f1281))

## [1.0.5](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.4...parcel-resolver-react-router-experimental-v1.0.5) (2025-04-18)


### Bug Fixes

* add progressive server actions OOTB ([#18](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/18)) ([b26d6a3](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/b26d6a3c78c3602521610fe054619fee056c3d48))
* add server actions support to hidden entries ([#16](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/16)) ([8b9366c](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/8b9366c754d722d22e68986822fc3e95e23f9b14))
* support for monorepo ([b26d6a3](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/b26d6a3c78c3602521610fe054619fee056c3d48))

## [1.0.4](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.3...parcel-resolver-react-router-experimental-v1.0.4) (2025-04-18)


### Bug Fixes

* publish CJS modules to remove parcel warnings ([#14](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/14)) ([07f2fc0](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/07f2fc0062463cd50ca8b53f34d9e6bf89ddac1a))
* use React. methods instead of JSX syntax to avoid a React warning ([07f2fc0](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/07f2fc0062463cd50ca8b53f34d9e6bf89ddac1a))

## [1.0.3](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.2...parcel-resolver-react-router-experimental-v1.0.3) (2025-04-18)


### Bug Fixes

* remove logs and add react import ([#12](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/12)) ([8e2f4d1](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/8e2f4d1cac8a7f8ec8b094ae39e52dd9c0351ae2))

## [1.0.2](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.1...parcel-resolver-react-router-experimental-v1.0.2) (2025-04-17)


### Bug Fixes

* build things ([#6](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/6)) ([8dba8ef](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/8dba8efcd4209f8e69fa763a82ecc0892cd0ea22))

## [1.0.1](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.0...parcel-resolver-react-router-experimental-v1.0.1) (2025-04-17)


### Bug Fixes

* build things ([#6](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/6)) ([8dba8ef](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/8dba8efcd4209f8e69fa763a82ecc0892cd0ea22))
