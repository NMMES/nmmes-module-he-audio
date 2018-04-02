# NMMES-module-he-audio

A high efficiency audio module for [nmmes-backend](https://github.com/NMMES/nmmes-backend).

## Features
- Encode audio channels with the [opus audio codec](https://opus-codec.org/comparison/).
- Downmix using Dolby Pro Logic II algorithm if there are more than 3 audio channels in a stream.
- Skip lossless audio streams unless force encode is enabled.
- Specify base bitrate per audio channel.

## Installation

[![NPM](https://nodei.co/npm/nmmes-module-he-audio.png?compact=true)](https://nodei.co/npm/nmmes-module-he-audio/)

See https://github.com/NMMES/nmmes-cli/wiki/Modules for additional instructions.

## Options

The `--force` option ensures that lossless audio is also encoded.

Type: Boolean<br>
Default: false

---

The `--downmix` option downmixes he-audio opus to Dolby Pro Logic II.

Type: Boolean<br>
Default: false

---

The `--bitrate` option sets the encoding bitrate for he-audio per channel.

Type: Number<br>
Default: 40

---
