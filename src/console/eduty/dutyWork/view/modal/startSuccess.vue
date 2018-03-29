<template>
    <div>
        <modal v-model="confirmModal" title="信息提示" :mask-closable="false" width="300" @on-cancel="closeModal" class-name="vertical-center-modal">
            <div>
                预案已启动成功,是否继续处置
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveModal">确定</Button>
                <Button  @click="closeModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                confirmModal: true
            }
        },
        computed: {
            getTableDetail () {
                return this.$store.state.eduty.tableInfo
            },
            getUserCode () {
                return Cookies.get('userCode')
            },
            getUrl () {
                return this.$store.state.userCode.url
            },
            getPlanInfo () {
                return this.$store.state.eduty.planInfo
            }
        },
        methods: {
            saveModal () {
                //继续预案
                const incidentId = this.getTableDetail.id;
                window.open("/#/process?incidentId="+incidentId+"&show=0&eduty=1",'_blank','width='+(window.screen.availWidth-20)+',height='+(window.screen.availHeight-30)+
',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes');
                this.closeModal();
            },
            closeModal () {
                this.$emit('close-modal');
            },
            openModal () {
                const incidentId = this.getTableDetail.id;
                
            }
        }
    }
</script>

<style scoped>

</style>


