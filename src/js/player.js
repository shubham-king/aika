import loadHLS from './hls';
import loadDASH from './dash';

class CustomPlayer {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) throw new Error('Container not found');

        this.options = { ...CustomPlayer.defaultOptions, ...options };
        this.init();
    }

    static defaultOptions = {
        src: '',
        type: 'video/mp4', // Supports 'video/mp4', 'application/x-mpegURL' (HLS), 'application/dash+xml' (DASH)
        captions: [],
        theme: 'light', // Supports 'light', 'dark'
        autoplay: false,
        controls: true,
        preload: 'metadata',
    };

    init() {
        this.createVideoElement();
        this.applyTheme();
        this.loadStream();
        this.createControls();
        this.bindEvents();
    }

    createVideoElement() {
        this.video = document.createElement('video');
        Object.assign(this.video, {
            src: this.options.type === 'video/mp4' ? this.options.src : '',
            autoplay: this.options.autoplay,
            preload: this.options.preload,
        });
        this.container.appendChild(this.video);

        // Add captions
        this.options.captions.forEach((caption) => {
            const track = document.createElement('track');
            Object.assign(track, caption);
            this.video.appendChild(track);
        });
    }

    loadStream() {
        if (this.options.type === 'application/x-mpegURL') {
            loadHLS(this.video, this.options.src);
        } else if (this.options.type === 'application/dash+xml') {
            loadDASH(this.video, this.options.src);
        }
    }

    applyTheme() {
        this.container.classList.add(`custom-player-${this.options.theme}`);
    }

    createControls() {
        this.controls = document.createElement('div');
        this.controls.className = 'custom-player-controls';

        // Play/Pause Button
        this.playPauseButton = document.createElement('button');
        this.playPauseButton.textContent = '▶';
        this.controls.appendChild(this.playPauseButton);

        // Progress Bar
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        this.controls.appendChild(this.progressBar);

        // Append controls
        this.container.appendChild(this.controls);
    }

    bindEvents() {
        this.playPauseButton.addEventListener('click', () => {
            if (this.video.paused) {
                this.video.play();
                this.playPauseButton.textContent = '⏸';
            } else {
                this.video.pause();
                this.playPauseButton.textContent = '▶';
            }
        });

        this.video.addEventListener('timeupdate', () => {
            const percent = (this.video.currentTime / this.video.duration) * 100;
            this.progressBar.style.width = `${percent}%`;
        });
    }
}

export default CustomPlayer;
