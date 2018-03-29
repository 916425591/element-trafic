<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <!--<div :bordered="false">-->
                <!--<p slot="title">-->
                    <!--<Icon type="log-in"></Icon>-->
                    <!--欢迎登录-->
                <!--</p>-->
                <!--<div class="form-con">-->
                    <!--<Form ref="form" :model="form" :rules="rules">-->
                        <!--<FormItem prop="userCode">-->
                            <!--<i-input v-model="form.userCode" placeholder="请输入用户名">-->
                                <!--<span slot="prepend">-->
                                    <!--<Icon :size="16" type="person"></Icon>-->
                                <!--</span>-->
                            <!--</i-input>-->
                        <!--</FormItem>-->
                        <!--<FormItem prop="password">-->
                            <!--<i-input type="password" v-model="form.password" placeholder="请输入密码">-->
                                <!--<span slot="prepend">-->
                                    <!--<Icon :size="14" type="locked"></Icon>-->
                                <!--</span>-->
                            <!--</i-input>-->
                        <!--</FormItem>-->
                        <!--<FormItem>-->
                            <!--<Button @click="handleSubmit" type="primary" long>登录</Button>-->
                        <!--</FormItem>-->
                    <!--</Form>-->
                <!--</div>-->
            <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="userCode">
                    <el-input type="text" v-model="ruleForm2.userCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit('ruleForm2')">提交</el-button>
                </el-form-item>
            </el-form>

                    <!--<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">-->
                        <!--<el-form-item label="用户名" prop="checkPass">-->
                            <!--<el-input type="test" v-model="ruleForm2.userCode" auto-complete="off"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="密码" prop="pass">-->
                            <!--<el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item>-->
                            <!--<el-button type="primary" @click="handleSubmit('ruleForm2')">登陆</el-button>-->
                        <!--</el-form-item>-->
                    <!--</el-form>-->
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios'
import { mapActions } from 'vuex'
export default {
    data () {
        //输入框校验复杂
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            }else {
                callback();
            }
        };
        return {
            ruleForm2: {
                userCode: 'sys',
                password: '111111'
            },
            rules2: {
                userCode: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            }
        };
    },
    created() {
    },
    computed: {
        url() {
            return this.$store.state.userCode.url //url
        }
    },
    methods: {
        ...mapActions([
            'setHeightContent',
            'SetMenulist',
            'setUserCode'
        ]),
        handleSubmit (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // const url = this.url + '/duty/findDutyByCondition'
                    // var params = {
                    //     userCode: this.ruleForm2.userCode,
                    //     password: this.ruleForm2.password
                    // }
                    // axios({
                    //     method: 'post',
                    //     url: url,
                    //     data: params
                    // }).then(
                    //     response => {
                    //         if ( response.data.code === 200 && response.data.data !=null) {
                                //var user = response.data.data;
                                //交管并没有登陆只有模拟登陆成功接口了
                                var user={
                                    code:'sys',
                                    id:1,
                                    modules:[],
                                    name:'管理员',
                                    orgId:1,
                                    orgName: '金海市联动中心',
                                    orgQueryCode: 'DS1.',
                                    personId: 1,
                                    regionId: 1,
                                    regionQueryCode: 'DS1.',
                                    userType: 'center'
                                }
                                // //用户名称
                                var name = user.name || userCode;
                                //设置cookie
                                Cookies.set('userCode',user.code);
                                this.setUserCode(Cookies.get('userCode'))
                                Cookies.set('name',name);
                                Cookies.set('loginMode','nosso');
                                Cookies.set('regionId',user.regionId);
                                Cookies.set('regionQueryCode',user.regionQueryCode);
                                Cookies.set('orgId',user.orgId);
                                Cookies.set('orgName',user.orgName);
                                Cookies.set('orgQueryCode',user.orgQueryCode);
                                Cookies.set('userType',user.userType);
                                Cookies.set("categoryId", user.categoryId ? user.categoryId : 1);
                                Cookies.set("personId",user.personId);
                                //存储本地
                                let userlocakStorae=[
                                    {
                                                id:33,
                                                code:"PLAN010033",
                                                name:"警员/功能",
                                                children:[
                                                    {
                                                        id:18,
                                                        code:"PLAN010100",
                                                        name:"警员信息维护",
                                                path:"/trafic/police/permissions",
                                                pathType:2,
                                                system:"PLAN",
                                            },
                                            {
                                                id:18,
                                                code:"PLAN010100",
                                                name:"部门维护",
                                                path:"/trafic/police/department",
                                                pathType:2,
                                                system:"PLAN",
                                            }
                                        ]
                                    },
                                    {
                                        id:33,
                                        code:"PLAN010033",
                                        name:"交管应急值守",
                                        children:[
                                            {
                                                id:18,
                                                code:"PLAN010100",
                                                name:"值班/排班",
                                                path:"/trafic/onduty/scheduling",
                                                pathType:2,
                                                system:"PLAN",
                                            },
                                            {
                                                id:19,
                                                code:"PLAN010101",
                                                name:"值班/排班/表格",
                                                path:"/trafic/onduty/scheduTable",
                                                pathType:2,
                                                system:"PLAN",
                                            }
                                        ]
                                    },
                                    {
                                        id:33,
                                        code:"PLAN010033",
                                        name:"交管地图",
                                        children:[
                                            {
                                                id:18,
                                                code:"PLAN010100",
                                                name:"地图详情",
                                                path:"/trafic/gis",
                                                pathType:2,
                                                system:"PLAN",
                                            },
                                            {
                                                id:18,
                                                code:"PLAN010100",
                                                name:"HTML5",
                                                path:"/trafic/gis/html5",
                                                pathType:2,
                                                system:"PLAN",
                                            }
                                        ]
                                    },
                                    {
                                        id:32,
                                        code:"PLAN010033",
                                        name:"设备",
                                        children:[
                                            {
                                                id:18,
                                                code:"PLAN010100",
                                                name:"设备类型",
                                                path:"/trafic/equipment/equipment",
                                                pathType:2,
                                                system:"PLAN",
                                            },
                                            {
                                                id:18,
                                                code:"PLAN010100",
                                                name:"资源查询",
                                                path:"/trafic/equipment/gisResources",
                                                pathType:2,
                                                system:"PLAN",
                                            },
                                            {
                                                id:18,
                                                code:"PLAN010100",
                                                name:"设备属性",
                                                path:"/trafic/equipment/device",
                                                pathType:2,
                                                system:"PLAN",
                                            },
                                            {
                                                id:18,
                                                code:"PLAN010100",
                                                name:"设备表格三种数据展示",
                                                path:"/trafic/equipment/echartsEpt",
                                                pathType:2,
                                                system:"PLAN",
                                            }
                                        ]
                                    },
                                ]
                                for(let i=0;i<userlocakStorae.length;i++){
                                    user.modules.push(userlocakStorae[i])
                                }
                                localStorage.setItem("userAuthority",JSON.stringify(user));
                                //跳转到成功页面
                                Cookies.set('user', this.ruleForm2.userCode);
                                Cookies.set('password', this.ruleForm2.password);
                                window.location.href = '/#/home'
                    //         }
                    //     }
                    // ).catch(
                    // );
                }
            });
        },
        /*set cookie*/
        setCookie(name, value, Days){
            if (Days === null || Days === '') {
                Days = 300
            }
            let exp  = new Date()
            exp.setTime(exp.getTime() + Days*24*60*60*1000)
            document.cookie = name + "="+ escape (value) + "; path=/;expires=" + exp.toGMTString()
            //document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        },
        /*get cookie*/
        getCookie(name) {
            let arr
            const reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)")
            if (arr === document.cookie.match(reg)) {
                return unescape(arr[2])
            } else {
                return null
            }
        },
        /*get all cookie*/
        getAllCookie() {
            return document.cookie;
        },
        /* clear cookie*/
        clearCookie(name) {
            setCookie(name, '', -1);
        },
        delCookie(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=getCookie(name);
            if(cval!=null) {
                document.cookie= name + "="+cval+"; path=/;expires="+exp.toGMTString()
            }
        }
    },
    mounted() {
        const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setHeightContent(h)
    }
};
</script>

<style>

</style>
