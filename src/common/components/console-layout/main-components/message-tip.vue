<template>
    <div @click="showMessage" class="message-con">
        <!--<p :content="value > 0 ? '有' + webSeket + '条未读消息' : '无未读消息'" placement="bottom">-->
            <!--&lt;!&ndash;<Badge :count="value">&ndash;&gt;-->
                <!--&lt;!&ndash;<Icon type="volume-high" :size="22"></Icon>&ndash;&gt;-->
            <!--&lt;!&ndash;</Badge>&ndash;&gt;-->
        <!--</p>-->
        <el-dialog
        title="提示"
        width="40%"
        >
            <!--<Modal v-model="messageModal" :mask-closable="false" width="500" class-name="vertical-center-modal">-->
                <!--<p slot="header" style="color:#f60;text-align:center">-->
                    <!--<span>{{title}}</span>-->
                <!--</p>-->
                <ul class="message-top-ul" v-show="webSeket>1"> <!--多条消息-->
                    <li v-for="item in this.$store.state.websocket.messageData ">{{item.msgName}}{{item.msgSource}}{{item.msgCode}}<el-button @click="removeWebsocketData(item)">删除</el-button></li>
                </ul>

                <ul class="message-top-ul" v-show="webSeket===1"><!--一条消息-->
                    <li v-for="item in this.$store.state.websocket.messageData ">{{item.msgName}}{{item.msgSource}}{{item.msgCode}}<el-button @click="removeWebsocketData(item)">删除</el-button></li>
                </ul>
                <!--<div style="text-align:left;max-height:400px;over-flow:auto;">-->

                <!--</div>-->
                <div slot="footer">
                    <el-button type="primary" @click="contorlTheModal">确定</el-button>
                    <el-button type="ghost" @click="closeTheModal">取消</el-button>
                </div>

        </el-dialog>
    </div>
</template>

<script>
import util from '@/libs/util.js';
import  { mapActions } from  'vuex'
import  webAudio from  '@/common/components/websocket/websockAudio'
import  msgProcess from  '@/common/components/websocket/msgProcess'
import Cookies from 'js-cookie';
export default {
    name: 'messageTip',
    props: {
        value: {
            type: Number,
            default: 0
        }
    },
    data() {
        return{
            messageModal: false,
            title: '消息列表',
            msgListDatas:[]
        }
    },
    created() {
        this.$store.commit('setMessageCount', 3);
        this.getRootPath();
        this.websocketSendMes();
        this.msgList();//重新渲染
    },
    computed:{
        url() {
            return this.$store.state.userCode.url //url
        },
        webSeket(){
            this.msgList();
            console.log('gj', this.$store.state.websocket.messageData)
            return this.$store.state.websocket.messageData.length
        }
    },

    methods: {
        ...mapActions([
            'setWebsocketData', //存websocket信息
            'removeWebsocketData'//删除当前对象
        ]),
        webAudioClick(id){
            webAudio.autoClick(id);
        },
        msgProcessType(msgType){
            msgProcess.websocketType(msgType);
        },
        msgList(){
          for(let i=0;i<this.$store.state.websocket.messageData.length;i++){
            if(this.$store.state.websocket.messageData[i].mesNumber == 1){
               this.msgListDatas.push(this.$store.state.websocket.messageData[i]);
            }
          }
        },
        /**
         * 获取系统根路径
         *
         * @returns 返回系统的根路径：http://ip:port/serverName
         */
        getRootPath(){
            var curWwwPath=window.document.location.href;
            // var pathName=window.document.location.pathname;
            var pos=curWwwPath.indexOf('#');
            var localhostPath=curWwwPath.substring(0,pos);
            //获取带"/"的项目名，如：/uimcardprj
            // var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
            // var rootPath = localhostPath+projectName;
            var rootPath = localhostPath;
            return rootPath;
        },
        //websocket开始
        getUserCodeFromCookie(){
            const userCode = Cookies.get('userCode');
            if(userCode === null || userCode === 'null'){
                //返回空串
                return '';
            }
        //	Cookie.set('userCode',userCode);
            return userCode;
        },
        /**
         * 获取用户的地区科室
        */
        getCurrentUserInfo(){
            const userCode = this.getUserCodeFromCookie();
            const userName = Cookies.get('name');
            const regionId = Cookies.get("regionId");
            const regionQueryCode = Cookies.get("regionQueryCode");
            const orgId = Cookies.get("orgId");
            const orgName = Cookies.get("orgName");
            const orgQueryCode = Cookies.get("orgQueryCode");
            const userType = Cookies.get("userType");
            const categoryId = Cookies.get("categoryId");
            const personId = Cookies.get("personId");
            const currentInfo = {
                userCode,
                userName,
                regionId,
                regionQueryCode,
                orgId,
                orgName,
                orgQueryCode,
                userType,
                categoryId,
                personId
            };
            return currentInfo;
        },
        websocketSendMes () {
            // let path = this.getRootPath() + "/dsWebsocket/" + JSON.stringify(this.getCurrentUserInfo())+"/true";
            // path = path.replace("http://", 'ws://');
            const path = 'ws://10.168.4.198:8080/dsWebsocket/'+ JSON.stringify(this.getCurrentUserInfo())+"/true"
            // Create WebSocket connection.
            const socket = new WebSocket(path);//url
            // Connection opened
            socket.onopen = (event) => {
                socket.send(JSON.stringify(this.getCurrentUserInfo()));
            };
            // Close Socket
            // socket.onclose = (event) => {
            //     socket.close();
            // };
            // Listen for messages
            socket.onmessage = (event) => {
                console.log('我已经接收到消息了', event.data,this.$store.state.websocket.messageRemind);
                //初始进来应该清空重新装
                this.$store.state.websocket.messageRemind = []
                let eventData = JSON.parse(event.data);
                eventData.rotetPath=this.$route.path;
                if(eventData){
                    let msg = msgProcess[eventData.msgCode];
                    msg.method(eventData)
                    if(msg.msgRemind){//需要push消息列表
                        if(msg.audio){
                            eventData.mesNumber =0
                            this.$store.state.websocket.messageRemind=true //应该是让喇叭叫的
                        }
                        this.setWebsocketData(eventData);
                    }
                }
            };
        },
        //websocket结束
        showMessage () {
            // util.openNewPage(this, 'message_index');
            // this.$router.push({
            //     name: 'message_index'
            // });
            // this.websocketSendMes()
            this.messageModal = true;
            this.$store.state.websocket.messageRemind=false //打开是全局控制不叫的
            console.log("我是打开按钮");
            this.websocketSendMes();
            //this.webAudioClick(1);//关闭声音
        },
        closeTheModal() {
            this.messageModal = false;
            this.$store.state.websocket.messageRemind=true //放开叫的权限
            console.log("我是取消按钮");
        },
        contorlTheModal() {
            this.messageModal = false;
            this.$store.state.websocket.messageRemind=true //放开叫的权限
            console.log("我是确定按钮")

        }
    }
};
</script>

<style>
    .message-top-ul{
        float: left;
        width: 100%;
    }
    .message-top-ul li{
        float: left;
        width: 100%;
        padding: 10px 0px;
        margin-bottom: 6px;
        background: #ccc;
    }
</style>
