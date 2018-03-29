<template>
    <div>
        <Table border highlight-row :columns="columns7" :data="personList" @on-row-click="select_row" ref="table"></Table>
        <Page :total="100" show-total class="ds-page-right"></Page>
    </div>
</template>

<script>
    export default {
        props: {
            //'save_type': [Number,String,Object],
            'get_url': [Number,String,Object],
			'save_url': [Number,String,Object],
            'id': [Number,String,Object] 
		},
        data () {
            return {
                columns7: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '职务',
                        key: 'post',
                        align: 'center'
                    },
                    {
                        title: '移动电话',
                        key: 'phone',
                        align: 'center'
                    },
                    {
                        title: '办公电话',
                        key: 'tel',
                        align: 'center'
                    }
                ],
                personList: [],
                save_type: '',
                select_row_data: {}
            }
        },
        created () {
            this.getPersonList();
        },
        methods: {
            getPersonList () {
                //获取人员信息
                const that = this;
                let url = this.get_url;
                this.$http.get(url)
                .then(function(response){
                    that.personList = response.data.personList;
                })
                .catch(function(error){
                    this.$Message.error(error)
                });
            },
            select_row (data,index) {
                this.select_row_data = data;
            },
            save_manager () {
                const that = this;
                let url = this.save_url;
                let id = this.select_row_data.id;
                this.$http.post(url,{
                    personId: id,
                    id: this.id//所需保存的类型id
                })
                .then(function(response){
                    that.$emit('person-save-sucess',that.select_row_data)
                    this.$Message.info('设置成功')
                })
                .catch(function(error){
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