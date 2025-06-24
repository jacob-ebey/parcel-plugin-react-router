# Changelog

## [1.1.6](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.1.5...parcel-resolver-react-router-experimental-v1.1.6) (2025-06-24)


### Bug Fixes

* migrate "react-router/rsc" imports to "react-router" ([#78](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/78)) ([8a86b9f](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/8a86b9f3403bef52c8753bf5bbeee4d50f0cbfbe))
* update to latest experimental - 0.0.0-experimental-7a7fadb20 ([8a86b9f](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/8a86b9f3403bef52c8753bf5bbeee4d50f0cbfbe))

## [1.1.5](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.1.4...parcel-resolver-react-router-experimental-v1.1.5) (2025-06-20)


### Bug Fixes

* provide default root ErrorBoundary ([#76](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/76)) ([5525e70](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/5525e70286b563ef2330ca6812ff334b424d1e74))
* update to latest experimental: 0.0.0-experimental-4303fcb98 ([5525e70](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/5525e70286b563ef2330ca6812ff334b424d1e74))

## [1.1.4](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.1.3...parcel-resolver-react-router-experimental-v1.1.4) (2025-06-13)


### Bug Fixes

* add unstable prefix to `ServerRouteObject` type ([#74](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/74)) ([c85e7e0](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/c85e7e0dae7aa8149fdec92114a8770235383b7b))

## [1.1.3](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.1.2...parcel-resolver-react-router-experimental-v1.1.3) (2025-06-13)


### Bug Fixes

* add `virtual:react-router/request-handler` ([#72](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/72)) ([f1ffc85](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/f1ffc854164e54f9fcb8df6c67272847ce468977))
* make `virtual:react-router/express` export a function with options, add support for custom `distDir` ([f1ffc85](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/f1ffc854164e54f9fcb8df6c67272847ce468977))

## [1.1.2](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.1.1...parcel-resolver-react-router-experimental-v1.1.2) (2025-06-06)


### Bug Fixes

* migrate route `Component` export back to `default` ([#70](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/70)) ([4af3138](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/4af3138192f32a353847bbb0e00dc3e899f81912))

## [1.1.1](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.1.0...parcel-resolver-react-router-experimental-v1.1.1) (2025-06-05)


### Bug Fixes

* migrate route `default` property to `Component` ([#68](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/68)) ([9ab1d07](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/9ab1d07d13e0022f626e6046364e482e451744c2))

## [1.1.0](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.14...parcel-resolver-react-router-experimental-v1.1.0) (2025-05-28)


### Features

* update to `0.0.0-experimental-e7eb25a7b` (`unstable_` prefixed APIs) ([#66](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/66)) ([fb9d1b6](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/fb9d1b6420cd837dc359e972b7f8ea19dee08807))

## [1.0.14](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.13...parcel-resolver-react-router-experimental-v1.0.14) (2025-05-22)


### Bug Fixes

* add transformer plugin ([#49](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/49)) ([61ce2c3](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/61ce2c321041e7d73c48c78f98bac63acea2b641))
* fix client-route-component-props resolution ([#60](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/60)) ([e89b7d4](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/e89b7d4a8a986ce25149f0022e455d1d3484a9ac))
* invalidate route config to support FS routes ([#56](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/56)) ([7da91cd](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/7da91cd88acc510d24194a303bdefe42af2a4875))
* use new route component prop utils from react-router ([#63](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/63)) ([5d39b96](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/5d39b9621900715a64c3679e3f80bad659b1b6c2))

## [1.0.13](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.12...parcel-resolver-react-router-experimental-v1.0.13) (2025-05-14)


### Bug Fixes

* Add empty path to root route for 404 matching ([#48](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/48)) ([2787b2f](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/2787b2fc0a505263eca03fbde0167ef3b9eb2287))
* remove-virtual module for component props in favor of real module ([#45](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/45)) ([c0d719d](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/c0d719d30b00b7cf046371eb903246b8d03ce995))

## [1.0.12](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.11...parcel-resolver-react-router-experimental-v1.0.12) (2025-05-13)


### Bug Fixes

* pass props to route client components ([#41](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/41)) ([349d544](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/349d544133cb1f12d542a0e38b00b7094ee26366))
* Update to latest RR version and API ([#43](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/43)) ([2450880](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/2450880721922a7330c267fed5f7ee2ce85d0446))

## [1.0.11](https://github.com/jacob-ebey/parcel-plugin-react-router/compare/parcel-resolver-react-router-experimental-v1.0.10...parcel-resolver-react-router-experimental-v1.0.11) (2025-05-12)


### Bug Fixes

* bump parcel to 2.15.0 ([#38](https://github.com/jacob-ebey/parcel-plugin-react-router/issues/38)) ([74e6561](https://github.com/jacob-ebey/parcel-plugin-react-router/commit/74e6561c87bac1bdbc314f32c80cbba0207cda09))

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
