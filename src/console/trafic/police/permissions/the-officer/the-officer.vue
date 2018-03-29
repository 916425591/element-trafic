<template>
    <div>
        {{msg}}
    </div>
</template>

<script>
    export default {
        name: 'the-officer',
        data(){
            return{
                message:'我是你们的警员消息'
            }
        }
    };
</script>

<style lang="less">
    @import './style/officer.less';
</style>

