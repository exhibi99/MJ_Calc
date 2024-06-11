<template>
    <div class="d-flex flex-column min-vh-100">
      <div class="info-header"></div>
  
      <main class="flex-grow-1">
        <div class="container">
          <div v-for="(person, index) in people" :key="index" class="person-intro mb-4">
            <div class="d-flex align-items-center">
              <img :src="person.image" :alt="person.name" class="person-image mr-4" />
              <div>
                <div class="infoTitle">
                  <h2 class="title"><strong><span>{{ person.name }}</span></strong></h2>
                </div>
                <p class="detailInfo" v-html="person.bio"></p>
                <a v-if="person.website !== ''" :href="person.website" target="_blank" class="linkData">
                  <span class="d-flex align-items-center">
                    <i class="bi bi-link-45deg mr-2"></i>{{ person.websiteInfo }}
                  </span>
                </a>
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
            bio: '계산 수식은 MJ님 타점계산 엑셀파일 기준입니다. MJ님 텔레그램 방에서 다운받을 수 있습니다',
            website: 'https://t.me/lastdance12/246',
            websiteInfo: 'Telegram 엑셀파일'
          },
          {
            name: '시바코린님 계산기',
            image: '/images/sibacorin.png',
            bio: '시바코린님 WebApp 아이디어에서 UI 개선 시도하였습니다.',
            website: 'https://main--dreamy-faun-b6369e.netlify.app/',
            websiteInfo: '시바코린님 타점계산기'
          },
          {
            name: 'MJ님 YouTube 채널',
            image: '/images/mj_youtube.png',
            bio: 'MJ님 YouTube 채널입니다. 타점계산 엑셀파일 사용방법 및 방송을 통해 투자정보를 참조할 수 있습니다.',
            website: 'https://www.youtube.com/@MJ-lastdance',
            websiteInfo: 'youtube.com/@MJ-lastdance'
          },
          {
            name: 'EX',
            image: '/images/EX_blackhole.png',
            bio: '재밌을 것 같아서 만들어 보았는데, UI 배치가 어려웠고, 아직도 잘 모르겠네요. 모바일화면 기준으로 만들었습니다.',
            website: ''
          }
        ]
      };
    },
    created() {},
    methods: {},
    computed: {}
  };
  </script>
  
  <style scoped>
  .person-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid #ccc; /* 얇은 테두리 추가 */
  }
  
  .infoTitle h2 {
    font-size: 1rem; /* 제목 글자 크기 조정 */
    margin: 0;
  }
  
  .infoTitle h2 span {
    color: #1e4c7a; /* 남색 계열 색상 */
  }
  
  .detailInfo {
    margin: 10px 0;
  }
  
  .linkData {
    text-decoration: none;
  }
  
  .linkData span {
    color: #908ae0; /* 링크 글자 색상 변경 */
  }
  
  .linkData:hover span {
    text-decoration: underline;
  }
  
  .divider {
    margin: 1.5rem 0;
  }
  
  @media (min-width: 576px) {
    .person-image {
      width: 100px;
      height: 100px;
    }
  
    .infoTitle h2 {
      font-size: 1.25rem;
    }
  }
  
  /* 추가된 스타일 */
  .mr-4 {
    margin-right: 1.5rem !important; /* 기본 부트스트랩 .mr-4 값을 재정의하여 더 넓은 간격 설정 */
  }
  </style>
  