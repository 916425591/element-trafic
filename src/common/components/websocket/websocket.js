// import  { mapActions } from  'vuex'
// import Cookies from 'js-cookie';
// let  websocket={
//
// }
// websocket.getUserCodeFromCookie = () => {
//     const userCode = Cookies.get('userCode');
//     if(userCode === null || userCode === 'null'){
//         //返回空串
//         return '';
//     }
//     //	Cookie.set('userCode',userCode);
//     return userCode;
// };
// /**
//  * 获取用户的地区科室
//  */
// websocket.getCurrentUserInfo = () => {
//     const userCode = websocket.getUserCodeFromCookie();
//     const userName = Cookies.get('name');
//     const regionId = Cookies.get('regionId');
//     const regionQueryCode = Cookies.get('regionQueryCode');
//     const orgId = Cookies.get('orgId');
//     const orgName = Cookies.get('orgName');
//     const orgQueryCode = Cookies.get('orgQueryCode');
//     const userType = Cookies.get('userType');
//     const categoryId = Cookies.get('categoryId');
//     const personId = Cookies.get('personId');
//     const currentInfo = {
//         userCode,
//         userName,
//         regionId,
//         regionQueryCode,
//         orgId,
//         orgName,
//         orgQueryCode,
//         userType,
//         categoryId,
//         personId
//     };
//     return currentInfo;
// };
// websocket.websocketSendMes =()=> {
//     // let path = this.getRootPath() + "/dsWebsocket/" + JSON.stringify(this.getCurrentUserInfo())+"/true";
//     // path = path.replace("http://", 'ws://');
//     console.log(123123)
//     const path = 'ws://10.168.4.198:8080/dsWebsocket/'+ JSON.stringify(websocket.getCurrentUserInfo())+"/true"
//     // Create WebSocket connection.
//     const socket = new WebSocket(path);//url
//     // Connection opened
//     socket.onopen = (event) => {
//         socket.send(JSON.stringify(websocket.getCurrentUserInfo()));
//     };
//     // Close Socket
//     // socket.onclose = (event) => {
//     //     socket.close();
//     // };
//     // Listen for messages
//     socket.onmessage = (event) => {
//
//         console.log('我已经接收到消息了', event.data);
//         let eventData = JSON.parse(event.data);
//
//         //在调一个方法 msgCord 获取这个消息，获取这个消息再去调一下接口 接口返回这是个什么类型的消息，还要去调接口的处理方法
//         // mapActions.setWebsocketData(eventData);
//     };
// };
// export default websocket;
