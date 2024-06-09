<template>
    <div id="cal-input">
        <div class="form-group">
            <label for="entryPrice"><i class="bi bi-play-circle-fill"></i> 진입가</label>
            <input type="number" v-model.number="entryPrice" id="entryPrice" placeholder="진입가를 입력하세요" />
            <button @click="clearField('entryPrice')" class="clear-icon">
                <i class="bi bi-trash"></i>
            </button>
            <label class="formatted-label-entry">{{ formattedEntryPrice }}</label>
        </div>
        <div class="form-group">
            <label for="stopLoss"><i class="bi bi-exclamation-circle-fill"></i> 손절가</label>
            <input type="number" v-model.number="stopLoss" id="stopLoss" placeholder="손절가를 입력하세요" />
            <button @click="clearField('stopLoss')" class="clear-icon">
                <i class="bi bi-trash"></i>
            </button>
            <label class="formatted-label-loss">{{ formattedStopLoss }}</label>
        </div>
        <div class="form-group">
            <label for="investMoney"><i class="bi bi-wallet2"></i> 투자금</label>
            <input type="number" v-model.number="investMoney" id="investMoney" placeholder="현재시드를 입력하세요"
                @keyup.enter="handleEnter()" />
            <button @click="clearField('investMoney')" class="clear-icon">
                <i class="bi bi-trash"></i>
            </button>
            <label class="formatted-label-invest">{{ formattedInvestMoney }}</label>
        </div>
        <div class="calculate-button-container">
            <button class="calculate-button" @click="calcIsolatedMulti">
                계산하기
            </button>
            <!-- <button class="calculate-button" @click="calcIsolatedMulti">계산하기</button> -->
        </div>

        <b-modal id="login" class="modal" hide-footer ref="calcModal">
            <template #modal-title>
                <div class="layertit"><i class="bi bi-calculator-fill" />진입금액</div>
                <div class="buyShortImg">
                    <img v-if="isbuy" :src="buy_image" alt="Buy/Long Image" />
                    <img v-else :src="sell_image" alt="Sell/Short" />
                </div>
            </template>
            <div class="modalcontainer">
                <div class="loginform">
                    <div class="entryprice">
                        <label class="cate"><i class="bi bi-check-lg" />진입가</label>
                        <label class="value">{{ formattedEntryPrice }}</label>
                        <!-- <button class="copy-button" v-clipboard:copy="formattedEntryPrice" v-clipboard:success="onCopy">복사</button> -->
                    </div>
                    <div class="lossprice">
                        <label class="cate"><i class="bi bi-check-lg" />손절가</label>
                        <label class="value">{{ formattedStopLoss }}</label>
                        <!-- <button class="copy-button" v-clipboard:copy="formattedEntryPrice" v-clipboard:success="onCopy">복사</button> -->
                    </div>
                    <!-- <b-form-input id="id" placeholder="아이디를 입력해 주세요" /> -->
                    <div class="calcdata">
                        <label class="cate"><i class="bi bi-check-lg" />배율</label>
                        <label class="value">{{ multiRatio.toFixed(2) }}</label>
                    </div>
                    <div class="calcdata">
                        <label class="cate"><i class="bi bi-check-lg" />투자금(5%)</label>
                        <label class="value">{{ formattedInvestRiskMoney }}</label>
                    </div>
                    <div class="spacer"></div>
                    <!-- Spacer added here -->
                    <div class="totalInvest">
                        <label class="cate"><i class="bi bi-bookmark-check-fill" />진입 총가격</label>
                        <label class="value">{{ formattedInputTotalMoney }}</label>
                    </div>
                    <div class="calcdata">
                        <label class="cate"><i class="bi bi-check-lg" />격리 배율</label>
                        <label class="value">{{ isolatedMulti }}</label>
                    </div>

                    <!-- <b-form-input type="password" id="pass" placeholder="비밀번호를 입력해 주세요" /> -->
                </div>
                <div class="btnwrap">
                    <b-button variant="login" @click="closeCalcModal">확 인</b-button>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
