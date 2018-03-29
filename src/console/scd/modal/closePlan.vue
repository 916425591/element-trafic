<template>
    <div>
        <!-- 处置完毕 -->
        <modal v-model="endPlanModal" title="确认处置" :mask-closable="false" width="300" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div>确定处置完毕</div>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveModal">确定</Button>
                <Button size="large"  @click="closeModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                endPlanModal: true,
            }
        },
        methods: {
            saveModal () {
                this.$emit('save-modal');
            },
            closeModal () {
                this.$emit('close-modal');
            }
        }
    }
</script>

<style scoped>

</style>

