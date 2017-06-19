'use strict';

const nmmes = require('nmmes-backend');
const Logger = nmmes.Logger;
const chalk = require('chalk');

/**
 * Arguments
 * downmix - should audio be downmixed as well
 */

module.exports = class HeAudio extends nmmes.Module {
    constructor(args) {
        super(require('./package.json'));

        this.args = Object.assign({
            encodeLossless: false,
            bitratePerChannel: 40 // In kilobytes
        }, args);
    }
    executable(video, map) {
        let args = this.args;
        let changes = {
            streams: {}
        };

        return new Promise(function(resolve, reject) {
            const streams = Object.values(map.streams);
            for (let pos in streams) {
                const stream = streams[pos];
                const identifier = stream.map.split(':');
                const input = identifier[0];
                const index = identifier[1];
                const metadata = video.input.metadata[input].streams[index];

                if (metadata.codec_type !== 'audio') continue;
                if (~metadata.codec_name.toLowerCase().indexOf('lossless') && !args.encodeLossless) {
                    Logger.debug(`Audio stream ${chalk.bold(formatStreamTitle(metadata))} [${chalk.bold(stream.map)}] will not be encoded to he audio because it is lossless.`);
                    continue;
                }

                Logger.debug(`Applying he audio to audio stream ${chalk.bold(formatStreamTitle(metadata))} [${chalk.bold(stream.map)}]`);
                changes.streams[index] = {
                    ['c:' + pos]: 'libopus',
                    ['b:' + pos]: metadata.channels * args.bitratePerChannel + 'k',
                    ['af']: `aformat=channel_layouts=${formatAudioChannels(metadata.channels)}`
                };
            }
            resolve(changes);
        });
    };
}

function formatAudioChannels(numChannels) {
    let string = "";
    switch (numChannels) {
        case 1:
            string += "mono";
            break;
        case 2:
            string += "stereo";
            break;
        default:
            const isOdd = numChannels % 2 === 1;
            string += isOdd ? numChannels - 1 : numChannels;
            if (isOdd) string += '.1';
            else string += '.0'
            break;
    }
    return string;
}

function formatStreamTitle(stream) {
    return stream.title || stream.tags ? stream.tags.title : undefined;
}
