<template>
    <div class="container">
        <div class="countdown">{{ countdownFormatted }} 초</div>
        <img v-if="selectedGif" :src="selectedGif" :style="{ top: randomTop + 'px', left: randomLeft + 'px' }"
            class="random-gif" alt="Random Gif" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            gifs: [
                '/images/NBA/NBA_1.gif',
                '/images/NBA/NBA_2.gif',
                '/images/NBA/NBA_3.gif',
                '/images/NBA/NBA_4.gif',
                '/images/NBA/NBA_5.gif',
                '/images/NBA/NBA_6.gif',
                '/images/NBA/NBA_7.gif',
                '/images/NBA/NBA_8.gif',
                '/images/NBA/NBA_9.gif',
                '/images/NBA/NBA_10.gif',
                '/images/NBA/NBA_11.gif',
                '/images/NBA/NBA_12.gif',
                // 다른 GIF 파일들도 여기에 추가
            ],
            selectedGif: null,
            randomTop: 0,
            randomLeft: 0,
            intervalId: null,
            countdown: 10,
            countdownIntervalId: null
        };
    },
    methods: {
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        displayRandomGif() {
            const gifWidth = window.innerWidth * 0.5; // 이미지 너비를 화면 너비의 50%로 설정
            const gifHeight = gifWidth; // 이미지를 정사각형으로 가정
            const maxTop = window.innerHeight - gifHeight;
            const maxLeft = window.innerWidth - gifWidth;

            this.randomTop = this.getRandomInt(0, maxTop);
            this.randomLeft = this.getRandomInt(0, maxLeft);
            this.selectedGif = this.gifs[this.getRandomInt(0, this.gifs.length - 1)];
            this.resetCountdown();
        },
        startGifRotation() {
            this.displayRandomGif();
            this.intervalId = setInterval(this.displayRandomGif, 10000); // 10초마다 이미지 변경
        },
        resetCountdown() {
            this.countdown = 10;
            if (this.countdownIntervalId) {
                clearInterval(this.countdownIntervalId);
            }
            this.countdownIntervalId = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    clearInterval(this.countdownIntervalId);
                }
            }, 1000);
        }
    },
    computed: {
        countdownFormatted() {
            return this.countdown.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
        }
    },
    mounted() {
        this.startGifRotation();
        window.addEventListener('resize', this.displayRandomGif);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.displayRandomGif);
        clearInterval(this.intervalId); // 컴포넌트가 파괴되기 전에 인터벌 정리
        clearInterval(this.countdownIntervalId);
    }
};
</script>

<style scoped>
.container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    /* 스크롤 바가 나타나지 않도록 숨김 */
    background-image: linear-gradient(to bottom right, rgb(255, 255, 255), rgb(194, 188, 188));
}

.countdown {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5em;
    color: white;
    background-color: rgba(32, 175, 168, 0.15);
    padding: 5px;
    border-radius: 5px;
}

.random-gif {
    position: absolute;
    max-width: 70vw;
    /* 이미지 너비를 화면 너비의 50%로 설정 */
    max-height: 70vw;
    /* 정사각형 이미지를 유지하기 위해 높이도 동일하게 설정 */
    border-radius: 10px;
    /* 원하는 정도로 조절할 수 있습니다. */
    overflow: hidden;
}

.image-container {
    border-radius: 10px;
    /* 원하는 정도로 조절할 수 있습니다. */
    overflow: hidden;
    /* 부드러운 외곽을 위해 반드시 추가되어야 합니다. */
}
</style>