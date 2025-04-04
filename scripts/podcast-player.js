import { showScrubberThumb, hideScrubberThumb } from "./helpers/fade-scrubber-thumb.js";
import { isIOS, formatTime, initLocalStorageItem, throttle } from './helpers/utils.js';
import podcastPlayerTemplate from './template.js';

// Custom Element
export default class PodcastPlayer extends HTMLElement {

    // static get observedAttributes() {
    //     return ['data-position', 'data-variation'];
    // }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (oldValue !== newValue) {
    //         switch (name) {
    //             case 'data-position':
    //                 this.podcastPlayer.setAttribute("position", newValue);
    //                 break;
    //             case 'data-variation':
    //                 this.podcastPlayer.setAttribute("variation", newValue);
    //                 break;
    //         }
    //     }
    // }

    constructor() {
        super();
        this.showOn = this.getAttribute('show-on');
        this.initSrcAttribute();
        this.initSvgBaseAttribute();
        this.initLocalStorage();
    }
    
    connectedCallback() {
        this.scopeStyles();
        this.injectStylesFromGlobal();

        this.injectTemplate();
        this.initRefs();
        this.processLightDomIcons();
        this.initUi();

        this.addEventListeners();
        this.addShareFunctionality();
        this.addShowOn();
    }

    disconnectedCallback() {
        document.querySelector('body').classList.remove('audio-playing', 'audio-paused');
    }

    // Refs
    initRefs() {
        // Element references
        this.showAndPlay = this.querySelector('.show-and-play'); // slotted from Light DOM
        const el = this.shadowRoot ?? this;
        this.ppWrapper = el.querySelector('.pp-wrapper');
        this.audio = el.querySelector('audio');
        this.podcastPlayer = el.querySelector('.podcast-player');
        this.playPauseButton = el.querySelector('.play-pause');
        this.scrubber = el.querySelector('#scrubber');
        this.timeDisplayCurrent = el.querySelector('#time-display-current time');
        this.timeDisplayEnd = el.querySelector('#time-display-end time');
        this.muteButton = el.querySelector('.mute');
        this.volumeControl = el.querySelector('#volume-control');
        this.speedControl = el.querySelector('#speed-control');
        this.shareButton = el.querySelector('.share-button');
        this.moveButton = el.querySelector('.icon-move');
        this.closeButton = el.querySelector('.icon-close');
        this.volumeGroup = el.querySelector('.volume-group');
    }

    // Event Listeners
    addEventListeners() {
        const rh = this.registerHandler.bind(this);
        this.handlers = [];
        // add handle- functions as methods of this class
        rh(this.handleShowAndPlay, this.showAndPlay);
        rh(this.handleTogglePlayPause, this.playPauseButton);

        rh(this.handleMouseEnterShowAndPlay, this.showAndPlay, 'mouseenter');
        rh(this.handleMouseLeaveShowAndPlay, this.showAndPlay, 'mouseleave');
        rh(this.handleMouseEnterPlayPause, this.playPauseButton, 'mouseenter');
        rh(this.handleMouseLeavePlayPause, this.playPauseButton, 'mouseleave');
        rh(this.handleMouseEnterClose, this.closeButton, 'mouseenter');
        rh(this.handleMouseLeaveClose, this.closeButton, 'mouseleave');

        // display the duration if the metadata of the audio is available. If it is not available, we add the event listener
        // see: https://css-tricks.com/lets-create-a-custom-audio-player/#aa-display-the-audio-duration
        // rh(handleLoadMetadata, this.audio, 'loadedmetadata');
        if (this.audio.readyState > 0) this.handleLoadMetadata();
        else rh(this.handleLoadMetadata, this.audio, 'loadedmetadata');

        rh(this.handleUpdateTime, this.audio, 'timeupdate');
        rh(this.handleScrub, this.scrubber, 'input');
        rh(this.handleChangeSpeed, this.speedControl, 'change');
        rh(this.handleControlVolume, this.volumeControl, 'input');
        rh(this.handleToggleMute, this.muteButton);
        rh(this.handleMove, this.moveButton);
        rh(this.handleClose, this.closeButton);
    }


