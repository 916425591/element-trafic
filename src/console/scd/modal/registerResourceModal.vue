<template>
    <div>
        <modal v-model="registerResourceModal" class-name="vertical-center-modal" title="携带资源登记" :mask-closable="false" width="400" @on-cancel="closeregisterResourceModal">
            <div class="ds-search-body">
                <i-form ref="registerResource" :model="registerResource" :rules="registerResourceCustom" :label-width="100">
                    <Row>
                        <i-col span="24">
                            <form-item label="资源名称： " prop="resName">
                                <i-input type="text" v-model="registerResource.resName"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="资源数量： " prop="count">
                                <i-input type="text" v-model="registerResource.count"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="24">
                            <form-item label="计量单位： " prop="unit">
                                <i-input type="text" v-model="registerResource.unit"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                </i-form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="saveregisterResource('registerResource')">确定</Button>
                <Button size="large"  @click="closeregisterResourceModal">关闭</Button>
            </div>
        </modal>
    </div>
</template>

<script>
    import verify from '@/common/utils/verify'

    export default {
        data () {
            const validateResName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入资源名称'));
                } else {
                    callback()
                }
            };
            const validateCount = (rule, value, callback) => {
                const reg = verify.num;
                if (!value) {
                    return callback(new Error('请输入资源数量'));
                } else if (!reg.test(value)) {
                    return callback(new Error('资源数量只能输入数字'));
                } else {
                    callback()
                }
            };
            const validateUnit = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入计量单位'));
                } else {
                    callback()
                }
            };
            return {
                registerResourceModal: true,
                registerResource: {
                    resName: '',
                    count: null,
                    unit: ''
                },
                node: {},
                registerResourceCustom: {
                    resName: [
                        { required: true, validator: validateResName, trigger: 'blur' }
                    ],
                    count: [
                        { required: true, validator: validateCount, trigger: 'blur' }
                    ],
                    unit: [
                        { required: true, validator: validateUnit, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            getResource () {
                return this.$store.state.scd.resourceData;
            }
        },
        created () {
            this.judgeType();
        },
        methods: {
            judgeType () {
                //判断增加还是修改
                this.node = this.getResource;
                const type = this.node.type;
                if ( type === 'edit' ) {
                    this.registerResource = this.node;
                } else {
                    this.registerResource = {};
                }
            },
            saveregisterResource (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if ( this.node.type === 'add') {
                            this.$emit('save-resource', 'add', this.registerResource);
                        } else {
                            this.$emit('save-resource', 'edit', this.registerResource);
                        }
                    } else {
                        this.$Message.error('请先完成必填项！');
                    }
                });
            },
            closeregisterResourceModal () {
                this.$emit('close-modal');
            }
        }
    }
</script>
 
<style scoped>

</style>
