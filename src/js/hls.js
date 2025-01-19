import Hls from 'hls.js';

function loadHLS(videoElement, src) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = src;
    } else {
        console.error('HLS is not supported on this browser.');
    }
}

export default loadHLS;