    // Handlers

    handleToggleMute() {
        this.audio.muted = !this.audio.muted;
        localStorage.setItem('pp-mute', this.audio.muted);
        if (this.audio.muted) {
            this.muteButton.querySelector('.mute-svg').classList.add('hidden');
            this.muteButton.querySelector('.unmute-svg').classList.remove('hidden');
        } else {
            this.muteButton.querySelector('.mute-svg').classList.remove('hidden');
            this.muteButton.querySelector('.unmute-svg').classList.add('hidden');
        }
    }

    handleClose(event) {
        if (this.audio.paused === false) this.handleShowAndPlay(event);
        this.podcastPlayer.classList.remove('show');
        this.removeAttribute('showing-player');
        this.podcastPlayer.setAttribute('inert', '');
    }

    handleMove() {
        if (this.podcastPlayer.dataset.position !== 'top') {
            localStorage.setItem('pp-position', 'top');
            this.setAttribute('data-position', 'top');
            this.podcastPlayer.dataset.position = 'top';
        }
        else {
            localStorage.setItem('pp-position', 'bottom');
            this.setAttribute('data-position', 'bottom');
            this.podcastPlayer.dataset.position = 'bottom';
        }
    }

    handleShowAndPlay(event) {
        event.preventDefault();
        this.showPlayer();
        this.handleTogglePlayPause(event);
    }

    beforePlay() {
        const audio = this.audio;
        audio.playbackRate = localStorage.getItem('pp-speed') || 1;
        audio.volume = localStorage.getItem('pp-volume') ?? .7;
        // if the audio isn't muted but it should be (from localStorage)
        if (!audio.muted && localStorage.getItem('pp-mute') === 'true')
            this.handleToggleMute();
    }

    handleTogglePlayPause(event) {
        event.preventDefault();
        const audio = this.audio;
        if (audio.paused) { // ▶︎
            this.beforePlay();
            audio.play();
            this.ppWrapper.classList.add('audio-playing');
            document.querySelector('body').classList.add('audio-playing');
            this.ppWrapper.classList.remove('audio-paused');
            document.querySelector('body').classList.remove('audio-paused');
        } else { // ❚❚
            audio.pause();
            this.ppWrapper.classList.add('audio-paused');
            document.querySelector('body').classList.add('audio-paused');
            this.ppWrapper.classList.remove('audio-playing');
            document.querySelector('body').classList.remove('audio-playing');
        }
    }

    handleLoadMetadata() {
        const duration = this.audio.duration;
        this.scrubber.max = duration;
        this.timeDisplayEnd.textContent = formatTime(duration);
        this.updateSecondsFromUrl();
        const currentTime = this.audio.currentTime;
        this.timeDisplayCurrent.textContent = formatTime(currentTime);
        this.scrubber.value = currentTime;
        showScrubberThumb(); // show scrubber after it's been set
    }

    // handleUpdateTime() {
    //     const currentTime = this.audio.currentTime;
    //     this.scrubber.value = currentTime;
    //     this.timeDisplayCurrent.textContent = formatTime(currentTime);
    // }

    handleUpdateTime = throttle(function () {
        const currentTime = this.audio.currentTime;
        this.scrubber.value = currentTime;
        this.timeDisplayCurrent.textContent = formatTime(currentTime);
    }, 300); // don't run more than once per this many milliseconds

    handleScrub() {
        this.audio.currentTime = this.scrubber.value;
    }

    handleChangeSpeed() {
        this.audio.playbackRate = this.speedControl.value;
        localStorage.setItem('pp-speed', this.speedControl.value);
    }

