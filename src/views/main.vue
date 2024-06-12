<template>
    <div id="cal-input">
        <div class="form-group">
            <label for="entryPrice"><i class="bi bi-arrow-right-circle-fill"></i> 진입가</label>
            <input type="number" v-model.number="entryPrice" id="entryPrice" placeholder="진입가를 입력하세요"
                @keyup.enter="handleEntryEnter()" />
            <button @click="clearField('entryPrice')" class="clear-icon">
                <i class="bi bi-trash"></i>
            </button>
            <label class="formatted-label-entry" @click="calcIsolatedMulti">{{ formattedEntryPrice }}</label>
        </div>
        <div class="form-group">
            <label for="stopLoss"><i class="bi bi-exclamation-circle-fill"></i> 손절가</label>
            <input type="number" v-model.number="stopLoss" id="stopLoss" placeholder="손절가를 입력하세요"
                @keyup.enter="handleLossEnter()" />
            <button @click="clearField('stopLoss')" class="clear-icon">
                <i class="bi bi-trash"></i>
            </button>
            <label class="formatted-label-loss" @click="calcIsolatedMulti">{{ formattedStopLoss }}</label>
        </div>
        <div class="form-group">
            <label for="investMoney"><i class="bi bi-wallet2"></i> 투자금</label>
            <input type="number" v-model.number="investMoney" id="investMoney" placeholder="현재시드를 입력하세요"
                @keyup.enter="handleEnter()" />
            <button @click="clearField('investMoney')" class="clear-icon">
                <i class="bi bi-trash"></i>
            </button>
            <label class="formatted-label-invest" @click="calcIsolatedMulti">{{ formattedInvestMoney }}</label>
        </div>
        <div class="calculate-button-container">
            <button class="calculate-button" @click="calcIsolatedMulti">
                계산하기
            </button>
        </div>

        <b-modal id="calcModal" class="modal" hide-footer ref="calcModal">
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
                    </div>
                    <div class="lossprice">
                        <label class="cate"><i class="bi bi-check-lg" />손절가</label>
                        <label class="value">{{ formattedStopLoss }}</label>
                    </div>
                    <div class="calcdata" @mouseover="showTooltip = true" @mouseout="showTooltip = false">
                        <label class="cate"><i class="bi bi-check-lg" />배율</label>
                        <label class="value">{{ multiRatio.toFixed(2) }}</label>
                        <div class="calctooltip" v-show="showTooltip" @touchstart="showTooltip = false">
                            <div class="tooltip-content">
                                <img src="/images/MulValue.png" alt="배율 수식">
                            </div>
                        </div>
                    </div>
                    <div class="calcdata">
                        <label class="cate"><i class="bi bi-check-lg" />투자금(5%)</label>
                        <label class="value">{{ formattedInvestRiskMoney }}</label>
                    </div>
                    <div class="spacer"></div>
                    <div class="totalInvest">
                        <label class="cate"><i class="bi bi-bookmark-check-fill" />진입 총가격</label>
                        <label class="value">{{ formattedInputTotalMoney }}</label>
                    </div>
                    <div class="calcdata" @mouseover="showIsolTooltip = true" @mouseout="showIsolTooltip = false">
                        <label class="cate"><i class="bi bi-check-lg" />격리 배율</label>
                        <label class="value">{{ isolatedMulti }}</label>
                        <div class="Isolatedtooltip" v-show="showIsolTooltip" @touchstart="showIsolTooltip = false">
                            <div class="tooltip-content">
                                <img src="/images/IsolateMul.png" alt="격리배율 수식">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btnwrap">
                    <b-button variant="login" @click="closeCalcModal">확 인</b-button>
                </div>
            </div>
        </b-modal>

        <b-modal id="alertModal" class="modal" hide-footer ref="alertModal">
            <template #modal-title>
                <div class="layertit">
                    <i class="bi bi-exclamation-triangle-fill small-icon"></i>
                    <span class="alertInfo">알림</span>
                </div>
            </template>
            <div class="modalcontainer">
                <div class="alertMessage">
                    <label>{{ alertMessage }}</label>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            entryPrice: "",
            stopLoss: "",
            investMoney: "",
            submitted: false,
            riskRatio: 0.05,
            multiRatio: 1,
            investRiskMoney: 0,
            inputTotalMoney: 0,
            isolatedMulti: 1,
            buy_image: "/images/buy_long.png",
            sell_image: "/images/sell_short.png",
            isbuy: true,
            alertMessage: "",
            showTooltip: false,
            showIsolTooltip: false,
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
            } else {
                // if (this.isSafari != true) {
                //     navigator.vibrate(30);
                // }
                if (this.entryPrice == 0) {
                    this.alertMessage = "입력을 모두 채워주세요.";
                }
                else {
                    this.alertMessage = `진입가와 손절가가 같습니다.( ${this.entryPrice} )`;
                }
                this.$refs.alertModal.show();
                setTimeout(this.closeAlertModal, 1300); // 1초 뒤에 모달 닫기
                return false;
            }

            if (diff < 0) {
                this.isbuy = false;
            }
            return true;
        },
        calcInvestRiskMoney() {
            this.investRiskMoney = this.investMoney * this.riskRatio;
        },
        calcinputTotalMoney() {
            if (this.calcMultiRatio() == false) {
                return false;
            }
            this.calcInvestRiskMoney();
            this.inputTotalMoney = (this.investRiskMoney * this.multiRatio).toFixed(2);

            if (this.checkInputEmpty() == true) {
                // if (this.isSafari != true) {
                //     navigator.vibrate(30);
                // }
                this.alertMessage = "입력을 채워주세요.";
                this.$refs.alertModal.show();
                setTimeout(this.closeAlertModal, 1300); // 1초 뒤에 모달 닫기
                return false;
            }
            return true;
        },
        calcIsolatedMulti() {
            if (this.calcinputTotalMoney() == false) return false;
            this.isolatedMulti = (this.multiRatio * this.riskRatio).toFixed(2);
            // if (this.isSafari != true) {
            //     navigator.vibrate(30);
            // }
            this.$refs.calcModal.show();
            return true;
        },
        clearCalcValue() {
            this.entryPrice = "";
            this.stopLoss = "";
            this.investMoney = "";
            this.multiRatio = 1;
            this.investRiskMoney = 0;
            this.inputTotalMoney = 0;
            this.isolatedMulti = 1;
            this.isbuy = true;
            isSafari: false;
        },
        closeCalcModal() {
            this.$refs.calcModal.hide(); // 모달을 닫는 메서드 호출
        },
        closeAlertModal() {
            this.$refs.alertModal.hide();
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
                this.entryPrice === "" ||
                this.stopLoss === "" ||
                this.investMoney === ""
            )
                return true;
            return false;
        },
        showTooltipOnMouseOver() {
            console.log("Mouse over detected");
            this.showTooltip = true;
        },
        hideTooltipOnMouseOut() {
            console.log("Mouse out detected");
            this.showTooltip = false;
        },
        handleEntryEnter() {
            if (this.stopLoss == "") {
                document.getElementById('stopLoss').focus();
            }
            else {
                if (!this.checkInputEmpty()) {
                    this.calcIsolatedMulti();
                }
            }
        },
        handleLossEnter() {
            if (this.investMoney == '') {
                document.getElementById('investMoney').focus();
            }
            else {
                if (!this.checkInputEmpty()) {
                    this.calcIsolatedMulti();
                }
            }
        }
    },
    computed: {
        formattedEntryPrice() {
            // if (this.isSafari != true) {
            //     navigator.vibrate(30);
            // }
            return this.entryPrice ? this.entryPrice.toLocaleString() : "";
        },
        formattedStopLoss() {
            // if (this.isSafari != true) {
            //     navigator.vibrate(30);
            // }
            return this.stopLoss ? this.stopLoss.toLocaleString() : "";
        },
        formattedInvestMoney() {
            // if (this.isSafari != true) {
            //     navigator.vibrate(30);
            // }
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
    mounted() {
        // this.isSafari = this.checkIfSafari();
    },
};
</script>