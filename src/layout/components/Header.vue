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
                    <i v-if="isPlaying" class="bi bi-stop-circle-fill"></i>
                    <i v-else class="bi bi-play-circle-fill"></i>
                </button>
                <audio ref="audio" :src="audioSource" loop></audio>
            </div>
        </div>
        <nav>
            <div class="contentbox">
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
export default {
    data() {
        return {
            // 메뉴명 배열
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
            audioSource: '/musics/cavatina.mp3', // 여기에 음악 파일 경로를 넣어주세요
            originalTitle: 'MJ 타점계산기', // 원래 제목
            scrollTitle: '', // 스크롤할 제목
        };
    },
    mounted() {
        // window.addEventListener("scroll", this.handleScroll);
    },
    beforeDestroy() {
        this.stopTitleScroll();
        // window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
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
            const musicTitle = ' [ ♫ Cavatina ] Deer Hunter OST';
            const padding = ' ···';
            this.scrollTitle = musicTitle + padding.repeat(5);
            let scrollIndex = 0;

            this.titleScrollInterval = setInterval(() => {
                document.title = this.scrollTitle.substring(scrollIndex) + this.scrollTitle.substring(0, scrollIndex);
                scrollIndex = (scrollIndex + 1) % this.scrollTitle.length;
            }, 800); // 300ms마다 제목 변경
        },
        stopTitleScroll() {
            clearInterval(this.titleScrollInterval);
            document.title = this.originalTitle;
        }
    }
};
</script>

<style>
.topmenu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative; /* 로고 상자에 position: relative; 적용 */
}

.logobox {
    flex: 1;
    text-align: center;
}

.music {
    position: absolute;
    bottom: 10px;
    right: 20px;
    z-index: 10; /* 다른 요소 위에 표시되도록 설정 */
    display: flex; /* 요소가 제대로 표시되도록 설정 */
    align-items: center; /* 요소를 수직으로 가운데 정렬 */
}

/* 재생 아이콘의 색상 */
.bi-play-circle-fill {
    color: rgb(52, 7, 173); /* 재생 아이콘의 색상을 지정 */
}

/* 정지 아이콘의 색상 */
.bi-stop-circle-fill {
    color: rgb(23, 54, 138); /* 정지 아이콘의 색상을 지정 */
}
</style>
