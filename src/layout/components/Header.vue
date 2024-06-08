<template>
    <header :class="Topclass">
        <div class="topmenu">
            <div class="contentbox">
                <div class="logo">
                    <button v-on:click="goToPage('/main', 0)">
                        <img src="/images/mj_calc_logo.png" alt="MJ 타점계산기" />
                    </button>
                </div>
            </div>
        </div>
        <nav>
            <div class="contentbox">
                <ul>
                    <li
                        v-for="(item, index) in menulists"
                        :key="index"
                        v-on:click="goToPage(item.link, index)"
                        :class="{ selected: selectedIndex === index }"
                    >
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
                // { menutext: "자료실", link: "/reference" },
                { menutext: "정보", link: "/info" },
            ],
            selectedIndex: 0,
            form: {
                id: "",
                pass: "",
                mail:"",
                checkedtype: [],
            },
            Topclass: "",
        };
    },
    mounted() {
        // window.addEventListener("scroll", this.handleScroll);
    },
    beforeDestory() {
        // window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
        goToPage(target, index) {
            if (this.$router.currentRoute.path !== target) {
                this.selectedIndex = index;
                this.$router.push(target);
                selectedIndex = index;
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
    },
};
</script>