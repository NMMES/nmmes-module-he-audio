# NMMES-module-he-audio

A high efficiency audio module for nmmes-backend.

### Dependencies

- [nmmes-backend](https://github.com/NMMES/nmmes-backend) - Required in order to run this module.

### Installation
```
npm install -S nmmes-module-he-audio
yarn add nmmes-module-he-audio
```

You may install nmmes-module-he-audio via npm or yarn.

### Usage

You will need to install the encoder module (`nmmes-module-encoder`) for this example.

```javascript
import {Video, Logger} from 'nmmes-backend';
import encoder from 'nmmes-module-encoder';
import heAudio from 'nmmes-module-he-audio';

let video = new Video({
    input: {
        path: '/home/user/videos/video.mp4'
    },
    output: {
        path: '/home/user/videos/encoded-video.mkv'
    },
    modules: [new heAudio(), new encoder({
        defaults: {
            video: {
                'c:{POS}': 'libx265'
            }
        }
    })]
});

video.on('stop', function(err) {
    if (err)
        return Logger.error('Error encoding video', err);

    Logger.log('Video encoding complete.');
});

video.start();
```

## Options

You may pass the heAudio class an optional options object.

```javascript
new heAudio({
    encodeLossless: true, // Set to true if you would like to encode lossless audio streams (encode FLAC)
    bitratePerChannel: 60, // Bitrate for he audio (40-60 is good)
});
```
