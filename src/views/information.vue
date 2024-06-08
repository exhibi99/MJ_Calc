<template>
    <div class="d-flex flex-column min-vh-100">
      <div class="info-header">
      </div>
  
      <main class="flex-grow-1">
        <div class="container text-center">  
          <div v-for="(person, index) in people" :key="index">
            <div class="person-intro">
              <div class="d-flex align-items-center">
                <img :src="person.image" :alt="person.name" class="person-image mr-3">
                <div>
                  <div class="infoTitle">
                    <span>
                        <h2><strong>{{ person.name }}</strong></h2>
                    </span>
                    </div>
                  <p class="detailInfo" v-html="person.bio"></p>
                  <a v-if="person.website !== ''" :href="person.website" target="_blank" class="linkData">
                    <span class="d-flex align-items-center">
                        <i class="bi bi-link-45deg"></i>{{person.websiteInfo}}
                    </span>
                </a>
                </div>
              </div>
            </div>
            <hr class="divider">
          </div>
        </div>
      </main>

    </div>
  </template>

<script>
export default {
    data() {
    return {
      people: [
        {
          name: '타점계산 엑셀파일',
          image: '/images/mj_calc_excel.png',
          bio: "계산 수식은 MJ님 타점계산 엑셀파일 기준입니다. MJ님 텔레그램 방에서 다운받을 수 있습니다",
          website: 'https://t.me/lastdance12/246',
          websiteInfo : 'Telegram 엑셀파일'
        },
        {
          name: '시바코린님 계산기',
          image: '/images/sibacorin.png',
          bio: "시바코린님 WebApp 아이디어에서 UI 개선 시도하였습니다.",
          website: 'https://main--dreamy-faun-b6369e.netlify.app/',
          websiteInfo : '시바코린님 타점계산기'
        },
        {
          name: 'MJ님 YouTube 채널',
          image: '/images/mj_youtube.png',
          bio: "MJ님 YouTube 채널입니다. 타점계산 엑셀파일 사용방법 및 방송을 통해 투자정보를 참조할 수 있습니다.",
          website: 'https://www.youtube.com/@MJ-lastdance',
          websiteInfo : 'youtube.com/@MJ-lastdance'
        },
        {
          name: 'EX',
          image: '/images/EX_blackhole.png',
          bio: "재밌을 것 같아서 만들어 보았는데, UI 배치가 어려웠고, 아직도 잘 모르겠네요. 모바일화면 기준으로 만들었습니다.",
          website: ''
        }
      ]
    };
  },
    created(){
    },
    methods: {
    },
    computed: {

    }
}
</script>
