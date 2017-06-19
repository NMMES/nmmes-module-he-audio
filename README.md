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

You may pass the stats class an optional options object.

```javascript
new stats({
    type: 'csv', // Output type, only csv is currently supported
    output: 'stats.csv', // Output location
    /*
    output: '/tmp/stats.csv'
    If output is an absolute path it is not modified.

    output: './stats.csv'
    If output starts with a dot-slash, the path is resolved relative to your current working directory.

    output: 'stats.csv'
    The output is resolved relative to the video's output directory.
    */
    data: ['metadata.input.format.filename', 'metadata.input.format.bit_rate', 'reduction.percent', 'reduction.size']
    /*
    This array contains a list of attributes you would like to record to the stats file.
    metadata.input...: Contains all possibilities from ffprobe -of json -show_streams -show_format /home/user/videos/video.mp4
    reduction.percent: Output file size as a percentage of the input file size
    reduction.size   : The actual change in size (in kilobytes)
    */
});
```