    handleControlVolume() {
        this.audio.volume = this.volumeControl.value;
        localStorage.setItem('pp-volume', this.volumeControl.value);
    }

    // Hover Handlers
    handleMouseEnterShowAndPlay() { this.podcastPlayer.classList.add('related-hover'); }
    handleMouseLeaveShowAndPlay() { this.podcastPlayer.classList.remove('related-hover'); }
    handleMouseEnterPlayPause() { this.showAndPlay.classList.add('related-hover'); }
    handleMouseLeavePlayPause() { this.showAndPlay.classList.remove('related-hover'); }
    handleMouseEnterClose() { this.showAndPlay.classList.add('related-hover'); }
    handleMouseLeaveClose() { this.showAndPlay.classList.remove('related-hover'); }


    // Helpers

    registerHandler(fn, el, ev = 'click') {
        this[fn.name] = fn.bind(this);
        el.addEventListener(ev, this[fn.name]);
        this.handlers.push([fn, el, ev]);
    }

    unregisterHandler(fn, el, ev = 'click') {
        el.removeEventListener(ev, this[fn.name]);
    }

    addShowOn() {
        if (this.showOn === 'scroll' || !this.showOn) this.addIntersectionObserver();
        if (this.showOn === 'click') return;
        if (this.showOn === 'load') this.showPlayer();
        if (this.showOn === 'hover') this.showAndPlay.addEventListener('mouseenter', () => this.showPlayer() );
    }

    addIntersectionObserver() {
        const observerOptions = {
            threshold: 1,
            rootMargin: "100px 0px -100px 0px",
        };
        let flag = 0;
        const observer = new IntersectionObserver((entry) => {
            if (!entry.isIntersecting) {
                if (flag) {
                    this.showPlayer();
                    observer.unobserve(this.showAndPlay);
                } else { flag = 1; }
            }
        }, observerOptions);
        observer.observe(this.showAndPlay);
    }

    addShareFunctionality() {
        if (!navigator.share) { this.shareButton.style.display = 'none'; return; }
        this.shareButton.addEventListener('click', event => {
            const seconds = Math.floor(this.audio.currentTime);
            const url = new URL(window.location.href);
            if (seconds) url.searchParams.set('seconds', seconds);
            const urlStr = url.toString();
            const title = document.title + (seconds ? ` (${formatTime(seconds)})` : '');
            navigator.share({ title: title, url: urlStr }).catch(() => null);
        });
    }

    showPlayer() {
        this.podcastPlayer.classList.add('show');
        this.setAttribute('showing-player', '');
        this.podcastPlayer.removeAttribute('inert');
        this.podcastPlayer.hidden = false;
    }

    initLocalStorage() {
        // set default values if they don't exist
        initLocalStorageItem('pp-position', this.getAttribute('data-position') ?? 'bottom');
        initLocalStorageItem('pp-volume', .7);
        initLocalStorageItem('pp-speed', 1);
        initLocalStorageItem('pp-mute', false);
    }

    updateSecondsFromUrl() {
        let url = new URL(window.location.href);
        let seconds = url.searchParams.get('seconds');
        if (!seconds) return;
        // if ?seconds= in URL, remove it, set time, show player
        url.searchParams.delete('seconds'); window.history.pushState({}, '', url);
        this.audio.currentTime = seconds;
        this.showPlayer();
    }

    initUi() {
        this.audio.hidden = true; // hide native audio element
    
        const position = localStorage.getItem('pp-position');
        this.setAttribute('data-position', position);
        this.podcastPlayer.dataset.position = position;
    
        const variation = this.getAttribute('data-variation'); // not stored in localStorage
        this.podcastPlayer.dataset.variation = variation;
    
        this.speedControl.value = localStorage.getItem('pp-speed');
        this.volumeControl.value = localStorage.getItem('pp-volume');
        hideScrubberThumb(); // hide scrubber thumb (gets shown in handleLoadMetadata)
        if (isIOS()) { // hide volume on iOS
            this.volumeGroup.style.display = 'none';
        }
    }

