<template>
    <header :class="Topclass">
        <div class="topmenu">
            <div class="logobox">
                <div class="logo">
                    <button v-on:click="goToPage('/main', 0)">
                        <img src="/images/mj_calc_logo.png" alt="MJ 타점계산기" />
                    </button>
                </div>
            </div>
            <div class="music">
                <button @click="togglePlayback">
                    <i v-if="isPlaying" class="bi bi-pause-circle-fill"></i>
                    <i v-else class="bi bi-play-circle-fill"></i>
                </button>
                <audio ref="audio" :src="currentAudioSource.src" @ended="playRandomSong"></audio>
            </div>
        </div>
        <nav>
            <div class="menubox">
                <ul>
                    <li v-for="(item, index) in menulists" :key="index" v-on:click="goToPage(item.link, index)"
                        :class="{ selected: selectedIndex === index }">
                        <button v-html="item.menutext"></button>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            menulists: [
                { menutext: "타점 계산", link: "/main" },
                { menutext: "정보", link: "/info" },
                { menutext: "테스트", link: "/test" },
            ],
            selectedIndex: 0,
            form: {
                id: "",
                pass: "",
                mail: "",
                checkedtype: [],
            },
            Topclass: "",
            isPlaying: false,
            audioSources: [],
            currentAudioSource: {},
            lastPlayedIndex: -1,
            originalTitle: 'MJ 타점계산기',
            scrollTitle: '',
        };
    },
    async mounted() {
        await this.loadMusicData();
        this.currentAudioSource = this.getRandomSong();
    },
    beforeDestroy() {
        this.stopTitleScroll();
    },
    methods: {
        async loadMusicData() {
            try {
                const response = await axios.get('/config/music_list.json');
                this.audioSources = response.data;
                this.currentAudioSource = this.getRandomSong();
            } catch (error) {
                console.error('Error loading music data:', error);
            }
        },
        goToPage(target, index) {
            if (this.$router.currentRoute.path !== target) {
                this.selectedIndex = index;
                this.$router.push(target);
            }
        },
        Joinmember(event) {
            event.preventDefault();
            alert(JSON.stringify(this.form));
            this.$nextTick(() => {
                this.form.id = "";
                this.form.pass = "";
                this.form.mail = "";
                this.form.checkedtype = [];
            });
        },
        handleScroll() {
            const scrollTop = window.pageYOffset;
            const headerTop = document.querySelector("header").clientHeight;
            if (scrollTop < headerTop) {
                this.Topclass = "";
            } else {
                this.Topclass = "scrollTop";
            }
        },
        togglePlayback() {
            const audio = this.$refs.audio;
            if (this.isPlaying) {
                audio.pause();
                this.stopTitleScroll();
            } else {
                audio.play();
                this.startTitleScroll();
            }
            this.isPlaying = !this.isPlaying;
        },
        startTitleScroll() {
            this.stopTitleScroll();  // 기존 인터벌 중지
            const musicTitle = ` [ ♫ ${this.currentAudioSource.title} ]`;
            const padding = ' ···';
            this.scrollTitle = musicTitle + padding.repeat(5);
            let scrollIndex = 0;

            this.titleScrollInterval = setInterval(() => {
                document.title = this.scrollTitle.substring(scrollIndex) + this.scrollTitle.substring(0, scrollIndex);
                scrollIndex = (scrollIndex + 1) % this.scrollTitle.length;
            }, 800);
        },
        stopTitleScroll() {
            clearInterval(this.titleScrollInterval);
            document.title = this.originalTitle;
        },
        getRandomSong() {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * this.audioSources.length);
            } while (randomIndex === this.lastPlayedIndex);

            this.lastPlayedIndex = randomIndex;
            return this.audioSources[randomIndex];
        },
        playRandomSong() {
            this.currentAudioSource = this.getRandomSong();
            this.startTitleScroll();
            const audio = this.$refs.audio;
            audio.load();
            audio.onloadeddata = () => {
                audio.play();
            };
        }
    }
};
</script>

<style>
.topmenu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.logobox {
    flex: 1;
    text-align: center;
}

.music {
    position: absolute;
    bottom: 10px;
    right: 20px;
    z-index: 10;
    display: flex;
    align-items: center;
}

.bi-play-circle-fill {
    color: rgb(52, 7, 173);
}

.bi-pause-circle-fill {
    color: rgb(23, 54, 138);
}
</style>
