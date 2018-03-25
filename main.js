'use strict';

const nmmes = require('nmmes-backend');
const Logger = nmmes.Logger;
const chalk = require('chalk');

module.exports = class HeAudio extends nmmes.Module {
    constructor(args, logger = Logger) {
        super(require('./package.json'));
        this.logger = logger;

        this.options = Object.assign(nmmes.Module.defaults(HeAudio), args);
    }
    executable(map) {
        let _self = this;
        let options = this.options;
        let changes = {
            streams: {}
        };
        let modifiedStreams = 0;
        let totalAudioStreams = 0;

        return new Promise(function(resolve, reject) {
            const streams = Object.values(map.streams);
            for (let pos in streams) {
                const stream = streams[pos];
                const identifier = stream.map.split(':');
                const input = identifier[0];
                const index = identifier[1];
                const metadata = _self.video.input.metadata[input].streams[index];

                if (metadata.codec_type !== 'audio') continue;
                ++totalAudioStreams;

                if (~metadata.codec_name.toLowerCase().indexOf('lossless') && !options.force) {
                    _self.logger.debug(`Audio stream ${chalk.bold(formatStreamTitle(metadata))} [${chalk.bold(stream.map)}] will not be encoded to he audio because it is lossless.`);
                    continue;
                }

                _self.logger.debug(`Applying he audio to audio stream ${chalk.bold(formatStreamTitle(metadata))} [${chalk.bold(stream.map)}]`);
                changes.streams[index] = {
                    ['c:' + pos]: 'libopus',
                    ['b:' + pos]: metadata.channels * options.bitrate + 'k',
                    af: [`aformat=channel_layouts=${formatAudioChannels(metadata.channels)}`]
                };

                if (metadata.channels > 3 && options.downmix) {
                    changes.streams[index].af.push('aresample=matrix_encoding=dplii')
                    changes.streams[index].ac = 2;
                }
            }
            resolve(changes);
        });
    };
    static options() {
        return {
            'force': {
                default: false,
                describe: 'Convert all audio to HE format, including lossless formats.',
                type: 'boolean',
                group: 'Audio:'
            },
            'downmix': {
                default: false,
                describe: `Downmix he-audio opus to Dolby Pro Logic II.`,
                type: 'boolean',
                group: 'Audio:'
            },
            'bitrate': {
                default: 40,
                describe: `Sets encoding bitrate for he-audio per channel.`,
                type: 'boolean',
                group: 'Audio:'
            },
        };
    }
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
