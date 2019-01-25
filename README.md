# dpki-lite.lib
The browser-side crypto for holo light clients

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)


This top-level is just tools for helping manage the monorepo. Monorepo managed by [Lerna](https://www.npmjs.com/package/lerna)

To relieve some of the overhead of mananging node dependencies, putting all prototyping projects related to holochain networking / p2p in this single repository for now.

See the [API Documentation](docs/index.md)!

### Usage

First, make sure our own dependencies are installed:

```shell
npm install
```

Next, install all project dependencies (through lerna monorepo manager):

```shell
npm run bootstrap
```

Now, test all projects:

```shell
npm test
```

### New projects

To create a new project, execute the following and fill out the prompts:

```shell
npm run new
```
