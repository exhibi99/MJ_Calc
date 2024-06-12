<template>
  <div id="appPage">
	  <router-view/>
  </div>
</template>

<style>
/* 우측 스크롤바 감추기 */
::-webkit-scrollbar {
    display: none;
}

/* Firefox 우측 스크롤바 감추기 */
scrollbar-width: none;
</style>