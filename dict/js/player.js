(function () {
    class CustomPlayer {
        constructor(selector, options = {}) {
            this.container = document.querySelector(selector);
            if (!this.container) throw new Error('Container not found');

            this.options = {
                src: '',
                type: 'video/mp4',
                captions: [],
                theme: 'light',
                autoplay: false,
                controls: true,
                preload: 'metadata',
                ...options,
            };

            this.init();
        }

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

            this.options.captions.forEach((caption) => {
                const track = document.createElement('track');
                Object.assign(track, caption);
                this.video.appendChild(track);
            });
        }

        applyTheme() {
            this.container.classList.add(`custom-player-${this.options.theme}`);
        }

        createControls() {
            const controls = document.createElement('div');
            controls.className = 'custom-player-controls';

            // Play/Pause
            const playPause = document.createElement('button');
            playPause.textContent = '▶';
            controls.appendChild(playPause);

            // Progress Bar
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            controls.appendChild(progressBar);

            this.container.appendChild(controls);

            this.controls = { playPause, progressBar };
        }

        loadStream() {
            if (this.options.type === 'application/x-mpegURL') {
                this.loadHLS();
            } else if (this.options.type === 'application/dash+xml') {
                this.loadDASH();
            }
        }

        loadHLS() {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(this.options.src);
                hls.attachMedia(this.video);
            } else {
                this.video.src = this.options.src;
            }
        }

        loadDASH() {
            const dash = dashjs.MediaPlayer().create();
            dash.initialize(this.video, this.options.src, true);
        }

        bindEvents() {
            const { playPause, progressBar } = this.controls;

            playPause.addEventListener('click', () => {
                if (this.video.paused) {
                    this.video.play();
                    playPause.textContent = '⏸';
                } else {
                    this.video.pause();
                    playPause.textContent = '▶';
                }
            });

            this.video.addEventListener('timeupdate', () => {
                const percent = (this.video.currentTime / this.video.duration) * 100;
                progressBar.style.width = `${percent}%`;
            });
        }
    }

    window.CustomPlayer = CustomPlayer;
})();
