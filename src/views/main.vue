<template>
    <div id="cal-input">
        <!-- 기존의 입력 필드들 -->
        <div class="clipboard-button-container">
            <button class="clipboard-button" @click="readClipboard">
                <i class="bi bi-clipboard-check"></i> Clipboard 에서 읽기
            </button>
        </div>
        <div class="form-group">

            <label for="entryPrice"><i class="bi bi-arrow-right-circle-fill"></i> 진입가</label>
            <input type="number" v-model.number="entryPrice" id="entryPrice" placeholder="진입가를 입력하세요"
                @keyup.enter="handleEntryEnter" />
            <button @click="clearField('entryPrice')" class="clear-icon">
                <i class="bi bi-trash"></i>
            </button>
            <label class="formatted-label-entry" @click="calcIsolatedMulti">{{ formattedEntryPrice }}</label>
        </div>
        <div class="form-group">
            <label for="stopLoss"><i class="bi bi-exclamation-circle-fill"></i> 손절가</label>
            <input type="number" v-model.number="stopLoss" id="stopLoss" placeholder="손절가를 입력하세요"
                @keyup.enter="handleLossEnter" />
            <button @click="clearField('stopLoss')" class="clear-icon">
                <i class="bi bi-trash"></i>
            </button>
            <label class="formatted-label-loss" @click="calcIsolatedMulti">{{ formattedStopLoss }}</label>
        </div>
        <div class="form-group">
            <label for="investMoney"><i class="bi bi-wallet2"></i> 투자금</label>
            <input type="number" v-model.number="investMoney" id="investMoney" placeholder="현재시드를 입력하세요"
                @keyup.enter="handleEnter" />
            <button @click="clearField('investMoney')" class="clear-icon">
                <i class="bi bi-trash"></i>
            </button>
            <label class="formatted-label-invest" @click="calcIsolatedMulti">{{ formattedInvestMoney }}</label>
        </div>
        <div class="form-group risk-group">
            <div class="risk-label-container">
                <label class="risk-label">
                    <i class="bi bi-slash-circle-fill"></i> 리스크 설정
                    (<span id="selectedRisk" @click="toggleTabs">{{ selectedRisk }}%</span>)
                </label>
                <label class="switch">
                    <input type="checkbox" v-model="tabsEnabled" />
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="risk-tabs" v-if="tabsEnabled">
                <div :class="['tab', { active: selectedRisk === '10' }]" @click="selectRisk('10')">10%</div>
                <div :class="['tab', { active: selectedRisk === '5' }]" @click="selectRisk('5')">5%</div>
                <div :class="['tab', { active: selectedRisk === '3' }]" @click="selectRisk('3')">3%</div>
            </div>
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
                <div class="investCalcForm">
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
                                <img src="/images/MulValue.png" alt="배율 수식" />
                            </div>
                        </div>
                    </div>
                    <div class="calcdata">
                        <label class="cate"><i class="bi bi-check-lg" />투자금({{ selectedRisk }}%)</label>
                        <label class="value">{{ formattedInvestRiskMoney }}</label>
                    </div>
                    <div class="spacer"></div>
                    <div class="totalInvest">
                        <label class="cate"><i class="bi bi-bookmark-check-fill" />진입 총금액</label>
                        <label class="value">{{ formattedInputTotalMoney }}</label>
                    </div>
                    <div class="clipboard-write">
                        <button class="clipboard-write-button" @click="writeToClipboard">
                            <i class="bi bi-clipboard-check"></i> Clipboard 에 복사하기
                        </button>

                    </div>
                    <div class="calcdata" @mouseover="showIsolTooltip = true" @mouseout="showIsolTooltip = false">
                        <label class="cate"><i class="bi bi-check-lg" />격리 배율</label>
                        <label class="value">{{ isolatedMulti }}</label>
                        <div class="Isolatedtooltip" v-show="showIsolTooltip" @touchstart="showIsolTooltip = false">
                            <div class="tooltip-content">
                                <img src="/images/IsolateMul.png" alt="격리배율 수식" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btnwrap">
                    <b-button variant="calcConfirm" @click="closeCalcModal">확 인</b-button>
                </div>
            </div>
        </b-modal>
        <b-modal id="alertModal" class="modal" hide-footer ref="alertModal">
            <template #modal-title>
                <div class="layertit">
                    <i class="bi bi-exclamation-triangle-fill alert-icon"></i>
                    <span class="alertInfo">알림</span>
                </div>
            </template>
            <div class="modalcontainer">
                <div class="alertMessage">
                    <label v-html="alertMessage"></label>
                </div>
                <div v-if="alertMessage === '클립보드 읽기 권한이 거부되었습니다.'">
                    <p>브라우저 설정에서 클립보드 권한을 허용해주세요.</p>
                </div>
            </div>
        </b-modal>
        <b-modal id="guideModal" class="modal" hide-footer ref="guideModal">
            <template #modal-title>
                <div class="layertit">
                    <i class="bi bi-info-circle icon-guide"></i> 가이드
                </div>
            </template>
            <div class="modalcontainer">
                <div class="guideMessage">
                    브라우저 클립보드 <span style="color: rgb(169, 36, 36);">읽기권한 지원 안됨</span>. <br>
                    다음 브라우저로 동작 가능.<br><br>
                    · <span style="color: rgb(37, 37, 161);">동작 확인 브라우저 <br><br>
                        ✔ 크롬(Chrome) <br>
                        ✔ 엣지(Edge) <br>
                        ✔ 웨일(Whale) <br>
                        ✔ 삼성(Samsung) <br><br>
                    </span>
                    <b-button variant="link" class="url-button" @click="copyToClipboard('https://mjcalc.site')">URL
                        복사(mjcalc.site)</b-button>
                </div>
                <div class="btnwrap">
                    <b-button class="guide-confirm-button" @click="closeGuideModal">확인</b-button>
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
            selectedRisk: "5", // 기본값 설정
            tabsEnabled: false, // 탭 활성화/비활성화 기본값 설정
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
            showClipTooltip: true,
        };
    },
    methods: {
        handleTouchStart() {
            //this.showClipTooltip = true;
        },
        handleTouchEnd() {
            //this.showClipTooltip = false;
        },
        async writeToClipboard(value) {
            try {
                await navigator.clipboard.writeText(this.inputTotalMoney);
                console.log('클립보드에 값이 복사되었습니다:', value);
                //const formattedValue = this.formattedInputTotalMoney; // formattedInputTotalMoney 값을 가져옵니다.
                this.alertMessage =
                    `[진입 총금액]<br>( USDT : 
                    <span style="color: rgb(37, 37, 161);">${this.formattedInputTotalMoney} </span>)<br><br>
                    복사되었습니다.`;
                this.$refs.alertModal.show();
                setTimeout(this.closeAlertModal, 1300); // 1초 뒤에 모달 닫기
            } catch (error) {
                console.error('클립보드에 값 복사 중 오류가 발생했습니다:', error);
                // 클립보드에 값이 복사되지 않은 경우의 예외 처리를 여기에 추가할 수 있습니다.
            }
        },
        async readClipboard() {
            try {
                const permission = await navigator.permissions.query({ name: "clipboard-read" });
                console.log("Permission state:", permission.state); // 권한 상태 로그 출력
                if (permission.state === "granted" || permission.state === "prompt") {
                    const text = await navigator.clipboard.readText();
                    this.parseClipboardText(text); // 텍스트 처리 함수
                } else {
                    this.alertMessage = "클립보드 읽기 권한이 거부되었습니다.";
                    this.$refs.alertModal.show(); // 모달 띄우기
                    setTimeout(this.closeAlertModal, 5000);
                }
            } catch (error) {
                // 오류가 발생했을 때 오류 로그 출력
                console.error("클립보드 읽기 오류:", error);

                // 사용자에게 경고 메시지 설정
                //         this.alertMessage = `브라우저 클립보드 <span style="color: rgb(169, 36, 36);">읽기권한 지원 안됨</span>. <br>
                // 다음 브라우저로 동작 가능.<br><br>
                // · <span style="color: rgb(37, 37, 161);">동작 확인 브라우저 <br><br>
                //  ✔ 크롬(Chrome) <br>
                //  ✔ 엣지(Edge) <br>
                //  ✔ 웨일(Whale) <br>
                //  ✔ 삼성(Samsung) <br><br>
                //  </span>`;

                //         // 모달을 띄워서 사용자에게 경고 메시지 표시
                //         this.$refs.alertModal.show();
                this.openGuideModal();
            }
        },
        parseClipboardText(text) {
            const numbers = text.match(/\d+(\.\d+)?/g);
            if (numbers && numbers.length >= 2) {
                this.entryPrice = parseFloat(numbers[0]);
                this.stopLoss = parseFloat(numbers[1]);
            } else {
                this.alertMessage =
                    `클립보드에 유효한 데이터가 없습니다. <br><br>
                     복사된 클립보드 Text 중 에서 <br><br> 
                     ✔ <span style="color: rgb(37, 37, 161);">첫 번째 숫자 를 [진입가]</span> <br>
                     ✔ <span style="color: rgb(169, 36, 36);">두 번째 숫자 를 [손절가]</span> <br><br>
                     로 인식합니다.`;
                this.$refs.alertModal.show();
            }
        },
        calcMultiRatio() {
            const diff = this.entryPrice - this.stopLoss;
            if (diff !== 0) {
                this.multiRatio = this.entryPrice / Math.abs(diff);
            } else {
                if (this.entryPrice == 0) {
                    this.alertMessage = "입력을 모두 채워주세요.";
                } else {
                    this.alertMessage = `진입가와 손절가가 같습니다.<br><br>
                        ( USDT : <span style="color: rgb(169, 36, 36);">${this.formattedEntryPrice} </span>)`;
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
            if (this.entryPrice === "" || this.stopLoss === "" || this.investMoney === "")
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
                document.getElementById("stopLoss").focus();
            } else {
                if (!this.checkInputEmpty()) {
                    this.calcIsolatedMulti();
                }
            }
        },
        handleLossEnter() {
            if (this.investMoney == "") {
                document.getElementById("investMoney").focus();
            } else {
                if (!this.checkInputEmpty()) {
                    this.calcIsolatedMulti();
                }
            }
        },
        getTabClass(risk) {
            return ["tab", { active: this.selectedRisk === risk }];
        },
        selectRisk(risk) {
            this.selectedRisk = risk;
            this.riskRatio = this.selectedRisk / 100;
        },
        toggleTabs() {
            this.tabsEnabled = !this.tabsEnabled;
        },
        openGuideModal() {
            this.$refs.guideModal.show();
        },
        closeGuideModal() {
            this.$refs.guideModal.hide();
        },
        copyToClipboard(url) {
            navigator.clipboard.writeText(url).then(() => {
                alert('URL이 클립보드에 복사되었습니다: ' + url);
            }).catch(err => {
                console.error('클립보드 복사에 실패했습니다: ', err);
            });
        }
    },
    computed: {
        formattedEntryPrice() {
            return this.entryPrice ? this.entryPrice.toLocaleString() : "";
        },
        formattedStopLoss() {
            return this.stopLoss ? this.stopLoss.toLocaleString() : "";
        },
        formattedInvestMoney() {
            return this.investMoney ? this.investMoney.toLocaleString() : "";
        },
        formattedInvestRiskMoney() {
            return this.investRiskMoney ? this.investRiskMoney.toFixed(2).toLocaleString() : "";
        },
        formattedInputTotalMoney() {
            return this.inputTotalMoney ? Number(this.inputTotalMoney).toLocaleString() : "";
        },
    },
};
</script>

<style scoped>
/deep/ .url-button {
    color: #238a70 !important;
    /* 버튼 글자 색상 (예: 토마토색) */
    text-decoration: underline;
    /* 선택 사항: 밑줄 추가 */
    font-weight: bold;
}

.clipboard-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.clipboard-button:hover {
    background-color: #0056b3;
}
</style>
