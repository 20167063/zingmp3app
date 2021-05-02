const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playClick = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtnClick = $('.btn-next');
const prevBtnClick = $('.btn-prev');
const randomBtn = $('.btn-random');
const replBtn = $('.btn-repeat');
const playlists = $('.playlist');


const app = {
    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isRepl: false,
    songs: [
        {
            name: '2 phut hon',
            singer: 'Phao x Masew',
            src: './asset/mp3/2 phut hon.mp3',
            image: './asset/img/1.jpeg'
        },
        {
            name: 'Cradles',
            singer: 'Sub Urban',
            src: './asset/mp3/Cradles.mp3',
            image: './asset/img/2.jpeg'
        },
        {
            name: 'dadada',
            singer: 'Tiktok music',
            src: './asset/mp3/dadada.mp3',
            image: './asset/img/3.jpeg'
        },
        {
            name: 'Despacito',
            singer: 'Luis Fonsi',
            src: './asset/mp3/Despacito.mp3',
            image: './asset/img/4.jpeg'
        },
        {
            name: 'Girls like you',
            singer: 'Maroon 5',
            src: './asset/mp3/Girls Like You.mp3',
            image: './asset/img/5.jpeg'
        },
        {
            name: 'Le lalala has arrived',
            singer: 'Dogger',
            src: './asset/mp3/Le lalala has arrived.mp3',
            image: './asset/img/6.jpeg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            src: './asset/mp3/Nevada.mp3',
            image: './asset/img/7.jpeg'
        },
        {
            name: 'Summertime',
            singer: 'Cinnamons x Evening Cinema',
            src: './asset/mp3/Summertime.mp3',
            image: './asset/img/8.jpeg'
        },
        {
            name: 'Tuy Am',
            singer: 'Xesi x Masew x Nhatnguyen',
            src: './asset/mp3/tuy am.mp3',
            image: './asset/img/9.jpeg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" songIndex=${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
          `
        })
        playlists.innerHTML = htmls.join('')
    },
    handleEvents: function() {
        const cdWidth = $('.cd').offsetWidth;
        const cdAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdAnimate.pause();
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            $('.cd').style.width = newCdWidth > 0 ?newCdWidth + 'px': 0;
            $('.cd').style.opacity = newCdWidth / cdWidth;
        }
        playClick.onclick = function() {
            if(app.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdAnimate.play();
        }
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdAnimate.pause();
        }
        audio.ontimeupdate = function() {
            if(audio.duration){
                progress.value = Math.floor(audio.currentTime / audio.duration * 100)
            }
        }
        progress.onchange = function(e){
            audio.currentTime = e.target.value / 100 * audio.duration;
        }
        nextBtnClick.onclick = function() {
            app.nextSong();
            app.render();
            audio.play();
            app.scrollToView();
        }
        prevBtnClick.onclick = function() {
            app.prevSong();
            app.render();
            audio.play();
            app.scrollToView();
        }
        replBtn.onclick = function() {
            if(!app.isRepl){
                app.isRepl = true;
                replBtn.classList.add('active');
                app.isRandom = false;
                randomBtn.classList.remove('active');
            }else{
                app.isRepl = false;
                replBtn.classList.remove('active');
            }
        }
        randomBtn.onclick = function() {
            if(!app.isRandom){
                app.isRepl = false;
                replBtn.classList.remove('active');
                app.isRandom = true;
                randomBtn.classList.add('active');
            }else{
                app.isRandom = false;
                randomBtn.classList.remove('active');
            }
        }
        audio.onended = function() {
            if(app.isRepl){
                audio.play()
            }else{
                app.nextSong();
                audio.play();
            }
        }
        playlists.onclick = function(e) {
            const songClicked = e.target.closest('.song:not(.active')
            if(songClicked || e.target.closest('.option')){
                if(songClicked){
                   app.currentIndex = Number(songClicked.getAttribute('songIndex'))
                   app.loadCurrentSong();
                   app.render();
                   audio.play();
                }
            }
        }
    }, 
    getCurrentSong: function() {
        return this.songs[this.currentIndex];
    },
    scrollToView: function() {
        setTimeout(()=>{
            // if(app.currentIndex == 0 || app.currentIndex == 1 || app.currentIndex == 2)
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center',

        })
        },500)
    },
    loadCurrentSong: function() {
        const currentSong = this.getCurrentSong();
        
        heading.textContent = currentSong.name;
       
        cdThumb.style.backgroundImage = `url('${currentSong.image}')`
        audio.src = currentSong.src;
    },
    nextSong: function() {
        if(app.isRandom){
            this.randomSong();
        }else{
            this.currentIndex ++;
            if(this.currentIndex > this.songs.length -1 ){
                this.currentIndex = 0;
            }
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        if(app.isRandom){
            this.randomSong();
        }else{
        this.currentIndex --;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1;
        }
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
    },
    start: function() {
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
}

app.start();