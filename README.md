# dpki-lite.lib

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

The browser-side crypto lib for holo light clients

In addition to the [salt service](https://docs.google.com/document/d/1VIbQDdSnnd4BNgjtupjVeH9PPNe8kgqETpPhIIWyGBU/edit) ,
The client-side crypto will need to do a SENSITIVE mem and op pwhash with the salt and user's password. This would give the root seed, from which we can do the same seed generation scheme.
As far as client side libsodium crypto libs, this is the one I've had my eye on, since it has all the apis: https://www.npmjs.com/package/libsodium-wrappers. We don't need to do all the SecBuf stuff for this version, since we cannot memprotect memory in the browser anyway.

**Who would be calling this lib?**

The holo.js code would be doing this. it'll sort of be up to the UI designer for the particular app, but at some point if the user undertakes an action, and does not yet have a source chain, the app dev will trigger a holo.js api that will set up session hosts through the tranche service, and the user will need to generate private keys to set up core apps, etc, on that session host.

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

---

This top-level is just tools for helping manage the monorepo. Monorepo managed by [Lerna](https://www.npmjs.com/package/lerna)

See the [API Documentation](docs/index.md)!
