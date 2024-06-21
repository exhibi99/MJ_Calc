<template>
    <div>
        <button @click="readClipboard">클립보드에서 읽기</button>

        <b-modal id="alertModal" class="modal" hide-footer ref="alertModal">
            <template #modal-title>
                <div class="layertit">
                    <i class="bi bi-exclamation-triangle-fill alert-icon"></i>
                    <span class="alertInfo">알림</span>
                </div>
            </template>
            <div class="modalcontainer">
                <div class="alertMessage">
                    <label>{{ alertMessage }}</label>
                </div>
                <div v-if="alertMessage === '클립보드 읽기 권한이 거부되었습니다.'">
                    <p>브라우저 설정에서 클립보드 권한을 허용해주세요.</p>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            alertMessage: '',
        };
    },
    methods: {
        async readClipboard() {
            try {
                const permission = await navigator.permissions.query({ name: "clipboard-read" });
                console.log("Permission state:", permission.state); // 권한 상태 로그 출력
                if (permission.state === "granted" || permission.state === "prompt") {
                    const text = await navigator.clipboard.readText();
                    this.processClipboardText(text); // 클립보드 텍스트 처리
                } else {
                    this.alertMessage = "클립보드 읽기 권한이 거부되었습니다.";
                    this.$refs.alertModal.show(); // 모달 띄우기
                }
            } catch (error) {
                console.error("클립보드 읽기 오류:", error); // 오류 로그 출력
                this.alertMessage = "클립보드를 읽는 중 오류가 발생했습니다.";
                this.$refs.alertModal.show(); // 모달 띄우기
            }
        },
        processClipboardText(text) {
            // 여기서 클립보드에서 가져온 텍스트를 처리합니다.
            console.log("Clipboard Text:", text);
            // 예시: 가져온 텍스트를 필드에 할당하는 경우
            this.$refs.alertModal.hide(); // 처리 후 모달 숨기기
        },
    },
};
</script>

<style scoped>
/* 추가적인 스타일링은 필요한 경우 여기에 추가할 수 있습니다. */
</style>
