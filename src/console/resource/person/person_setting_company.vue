<template>
    <div>
        <Table border highlight-row :columns="columns7" :data="company_list" @on-row-click="select_company" ref="table"></Table>
        <Page class="ds-page-right" :total="100" show-total></Page>
    </div>
</template>

<script>
    export default {
        props: {
            'company_url': [Number,String,Object],
            'save_url': [Number,String,Object],
            'id': [Number,String,Object]
		},
        data () {
            return {
                selectRowData: {},
                columns7: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '单位名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '单位类型',
                        key: 'post',
                        align: 'center'
                    },
                    {
                        title: '办公电话',
                        key: 'tel',
                        align: 'center'
                    }
                ],
                company_list: [],
            }
        },
        created () {
            this.getCompany();
        },
        methods: {
            getCompany () {
                const that = this;
                let url = this.company_url;
                this.$http.get(url)
                .then(function (response) {
                    that.company_list = response.data.company_list;
                })
                .catch(function (error) {
                    this.$Message.error(error)
                });
            },
            select_company (data,index) {
                this.selectRowData = data;
            },
            save_company () {
                let companyData = this.selectRowData;
                const that = this;
                let url = this.save_url;
                this.$http.post(url,{
                    personId: companyData.id,
                    id: this.id//所需保存的类型id
                })
                .then(function (response) {
                    this.$Message.info('主管单位设置成功')
                    that.$emit('company-save-sucess',companyData)
                })
                .catch(function (error) {
                    this.$Message.error(error)
                });
            }
        }
    }
</script>

<style>
    .ds-page-right{
        text-align: right;
        padding-top: 10px;
    }
</style>