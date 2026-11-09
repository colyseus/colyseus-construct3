<div align="center">
  <a href="https://github.com/colyseus/colyseus">
    <img src="https://github.com/colyseus/colyseus/blob/master/media/logo.svg?raw=true" width="40%" height="100" />
  </a>
  <br>
  <br>
  <a href="https://npmjs.com/package/colyseus">
    <img src="https://img.shields.io/npm/dm/colyseus.svg?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjAgETESWYxR33AAAAtElEQVQoz4WQMQrCQBRE38Z0QoTcwF4Qg1h4BO0sxGOk80iCtViksrIQRRBTewWxMI1mbELYjYu+4rPMDPtn12ChMT3gavb4US5Jym0tcBIta3oDHv4Gwmr7nC4QAxBrCdzM2q6XqUnm9m9r59h7Rc0n2pFv24k4ttGMUXW+sGELTJjSr7QDKuqLS6UKFChVWWuFkZw9Z2AAvAirKT+JTlppIRnd6XgaP4goefI2Shj++OnjB3tBmHYK8z9zAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAyLTAxVDE4OjE3OjM3KzAxOjAwGQQixQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMi0wMVQxODoxNzozNyswMTowMGhZmnkAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC">
  </a>
  <a href="https://discord.gg/RY8rRS7">
    <img src="https://img.shields.io/discord/525739117951320081.svg?style=for-the-badge&colorB=7581dc&logo=discord&logoColor=white">
  </a>
  <h3>
     Colyseus Multiplayer SDK for <a href="https://www.construct.net/a/429195?t=construct3tour">Construct 3</a> <br/><a href="https://docs.colyseus.io/getting-started/construct3">View documentation</a>
  </h3>
</div>


# Compatibility

| Plugin version | Colyseus server version |
|----------------|-------------------------|
| 0.18.0.x       | 0.18.x                  |
| 0.17.0.x       | 0.17.x                  |

Plugin 0.18 speaks the Colyseus 0.18 wire protocol and **cannot connect to 0.17 servers**. If your server is still on 0.17, keep using plugin 0.17.0.3. See the [0.18 migration guide](https://docs.colyseus.io/migrating/0.18).

# Addon Development / Contribute

Requirements: download and install [Caddy Server](https://caddyserver.com/) in order to host https from
localhost.

- Install the dependencies. (`npm install`)
- Run Chrome without "same origin policy" (`npm run chrome`)
- Start the development server (`npm start`)

To update the bundled SDK, bump the `@colyseus/sdk` devDependency and run `npm run copy-dist` (copies `node_modules/@colyseus/sdk/dist/colyseus.js` into `plugin/`).

For testing on `editor.construct.net`:

- Enable Developer Mode
  - Go to Settings
  - Click on Settings window label 10 times
  - Scroll down and click select to enable "Developer Mode"
- Go do "Developer Mode" -> Install Dev Addon and provide the following URL: `https://localhost/addon.json`

This addon uses [c3addon](https://github.com/ConstructFund/c3addon) for
packing and publishing the addon to Construct Addons page.

## License

MIT
