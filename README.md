# JPXS Launcher

A SubRosa launcher to handle multiple modded instances.  
An app made with [Tauri](https://tauri.app/) and [SolidJS](https://www.solidjs.com)

## Installation

Make sure to have [all required pre-requesites](https://tauri.app/v1/guides/getting-started/prerequisites) before trying this.
To install all npm dependencies, do:

```bash
$ npm install # or pnpm install or yarn install
```

## Usage

To run the app, you can either run the webserver (it probably won't work) using `npm run dev` or run the tauri app using `npm run tauri dev`. This will also automatically compile all rust code and update the app as changes occur in the repository.

## Building

To build the app, all you have to do is run `npm run tauri build`. The resulting binary is placed under `src-tauri/target/release`.
