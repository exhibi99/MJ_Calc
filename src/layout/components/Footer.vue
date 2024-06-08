<template>
      <footer class="bg-light text-center py-3">
        <div class="footContainer">
          <p> ver_24.06.09 </p>
        </div>
      </footer>
</template>

<script>

export default {
    data() {
        const currentDate = new Date();
        return{
            currentDate: currentDate,
            currentYear: currentDate.getFullYear(),
            currentMonth: currentDate.getMonth() + 1, // 월은 0부터 시작하므로 1을 더합니다.
            currentDay: currentDate.getDate()
        }
    },
}
</script>
