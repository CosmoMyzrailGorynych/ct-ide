(function () {
    /*  Tests for https://youtu.be/xxxxxxxxxx
                  https://www.youtube.com/watch?v=xxxxxxxxxx
                  https://www.youtube.com/embed/xxxxxxxxxx */
    const youtubeRegex = /youtu(\.be\/|be\.com\/(watch\?v=|embed\/))(\w+)/,
    /*  Tests for https://vimeo.com/xxxxxxxxxx
                  https://player.vimeo.com/video/xxxxxxxxxx */
          vimeoRegex = /vimeo\.com\/(video\/)?(\d+)/;
    ct.cutscene = {
        remove(cutscene) {
            if (cutscene.removed) {
                throw new Error(`[ct.cutscene]: This cutscene (${cutscene.url}) has already been removed! Clean up any references to it to clear the memory.`);
            }
            if (cutscene.type === 'vimeo' || cutscene.type === 'youtube') {
                cutscene.raw.destroy();
            } else {
                document.body.removeChild(cutscene.raw);
            }
            cutscene.removed = true;
        },
        show(url) {
            var youtube = youtubeRegex.exec(url),
                vimeo = vimeoRegex.exec(url),
                cutscene = {
                    url,
                    raw: null
                };
            var promise = new Promise((resolve, reject) => {
                if (youtube) {
                    cutscene.type = 'youtube';
                    const embed = 'https://www.youtube.com/embed/'+ youtube[3] + '?enablejsapi=1&controls=0&modestbranding=1&disablekb=1&rel=0&showinfo=0',
                          iframe = document.createElement('iframe');
                    iframe.className = 'youtube aFullscreenVideo';
                    iframe.src = embed;
                    //iframe.style.opacity = 0;
                    document.body.appendChild(iframe);
                    // See https://developers.google.com/youtube/player_parameters
                    const tag = document.createElement('script');
                    tag.src = 'https://www.youtube.com/player_api';
                    const [firstScriptTag] = document.getElementsByTagName('script');
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    let player;
                    /* global YT */
                    window.onYouTubePlayerAPIReady = function() {
                        player = new YT.Player(iframe, {
                            videoId: youtube[3],
                            events: {
                                onReady: e => {
                                    e.target.playVideo();
                                    iframe.style.opacity = 1;
                                    console.log('onReady');
                                },
                                onStateChange: data => {
                                    console.log(data, 'statechange');
                                    if (data.data === YT.PlayerState.ENDED) {
                                        ct.cutscene.remove(cutscene);
                                        resolve();
                                    }
                                },
                                onError: err => {
                                    ct.cutscene.remove(cutscene);
                                    reject(err);
                                }
                            }
                        });
                        cutscene.raw = player;
                    };
                } else if (vimeo) {
                    cutscene.type = 'vimeo';
                    const embed = 'https://player.vimeo.com/video/'+ vimeo[2] + '?autoplay=1&title=0&byline=0&portrait=0&controls=0dnt=1&fun=0&playsinline=1',
                          iframe = document.createElement('iframe');
                    iframe.className = 'vimeo aFullscreenVideo';
                    iframe.src = embed;
                    document.body.appendChild(iframe);
                    const tag = document.createElement('script');
                    tag.src = 'https://player.vimeo.com/api/player.js';
                    document.body.appendChild(tag);
                    /* global Vimeo */
                    tag.onload = () => {
                        setTimeout(() => {
                            const player = new Vimeo.Player(iframe);
                            cutscene.raw = player;
                            player.setAutopause(false);
                            player.play();
                            player.on('ended', () => {
                                ct.cutscene.remove(cutscene);
                                resolve();
                            });
                            player.on('error', e => {
                                ct.cutscene.remove(cutscene);
                                reject(e);
                            });
                        }, 1000);
                    };
                } else {
                    const video = document.createElement('video');
                    cutscene.type = 'file';
                    video.className = 'direct aFullscreenVideo'; /* надо написать CSS-класс, чтобы заполнить весь экран */
                    video.addEventListener('canplaythrough', () => {
                        document.body.appendChild(video);
                    });
                    video.addEventListener('ended', () => {
                        ct.cutscene.remove(cutscene);
                        resolve();
                    });
                    video.on('abort', e => {
                        ct.cutscene.remove(cutscene);
                        reject(e);
                    });
                    video.on('error', e => {
                        ct.cutscene.remove(cutscene);
                        reject(e);
                    });

                    video.controls = false;
                    video.autoplay = true;
                    video.src = url;
                    video.load();
                    cutscene.raw = video;
                }
            });
            cutscene.then = promise.then.bind(promise);
            cutscene.catch = promise.catch.bind(promise);
            cutscene.finally = promise.finally.bind(promise);
            return cutscene;
        }
    };
})();