navigator.vibrate =
    navigator.vibrate ||
    navigator.webkitVibrate ||
    navigator.mozVibrate ||
    navigator.msVibrate;

// Safari 브라우저인지 확인하는 함수
function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export default {
    data() {
        return {
            entryPrice: "",
            stopLoss: "",
            investMoney: "",
            submitted: false,
            calcPath: "/calc",
            riskRatio: 0.05,
            multiRatio: 1,
            investRiskMoney: 0,
            inputTotalMoney: 0,
            isolatedMulti: 1,
            buy_image: "/images/buy_long.png",
            sell_image: "/images/sell_short.png",
            isbuy: true,
        };
    },
    created() {
        this.Newbooks = this.Newbooks_it;
    },
    methods: {
        submitForm() {
            this.submitted = true;
        },
        goToPage(path) {
            // this.$router.push(path); // Vue Router의 내장된 메소드를 사용하여 페이지 이동
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
        calcMultiRatio() {
            let diff = this.entryPrice - this.stopLoss;
            this.isbuy = true;
            if (diff !== 0) {
                this.multiRatio = this.entryPrice / Math.abs(diff);
                //alert(`${this.multiRatio}`);
            } else {
                navigator.vibrate(30);
                alert(`선생님, 진입가와 손절가가 같습니다.(${this.entryPrice})`);
                return false;
            }

            if (diff < 0) {
                this.isbuy = false;
            }
            return true;
        },
        calcInvestRiskMoney() {
            this.investRiskMoney = this.investMoney * this.riskRatio;
            // alert(`${this.investRiskMoney}`);
        },
        calcinputTotalMoney() {
            if (this.calcMultiRatio() == false) {
                return false;
            }
            this.calcInvestRiskMoney();
            this.inputTotalMoney = (this.investRiskMoney * this.multiRatio).toFixed(
                2
            );
            //alert(`${this.inputTotalMoney}`);

            if (this.checkInputEmpty() == true) {
                navigator.vibrate(30);
                alert("선생님, 입력을 채워주세요.");
                return false;
            }
            return true;
        },
        calcIsolatedMulti() {
            if (this.calcinputTotalMoney() == false) return false;
            this.isolatedMulti = (this.multiRatio * this.riskRatio).toFixed(2);
            navigator.vibrate(30);
            this.$refs.calcModal.show();
            return true;
            //alert(`${this.isolatedMulti}`);
        },
        clearCalcValue() {
            (this.entryPrice = ""),
                (this.stopLoss = ""),
                (this.investMoney = ""),
                (this.multiRatio = 1);
            this.investRiskMoney = 0;
            this.inputTotalMoney = 0;
            this.isolatedMulti = 1;
            this.isbuy = true;
        },
        closeCalcModal() {
            this.$refs.calcModal.hide(); // 모달을 닫는 메서드 호출
        },

        clearField(field) {
            console.log(`${field} 지우기`);
            this[field] = "";
        },
        handleEnter() {
            this.calcIsolatedMulti();
        },
        checkInputEmpty() {
            if (
                this.entryPrice == "" ||
                this.stopLoss == "" ||
                this.investMoney == ""
            )
                return true;
            return false;
        },
    },
    computed: {
        formattedEntryPrice() {
            // Safari 브라우저인 경우 진동 기능을 사용하지 않음
            if (!this.isSafariBrowser) {
                navigator.vibrate(30);
            }
            return this.entryPrice ? this.entryPrice.toLocaleString() : "";
        },
        formattedStopLoss() {
            if (!this.isSafariBrowser) {
                navigator.vibrate(30);
            }
            return this.stopLoss ? this.stopLoss.toLocaleString() : "";
        },
        formattedInvestMoney() {
            if (!this.isSafariBrowser) {
                navigator.vibrate(30);
            }
            return this.investMoney ? this.investMoney.toLocaleString() : "";
        },
        formattedInvestRiskMoney() {
            return this.investRiskMoney
                ? this.investRiskMoney.toFixed(2).toLocaleString()
                : "";
        },
        formattedInputTotalMoney() {
            return this.inputTotalMoney ? this.inputTotalMoney.toLocaleString() : "";
        },
    },
};
</script>
