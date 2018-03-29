<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    import util from './libs/util'
    export default {
        data () {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>

<style>
html,body{
     width: 100%;
    height: 100%;
    min-width: 1280px!important;
    background: #f0f0f0;
    overflow: hidden;
    float: left;
    margin: 0px;
    padding: 0px;
}
ul,li{
    margin: 0px;
    padding: 0px;
    list-style: none;
}
.app-main{
    width: 100%;
    height: 100%;
}
::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

::-webkit-scrollbar-button {
    width: 0;
    height: 0;
    display: none;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    width: 10px;
}

::-webkit-scrollbar-corner {
    background-color: transparent;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    width: 5px;
    background-color: rgba(225, 224, 226, 1);
    border-radius: 5px;
}
</style>
