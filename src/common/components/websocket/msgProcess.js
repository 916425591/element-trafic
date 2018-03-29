//需要做2件事情，是不是应该提醒的消息类型，是不是需要对对应的页面进行重新渲染
import  webSokDuty from  '@/common/components/websocket/websocketMsg4Duty'
let  msgProcess={

}

//上线
// msgProcess['online'] = {'audio':false,
//     'method':websocket_LogonSystem,
//     'url':'',
//     };
msgProcess['online'] = {
    method:webSokDuty.online,
    audio:false,
    url:'',
    msgRemind:false,
};
//值守
msgProcess['edutyNewIncident'] = {
    method:webSokDuty.edutyNewIncident,
    audio:true,
    url:'',
    msgRemind:true
   };
//强制退出系统
msgProcess['forcedOffline'] = {
    method:webSokDuty.forcedOffline,
    audio:false,
    url:'',
    msgRemind:false
};

export default msgProcess;
