/* eslint-disable max-lines-per-function */
(function ctCutscene() {
    /*  Tests for https://youtu.be/xxxxxxxxxx
                  https://www.youtube.com/watch?v=xxxxxxxxxx
                  https://www.youtube.com/embed/xxxxxxxxxx */
    const youtubeRegex = /youtu(\.be\/|be\.com\/(watch\?v=|embed\/))(\w+)/,
    /*  Tests for https://vimeo.com/xxxxxxxxxx
                  https://player.vimeo.com/video/xxxxxxxxxx */
          vimeoRegex = /vimeo\.com\/(video\/)?(\d+)/;

    const playYoutube = function playYoutube(cutscene) {
        return new Promise((resolve, reject) => {
            cutscene.type = 'youtube';
            const parsed = youtubeRegex.exec(cutscene.url);
            const embed = 'https://www.youtube.com/embed/' +
                           parsed[3] +
                           '?enablejsapi=1&controls=0&modestbranding=1&disablekb=1&rel=0&showinfo=0',
                  iframe = document.createElement('iframe');
            iframe.className = 'youtube aFullscreenVideo';
            iframe.src = embed;
            //iframe.style.opacity = 0;
            document.body.appendChild(iframe);
            // See https://developers.google.com/youtube/player_parameters
            const youtubeSdk = document.createElement('script');
            youtubeSdk.src = 'https://www.youtube.com/player_api';
            const [firstScriptTag] = document.getElementsByTagName('script');
            firstScriptTag.parentNode.insertBefore(youtubeSdk, firstScriptTag);
            let player;
            /* global YT */
            window.onYouTubePlayerAPIReady = function onYouTubePlayerAPIReady() {
                player = new YT.Player(iframe, {
                    videoId: parsed[3],
                    events: {
                        onReady: e => {
                            e.target.playVideo();
                            iframe.style.opacity = 1;
                        },
                        onStateChange: e => {
                            if (e.data === YT.PlayerState.ENDED) {
                                cutscene.remove(cutscene);
                                resolve();
                            }
                        },
                        onError: err => {
                            cutscene.remove(cutscene);
                            reject(err);
                        }
                    }
                });
                cutscene.raw = player;
            };
        });
    };

    const playVimeo = function playVimeo(cutscene) {
        const vimeo = vimeoRegex.exec(cutscene.url);
        return new Promise((resolve, reject) => {
            cutscene.type = 'vimeo';
            const embed = 'https://player.vimeo.com/video/' + vimeo[2] + '?autoplay=1&title=0&byline=0&portrait=0&controls=0dnt=1&fun=0&playsinline=1',
                  iframe = document.createElement('iframe');
            iframe.className = 'vimeo aFullscreenVideo';
            iframe.src = embed;
            document.body.appendChild(iframe);
            const vimeoSdk = document.createElement('script');
            vimeoSdk.src = 'https://player.vimeo.com/api/player.js';
            document.body.appendChild(vimeoSdk);
            /* global Vimeo */
            vimeoSdk.onload = () => {
                setTimeout(() => {
                    const player = new Vimeo.Player(iframe);
                    cutscene.raw = player;
                    player.setAutopause(false);
                    player.play();
                    player.on('ended', () => {
                        cutscene.remove(cutscene);
                        resolve();
                    });
                    player.on('error', e => {
                        cutscene.remove(cutscene);
                        reject(e);
                    });
                }, 0);
            };
        });
    };

    const playVideo = function playVideo(cutscene, formats) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            cutscene.type = 'file';
            video.className = 'direct aFullscreenVideo'; /* надо написать CSS-класс, чтобы заполнить весь экран */
            video.addEventListener('canplaythrough', () => {
                document.body.appendChild(video);
            });
            video.addEventListener('ended', () => {
                cutscene.remove(cutscene);
                resolve();
            });
            video.addEventListener('abort', e => {
                cutscene.remove(cutscene);
                reject(e);
            });
            video.addEventListener('error', e => {
                cutscene.remove(cutscene);
                reject(e);
            });

            video.controls = false;
            video.autoplay = true;
            for (const format in formats) {
                const source = document.createElement('source');
                video.appendChild(source);
                source.src = formats[format];
                source.type = `video/${format}`;
            }
            document.body.appendChild(video);
            video.load();
            cutscene.raw = video;
        });
    };

    window.cutscene = {
        remove(cutscene) {
            if (cutscene.removed) {
                throw new Error(`[cutscene]: This cutscene (${cutscene.url}) has already been removed! Clean up any references to it to clear the memory.`);
            }
            if (cutscene.type === 'vimeo' || cutscene.type === 'youtube') {
                cutscene.raw.destroy();
            } else {
                document.body.removeChild(cutscene.raw);
            }
            cutscene.removed = true;
        },
        show(url) {
            var promise,
                cutscene = {
                    url,
                    raw: null
                };
            if (typeof url === 'string') {
                var youtube = youtubeRegex.test(url),
                    vimeo = vimeoRegex.test(url);
                if (youtube) {
                    promise = playYoutube(cutscene);
                } else if (vimeo) {
                    promise = playVimeo(cutscene);
                } else {
                    const formats = {};
                    formats[url.split('.').pop()] = url;
                    promise = playVideo(cutscene, formats);
                }
            } else {
                // Assume an object with format: url values
                promise = playVideo(cutscene, url);
            }
            cutscene.then = promise.then.bind(promise);
            cutscene.catch = promise.catch.bind(promise);
            cutscene.finally = promise.finally.bind(promise);
            return cutscene;
        }
    };
})();