    injectTemplate() {
        const el = this.shadowRoot ?? this;
        el.innerHTML += podcastPlayerTemplate({
            src: this.getAttribute('data-src'),
            title: this.getAttribute('data-title'),
            thumb: this.getAttribute('data-thumb'),
            position: this.getAttribute('data-position'),
            variation: this.getAttribute('data-variation'),
            svgBase: this.getAttribute('svg-base'),
        });
    }

    initSrcAttribute() {
        // if (this.hasAttribute('data-src')) return;
        const src = this.querySelector('.show-and-play').getAttribute('href');
        if (!src) return;
        this.setAttribute('data-src', src);
    }

    initSvgBaseAttribute() {
        if (this.hasAttribute('svg-base')) return;
        const selector = `link.fpp[rel=icon-sprite-sheet]`;
        const svgBase = document.querySelector(selector)?.getAttribute('href');
        if(!svgBase) return;
        this.setAttribute('svg-base', svgBase);
    }

    processLightDomIcons() {
        const defaults = [
            { text: "Play", icon: "play-circle-solid" },
            { text: "Pause", icon: "pause-circle" },
            { text: "Resume", icon: "play-circle" }
        ];
        let icons = this.showAndPlay.querySelectorAll('& > *'); // '[icon-name]'

        // if it only has a text node, wrap it in a span
        if (this.showAndPlay.childNodes.length === 1 && this.showAndPlay.childNodes[0].nodeType === 3) {
            const textWrapper = document.createElement('span');
            textWrapper.textContent = this.showAndPlay.textContent;
            this.showAndPlay.textContent = '';
            this.showAndPlay.appendChild(textWrapper);
            icons = this.showAndPlay.querySelectorAll('& > *');
        }

        const svgBase = this.getAttribute('svg-base');
        defaults.forEach((item, i) => {    
            if (icons[i]) {
                // Wrap existing content
                const textWrapper = document.createElement('span');
                while (icons[i].firstChild) textWrapper.appendChild(icons[i].firstChild);
                icons[i].appendChild(textWrapper);
            } else {
                // Create new element
                const textWrapper = document.createElement('span');
                textWrapper.textContent = item.text;
                this.showAndPlay.appendChild(textWrapper);
                icons = this.showAndPlay.querySelectorAll('& > *');
            }
    
            // Add SVG element
            const iconName = icons[i].getAttribute('icon-name') || item.icon;
            const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            useElement.setAttribute('href', `${svgBase}#${iconName}`);
            svgElement.appendChild(useElement);
            svgElement.setAttribute('aria-hidden', 'true');
            icons[i].insertBefore(svgElement, icons[i].firstChild);
        });
    }

    scopeStyles() {
		// Add Shadow DOM if not added yet
		if (!this.shadowRoot) {
			this.attachShadow({ mode: 'open' });		
			// slot any existing content (Light DOM)
			// const slot = document.createElement('slot');
			// this.shadowRoot.appendChild(slot);
        }
		// Add the scoped stylesheet(s)
		const selector = "link.fpp[media=none][rel=stylesheet]";
        const stylesheets = document.querySelectorAll(selector);
        if (!stylesheets) return;
		stylesheets.forEach(stylesheet => {
			const clone = stylesheet.cloneNode(true);
			clone.setAttribute("media", "all");
            this.shadowRoot.appendChild(clone);
        });
    }
    
    injectStylesFromGlobal() {
        const selector = "link.fpp[rel=stylesheet]:not([media=none])";
        const stylesheets = document.querySelectorAll(selector);
        if (!stylesheets) return;
        stylesheets.forEach(stylesheet => {
			const clone = stylesheet.cloneNode(true);
            this.shadowRoot.appendChild(clone);
        });
    }

}

customElements.define('podcast-player', PodcastPlayer);