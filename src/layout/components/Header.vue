<template>
    <header :class="Topclass">
        <div class="topmenu">
            <div class="logobox">
                <div class="logo">
                    <button @click="goToPage('/main', 0)">
                        <img src="/images/mj_calc_logo.png" alt="MJ 타점계산기" />
                    </button>
                </div>
            </div>
            <div class="music">
                <button @click="togglePlayback">
                    <i v-if="isPlaying" class="bi bi-pause-circle-fill"></i>
                    <i v-else class="bi bi-play-circle-fill"></i>
                </button>
                <span class="dropdown" @click.stop>
                    <button class="musiclist" @click="toggleDropdown">
                        <i class="bi bi-list-ul"></i>
                    </button>
                    <ul ref="dropdownMenu" class="dropdown-menu" :class="{ 'show': dropdownOpen }"
                        :style="{ right: dropdownXPosition + 'px' }">
                        <li v-for="(song, index) in audioSources" :key="index" @click="selectSong(song)">
                            · {{ song.title }}
                        </li>
                    </ul>
                </span>
                <audio ref="audio" :src="currentAudioSource.src" @ended="playRandomSong"></audio>
            </div>
        </div>
        <nav>
            <div class="menubox">
                <ul>
                    <li v-for="(item, index) in menulists" :key="index" @click="goToPage(item.link, index)"
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
                { menutext: "스케치", link: "/sketch" },
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
            dropdownOpen: false,
            dropdownXPosition: 0,
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
        },
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
            if (this.dropdownOpen) {
                this.calculateDropdownPosition();
            }
        },
        calculateDropdownPosition() {
            const dropdownWidth = this.$refs.dropdownMenu.clientWidth;
            const screenWidth = window.innerWidth;
            this.dropdownXPosition = screenWidth - dropdownWidth - 20; // 여유 공간을 두어 화면을 벗어나지 않도록 함
        },
        selectSong(song) {
            this.currentAudioSource = song;
            this.dropdownOpen = false;
            const audio = this.$refs.audio;
            audio.load();
            audio.onloadeddata = () => {
                audio.play();
                this.isPlaying = true;
                this.startTitleScroll();
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

.dropdown {
    position: relative;
    display: flex;
    justify-content: center;  /* 수평 중앙 정렬 */
    align-items: center;  /* 수직 중앙 정렬 */

    width: 23px;
    height: 27px;
    margin: 1px 0px 0px 5px;
}

.musiclist {
    border: none;
    cursor: pointer;
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.dropdown-menu {
    position: absolute;
    font-size: 10px;
    left: -90px;
    background-color: #edf5f7;
    min-width: 130px;
    box-shadow: 0px 8px 16px 0px rgba(42, 129, 241, 0.699);
    z-index: 1;
    display: none;
    padding: 0px 0px;
    border-radius: 5%;
}

.dropdown-menu.show {
    display: block;
    /* 드롭다운 메뉴가 표시될 때 보이도록 함 */
}

.dropdown-menu li {
    padding: 12px 16px;
    cursor: pointer;
    white-space: nowrap; /* 줄바꿈 방지 */
    overflow: hidden; /* 넘친 내용 숨기기 */
    text-overflow: ellipsis; /* 말줄임표 추가 */
    color: rgb(99, 117, 150);
    font-weight: bold;
}

.dropdown-menu li:hover {
    background-color: #cde5f5;
    border-radius: 5%;
}

.bi-play-circle-fill {
    color: rgb(52, 7, 173);
}

.bi-pause-circle-fill {
    color: rgb(23, 54, 138);
}

.bi-list-ul {
    color: rgb(23, 54, 138);
}
</style>
