<template>
    <div>
        <modal class-name="vertical-center-modal" v-model="confirmModal" title="信息提示" :mask-closable="false" width="300" @on-cancel="closeConfirm">
            <div>
                暂不能启动预案，请先筛选预案
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="selectPlan">筛选预案</Button>
                <Button size="large"  @click="closeConfirm">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                confirmModal: true
            }
        },
        methods: {
            selectPlan () {
                this.$emit('save-modal');
            },
            closeConfirm () {
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>

</style>


