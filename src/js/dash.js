import dashjs from 'dashjs';

function loadDASH(videoElement, src) {
    const player = dashjs.MediaPlayer().create();
    player.initialize(videoElement, src, true);
}

export default loadDASH;
