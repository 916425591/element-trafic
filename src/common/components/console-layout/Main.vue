<style lang="less">
    @import "./main.less";
    @import "../../assets/styles/template.css";
    @import "../../assets/styles/common.css";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="main-title">
            <span style="line-height:60px;margin-left:20px;color:#fff;font-size:24px;">交通管理联动系统</span>
            <div class="header-avator-con">
                <ul class="menu">
                    <li class="lineHeight_58" @click="homePage">
                         首页
                    </li>
                    <li class="lineHeight_58" @click="dutyStation">
                       值守工作台
                    </li>
                    <li class="lineHeight_58" @click="synergeticCommand">
                         协同指挥
                    </li>
                    <li class="lineHeight_58" @click="preplanEditor">
                       预案编制
                    </li>
                    <li class="lineHeight_58">
                        <!--<message-tip v-model="mesCount"></message-tip>-->
                        <i class="el-icon-message" style="font-size: 20px"></i>
                    </li>
                    <li class="menuLogin">
                        <!--<Dropdown @on-click ="loginOutMethods">-->
                            <!--<a href="javascript:void(0)">-->
                                <!--<small>欢迎您</small>-->
                                <!--<br>-->
                                <!--{{ userName }}-->
                            <!--</a>-->
                            <!--<DropdownMenu slot="list">-->
                                <!--<DropdownItem name='orgCenter'>{{ orgName }}</DropdownItem>-->
                                <!--<DropdownItem name='changePasswords'>修改密码</DropdownItem>-->
                                <!--<DropdownItem name='loginout'>退出登录</DropdownItem>-->
                            <!--</DropdownMenu>-->
                        <!--</Dropdown>-->


                        <el-dropdown trigger="click">
                                <span class="el-dropdown-link">
                                <small>欢迎您 {{ userName }}</small><i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item ><span @click="handleClickUserDropdown('orgCenter')">{{orgName}}</span></el-dropdown-item>
                                    <el-dropdown-item ><span @click="loginOutMethods('changePasswords')">修改密码</span></el-dropdown-item>
                                    <el-dropdown-item ><span @click="handleClickUserDropdown('loginout')">退出登陆</span></el-dropdown-item>
                                </el-dropdown-menu>
                        </el-dropdown>

                    </li>

                    <audio style="display: none;" loop="loop" id="music1" src="http://www.w3school.com.cn/i/horse.ogg" controls="controls">
                        Your browser does not support the audio element.
                    </audio>
                </ul>
            </div>
        </div>
        <div class="sidebar-menu-con" :style="{width: shrink?'0px':'250px', overflow: shrink ? 'visible' : 'auto'}">
            <div id="menuDiv" class="ds-menu-box ds-hide">
                <div class="ds-menu">
                    <ul id="dsmenufirstUL">
                        <li class="ds-home ds-noChild ds-active" style="height:43px;" @click="onChangePageIndex" href="/#/home">
                            <a><p>首页</p></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'0':'250px'}">
            <div class="main-header">
                <div :content="this.shrink ? '显示菜单' : '隐藏菜单'" placement="bottom-start">
                    <div class="navicon-con">
                        <div class="ment-icon" :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)',top:this.shrink ? '6px' : '9px' }"  @click="toggleClick">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath" ></breadcrumb-nav>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con"   :style="{marginLeft: shrink?'0':'250px',width:shrink?fullWidth+'px':fullWidth-250+'px',height:fullHeight+'px'}" >

            <div class="single-page" id="dsMap" style=" overflow: hidden;">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<script>
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import axios from 'axios';
    import $ from 'jquery'
    import { mapActions } from 'vuex';
    import echarts from 'echarts';

    export default {
        components: {
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip
        },
        data () {
            return {
                shrink: true,
                userName: '',
                isFullScreen: false,
                orgName: '',
                fullWidth:`${document.documentElement.clientWidth}`,
                fullHeight:`${document.documentElement.clientHeight - 101}`
            };
        },
        computed: {
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            mesCount () {
                // return this.$store.state.app.messageCount;
                       return this.$store.state.websocket.messageData.length
            },
            url() {
                return this.$store.state.userCode.url //url
            },
            userCode() {
                this.setUserCode(Cookies.get('userCode'))
                return Cookies.get('userCode') //userCode
            },
            oldPath() {
                return this.$store.state.userCode.oldPathurl
            }
        },
        methods: {
            homePage() {
                window.location.href = '/#/home'
            },
            dutyStation() {
                window.location.href = '/#/eduty/duty'
            },
            synergeticCommand() {
                window.location.href = '/#/scd/centerwork'
            },
            preplanEditor() {
                window.location.href = '/#/plan/maintain'
            },
            ...mapActions([
                'setProcessArrowMenu',
                'setProcessArrowStatus',
                'SetPlanId',
                'setUserCode',
                'setShowMessage'
            ]),
            loginOutMethods(name) {
                switch (name) {
                    case 'orgCenter':
                    break
                    case 'changePasswords':
                    break
                    case 'loginout':
                    const url = this.url + '/platform/login/logout'
                    const params = {
                        userCode: this.userCode
                    }
                    axios({
                        method: 'get',
                        url: url,
                        params: params
                    }).then(
                        response => {
                            if(response.data.code === 200){
                                Cookies.remove('userCode');
                                Cookies.remove('name');
                                Cookies.remove('loginMode');
                                Cookies.remove('regionId');
                                Cookies.remove('regionQueryCode');
                                Cookies.remove('orgId');
                                Cookies.remove('orgName');
                                Cookies.remove('orgQueryCode');
                                Cookies.remove('userType');
                                Cookies.remove("categoryId");
                                Cookies.remove("personId");
                                //存储本地
                                localStorage.setItem("userAuthority",'');
                                //跳转到成功页面
                                Cookies.remove('user');
                                Cookies.remove('password');
                                this.$router.push({
                                    name: 'login'
                                });
                            }
                        }
                    ).catch(
                    );
                    break
                    default:
                }
            },
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                // let messageCount = 3;
                // this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                // this.$store.commit('setMessageCount', 3);
            },
            handleClickUserDropdown (name) {
                console.log(name);
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    this.$router.push({
                        name: 'login'
                    });
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            onChangePageIndex() {
                window.location.href = '/#/home'
                // const curWwwPath = window.location.href
                // const pos = curWwwPath.indexOf('#');
                // const localhostPath = curWwwPath.substring(pos);
                // if(localhostPath == '#/home') {
                //     return
                // } else {
                //     window.location.href = '/#/home'
                // }
                // console.log(localhostPath)
                // return false
            },
            menuInit() {
                //初始化人员的权限模块
                this.userMenuModuleInit();
                const vueThis = this
                    //默认打开资源池招聘
                //所有一级菜单
                    //行为放在一级菜单的标题上
                const oldPath = this.oldPath
                $('div#menuDiv').on('click','.ds-hasChild p',function(){
                    //当前被打开 的一级菜单
                    var openMenu = $(this).parent('li');
                    var className = openMenu.attr('class');
                    //如果是当前菜单，不允许关闭
                    if(className.indexOf('ds-active')>0){
                    //关闭状态
                        if($(this).siblings('ul').is(':hidden')){
                            //打开该菜单下的ul元素
                            $(this).siblings('ul').stop().slideDown();
                        }else{//打开状态
                            //收起二级菜单
                            $(this).siblings('ul').stop().slideUp();
                        }
                    }else{//如果不是当前菜单可以打开或关闭
                    //该菜单为关闭状态，则打开该菜单
                        if($(this).siblings('ul').is(':hidden')){
                            //打开该菜单下的ul元素
                            $(this).siblings('ul').stop().slideDown();
                            //收起其他未被选中的菜单
                            $(this).parent('li').siblings('.ds-hasChild:not(.ds-active)').children('ul').stop().slideUp();
                            $(this).parent('li').siblings('.ds-hasChild:not(.ds-active)').children('p').children('.ds-arrow').removeClass('ds-active');
                            //设置当前菜单为选中样式
                            $(this).children('.ds-arrow').addClass('ds-active');
                            if($(this).attr('data-href')) {
                                vueThis.setProcessArrowMenu(['s-cur', 's-cur-next', '', '', ''])
                                vueThis.setProcessArrowStatus(2)
                                vueThis.SetPlanId(null)
                                if($(this).attr('data-path') == 2) {
                                    window.location.href = '/#' + $(this).attr('data-href')
                                } else if($(this).attr('data-path') == 1) {
                                    window.location.href = $(this).attr('data-href')
                                } else {
                                    return
                                }
                            } else {
                                return
                            }
                        }else{//如果该菜单是已打开的菜单
                            //收起二级菜单
                            $(this).siblings('ul').stop().slideUp();
                            //移除当前菜单的选中状态
                            $(this).children('.ds-arrow').removeClass('ds-active');
                            $(this).parent('li').removeClass('ds-active');
                        }
                    }
                });
                //二级菜单单击事件（li元素）
                $('div#menuDiv').on('click','.ds-hasChild ul li',function(){
                    //移除菜单项（li元素）的当前选中样式
                    $('.ds-menu li').removeClass('ds-active');
                    //为当前菜单项增加选中样式
                    $(this).addClass('ds-active');
                    //为父菜单增加选中样式
                    $(this).parent('ul').parent('li.ds-hasChild').addClass('ds-active');
                    //所有未选中状态的菜单全部收起（二级菜单收起）
                    $('.ds-hasChild:not(.ds-active)').children('ul').stop().slideUp();
                    //移除被收起菜单的二级菜单的当前选中样式
                    $('.ds-hasChild:not(.ds-active)').children('p').children('.ds-arrow').removeClass('ds-active');
                    if($(this).attr('data-href')) {
                        vueThis.setProcessArrowMenu(['s-cur', 's-cur-next', '', '', ''])
                        vueThis.setProcessArrowStatus(2)
                        vueThis.SetPlanId(null)
                        if($(this).attr('data-path') == 2) {
                            window.location.href = '/#' + $(this).attr('data-href')
                            if( $(this).attr('data-href') === '/plan/maintain') {
                                vueThis.setShowMessage(1)
                            }
                        } else if($(this).attr('data-path') == 1) {
                            window.location.href = $(this).attr('data-href')
                        } else {
                            return
                        }
                    } else {
                        return
                    }
                });
                //无下级菜单的菜单单击事件
                $('div#menuDiv').on('click','.ds-noChild',function(){
                    $('.ds-menu li').removeClass('ds-active');
                    $(this).addClass('ds-active');
                    $('.ds-hasChild').children('ul').stop().slideUp();
                    $('.ds-hasChild').children('p').children('.ds-arrow').removeClass('ds-active');
                    if($(this).attr('data-href')) {
                        vueThis.setProcessArrowMenu(['s-cur', 's-cur-next', '', '', ''])
                        vueThis.setProcessArrowStatus(2)
                        vueThis.SetPlanId(null)
                        if($(this).attr('data-path') == 2) {
                            window.location.href = '/#' + $(this).attr('data-href')
                        } else if($(this).attr('data-path') == 1) {
                            window.location.href = $(this).attr('data-href')
                        } else {
                            return
                        }
                    } else {
                        return
                    }
                });
            },
            userMenuModuleInit() {
                // var userCode = getCurrentUserCode();
                // if(userCode === ''){
                //   return false;
                // }
                //用户类型
                var userType = Cookies.get('userType');
                if(userType === ''){
                    return false;
                }
                var userModules = JSON.parse(localStorage.getItem("userAuthority")).modules; //在这里获取数组对象
                const oldPath = this.oldPath
                // var userModules = this.data.data.roles
                // console.log(userModules)
                //渲染左边的模块列表
                //顶级domul
                var divDom = $('div.ds-menu').children('ul:first')
                $(".ds-menu ul").addClass("ds-no-padding-left");//ul没有左内边距
                //循环父级module列表
                $.each(userModules,function(index,item){
                    if(item.children.length === 0){
                    var addCodeClass = item.code;
                    var childLiDom = $('<li>'+item.name+'</li>');
                    // console.log('childLiDom', item.path)
                    if(item.path){
                        if(item.pathType == 2) {
                        childLiDom = $('<li class="ds-noChild" style="height:43px;" data-path="' + item.pathType + '" data-href="' + item.path + '">'+'<a><p>'+item.name+'</p></a></li>');
                        } else if (item.pathType == 1) {
                        childLiDom = $('<li class="ds-noChild" style="height:43px;" data-path="' + item.pathType + '" data-href="' + oldPath + '' + item.path + '">'+'<a><p>'+item.name+'</p></a></li>');
                        } else {
                        return
                        }
                    }
                    childLiDom.addClass(addCodeClass);
                    childLiDom.appendTo(divDom);
                    }else{
                    //设置p显示内容
                    var pHeadText = '<p>'+item.name+'<span class="ds-arrow"></span></p>';
                    var fatherTitleLi = $('<li class="'+item.code+'">'+pHeadText+'</li>');
                    //添加到html显示
                    fatherTitleLi.appendTo(divDom);
                    //设置span的样式
                    var addClass = 'ds-hasChild';
                    if(item.children.length === 0){
                        addClass = 'ds-noChild';
                    }
                    $('div.ds-menu').children('ul:first').children('li:last').addClass(addClass);
                    //添加要显示的子节点
                    $('<ul></ul>').appendTo($('div.ds-menu').children('ul:first').children('li:last'));

                    var fatherUl = $('div.ds-menu').children('ul:first').children('li:last').children('ul:first');
                    //渲染child结点
                    $(".ds-hasChild ul").addClass("ds-no-padding-left");//ul没有左内边距
                    var childLiDom
                    $.each(item.children, (childIndex,childItem) => {
                        //设置child li的dom元素
                        childLiDom = $('<li>'+childItem.name+'</li>');
                        if(childItem.path){
                        if(childItem.pathType == 2) {
                            childLiDom = $('<li data-path="' + childItem.pathType + '" data-href="' + childItem.path + '">'+childItem.name+'</li>');
                        } else if (childItem.pathType == 1) {
                            childLiDom = $('<li data-path="' + childItem.pathType + '" data-href="' + oldPath + '' + childItem.path + '">'+childItem.name+'</li>');
                        } else {
                            return
                        }
                        }
                        //添加子元素到html
                        childLiDom.appendTo(fatherUl);
                    });
                    }
                });
                //默认执行点击事件
                this.defaultModelClick()
            },
            modelOnClick(modelCode) {
                //为选中的菜单增加选中效果（modelCode由外部传入）
                var menu = $(modelCode);
                menu.addClass('ds-active');
                if(menu.hasClass('ds-noChild')){
                    menu.trigger("click");
                }else{
                    //显示当前打开的菜单的二级菜单
                    $(modelCode).children('ul').show();
                    //为选中菜单的箭头设置为选ds-active状态
                    $(modelCode).children('p').children('.ds-arrow').addClass('ds-active');
                    //获取选中菜单的第一个二级菜单
                    var li = $(modelCode+' ul li:first');
                    //执行第一个子菜单的click事件
                    li.trigger("click");
                }
            },
            //默认执行点击菜单
            defaultModelClick() {
                var modelCode = this.getModelCode();
                setTimeout(() => {
                    //cont板块固定一屏高度后超出部分滚动
                    $('.ds-cont').outerHeight($(window).height()-60-30).css({"overflow-y": "hidden"});
                    $('.ds-menu').outerHeight($(window).height()-60-30).css({"overflow-y": "auto"});
                    //执行model的onclick事件
                    this.modelOnClick('.' + modelCode);
                }, 0);
            },
            getModelCode(){
                var modelCode = "ds-home";
                var url = location.search; //获取url中"?"符后的字串
                if (url.indexOf("?") !== -1) {
                    var str = url.substr(1);
                    var strs = str.split("=");
                    if('code'.indexOf(strs[0])!==-1){
                        modelCode = strs[1];
                    }
                }
                return modelCode;
            },
            toggleClick () {
                this.shrink = !this.shrink;
                this.$store.state.userCode.globaShrink=this.shrink;
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            },
            fullWidth (val) {
                if(!this.timer) {
                    this.fullWidth = val
                    this.timer = true
                    let that = this
                    setTimeout(function (){
                        that.timer = false
                    },400)
                }
            },
            fullHeight (val) {
                if(!this.timer) {
                    this.fullHeight = val
                    this.timer = true
                    let that = this
                    setTimeout(function (){
                        that.timer = false
                    },400)
                }
            }
        },
        mounted () {
            this.$store.state.userCode.globalWidht =`${document.documentElement.clientWidth}`
            this.$store.state.userCode.globalHeight=`${document.documentElement.clienHeight}`
            console.log(this.$store.state.userCode.globalWidht)
            window.onresize = () => {
                return (() => {
                    window.fullWidth = document.documentElement.clientWidth;
                    window.fullHeight = document.documentElement.clientHeight;
                    this.fullWidth = window.fullWidth;
                    this.fullHeight = window.fullHeight;
                    this.$store.state.userCode.globalWidht = this.fullWidth;
                    this.$store.state.userCode.globalHeight = window.fullHeight;
                })()
            };
            this.init();
            this.menuInit()
            this.userName = Cookies.get('name')
            this.orgName = Cookies.get('orgName')
            this.$nextTick(() => {
                // const w = document.getElementById('charts-div').clientWidth
                // console.log(w, this.shrink)
                // if(!this.shrink) {
                //     console.log('菜单开启')
                // } else {
                //     console.log('菜单关闭')
                // }
                // const dataSourcePie = echarts.init(document.getElementById('data_source_con'))
                // const test1 = echarts.init(document.getElementById('test1'))
                // const test2 = echarts.init(document.getElementById('test2'))
                // const test3 = echarts.init(document.getElementById('test3'))
                // const test4 = echarts.init(document.getElementById('test4'))
                // const test5 = echarts.init(document.getElementById('test5'))
                // dataSourcePie.resize()
                // test1.resize()
                // test2.resize()
                // test3.resize()
                // test4.resize()
                // test5.resize()
            })
                // this.$store.state.userCode.dsMap = new myOL({
                //     //baseMapType:'gaode',
                //     baseMapType: 'baidu',
                //     mapContainer: 'dsMap',
                //     //  controlNames: ['FullScreen'],
                // });
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        }
    };
</script>

<style>
@import './menu/style/menu.css'
</style>

