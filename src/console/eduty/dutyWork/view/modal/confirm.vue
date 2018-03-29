<template>
    <div>
        <modal v-model="confirmModal" title="信息提示" :mask-closable="false" width="300" @on-cancel="closeConfirm" class-name="vertical-center-modal">
            <div>
                暂无处置预案，请先选择处置预案
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="selectPlan">筛选预案</Button>
                <Button size="large"  @click="editConfirm">手动编辑</Button>
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
                this.$emit('open-modal', 'selectPlan');
            },
            editConfirm () {
                this.$emit('open-modal', 'editPlan');
            },
            closeConfirm () {
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>

</style>


