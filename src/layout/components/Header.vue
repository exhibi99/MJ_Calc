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
                        :style="{ right: dropdownXPosition + 'px' }" @mouseover="clearDropdownTimeout"
                        @mouseleave="startDropdownTimeout">
                        <li v-for="(song, index) in paginatedAudioSources" :key="index" @click="selectSong(song)">
                            · {{ song.title }}
                        </li>
                        <li class="pagination-controls">
                            <button @click="prevPage" :disabled="currentPage === 1">이전</button>
                            <span>{{ currentPage }} / {{ totalPages }}</span>
                            <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
                        </li>
                    </ul>
                </span>
                <audio ref="audio" :src="currentAudioSource.src" @ended="playNextSong"></audio>
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
            dropdownTimeout: null,
            currentPage: 1,
            itemsPerPage: 8,
            shuffledIndices: [],
            currentIndex: 0,
        };
    },
    async mounted() {
        await this.loadMusicData();
        this.shuffleSongs();
        this.currentAudioSource = this.audioSources[this.shuffledIndices[this.currentIndex]];
        document.addEventListener('mousedown', this.onDropdownClickOutside);
    },
    beforeDestroy() {
        this.stopTitleScroll();
        document.removeEventListener('mousedown', this.onDropdownClickOutside);
    },
    computed: {
        paginatedAudioSources() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.audioSources.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.audioSources.length / this.itemsPerPage);
        }
    },
    methods: {
        async loadMusicData() {
            try {
                const response = await axios.get('/config/music_list.json');
                this.audioSources = response.data;
                this.shuffleSongs();
                this.currentAudioSource = this.audioSources[this.shuffledIndices[this.currentIndex]];
            } catch (error) {
                console.error('음악 데이터를 불러오는 중 오류 발생:', error);
            }
        },
        shuffleSongs() {
            this.shuffledIndices = Array.from(Array(this.audioSources.length).keys());
            for (let i = this.shuffledIndices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.shuffledIndices[i], this.shuffledIndices[j]] = [this.shuffledIndices[j], this.shuffledIndices[i]];
            }
        },
        playNextSong() {
            this.currentIndex++;
            if (this.currentIndex < this.shuffledIndices.length) {
                this.currentAudioSource = this.audioSources[this.shuffledIndices[this.currentIndex]];
                this.startTitleScroll();
                const audio = this.$refs.audio;
                audio.load();
                audio.onloadeddata = () => {
                    audio.play();
                };
            } else {
                this.stopPlayback();
            }
        },
        stopPlayback() {
            this.isPlaying = false;
            this.stopTitleScroll();
        },
        goToPage(target, index) {
            if (this.$router.currentRoute.path !== target) {
                this.selectedIndex = index;
                this.$router.push(target);
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
            this.stopTitleScroll();
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
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
            if (this.dropdownOpen) {
                this.calculateDropdownPosition();
                this.startDropdownTimeout();
            } else {
                this.clearDropdownTimeout();
            }
        },
        startDropdownTimeout() {
            this.clearDropdownTimeout();
            this.dropdownTimeout = setTimeout(() => {
                this.dropdownOpen = false;
            }, 5000);
        },
        clearDropdownTimeout() {
            if (this.dropdownTimeout) {
                clearTimeout(this.dropdownTimeout);
                this.dropdownTimeout = null;
            }
        },
        calculateDropdownPosition() {
            const dropdownWidth = this.$refs.dropdownMenu.clientWidth;
            const screenWidth = window.innerWidth;
            this.dropdownXPosition = screenWidth - dropdownWidth - 20;
        },
        selectSong(song) {
            this.currentAudioSource = song;
            this.dropdownOpen = false;
            this.clearDropdownTimeout();
            const audio = this.$refs.audio;
            audio.load();
            audio.onloadeddata = () => {
                audio.play();
                this.isPlaying = true;
                this.startTitleScroll();
            };
        },
        onDropdownClickOutside(event) {
            if (this.$refs.dropdownMenu) {
                if (!this.$refs.dropdownMenu.contains(event.target)) {
                    this.dropdownOpen = false;
                    this.clearDropdownTimeout();
                }
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
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
    right: 10px;
    z-index: 30;
    display: flex;
    align-items: center;
}

.dropdown {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 23px;
    height: 27px;
    margin: 1px 0px 0px 7px;
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
    left: -140px;
    background-color: #f7f8f8;
    min-width: 180px;
    box-shadow: 0px 8px 16px 0px rgba(42, 129, 241, 0.699);
    z-index: 1;
    display: none;
    padding: 0px 0px;
    border-radius: 5%;
}

.dropdown-menu.show {
    display: block;
}

.dropdown-menu li {
    padding: 12px 16px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgb(99, 117, 150);
    font-weight: bold;
    position: relative;
}

.dropdown-menu li:last-child::after {
    background-color: transparent;
}

.dropdown-menu li::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 90%;
    height: 1px;
    background-color: #cbd0fd;
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

.pagination-controls {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #cde5f5;
    /* border-top: 1px solid #ccc; */
    border-radius: 5%;
}

.pagination-controls button {
    border: none;
    background: none;
    cursor: pointer;
    color: #458ddb;
    font-weight: bold;
    font-size: 11px;
}

.pagination-controls button:disabled {
    color: #aaa;
    cursor: not-allowed;
}


/* PC 화면에서 이미지 크기 설정 */
@media only screen and (min-width: 768px) {
    .dropdown-menu {
        left: -220px;
        min-width: 260px;
    }
}
</style>
