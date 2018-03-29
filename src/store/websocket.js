import * as types from './constants/websocket-types';
import Main from '@/common/components/console-layout/Main.vue';
import  webAudio from  '@/common/components/websocket/websockAudio'
const state = {
    messageData: [],
    messageRemind:false ,// 默认是没有声音的
    messageNuber:0
};

const actions = {
    setWebsocketData ({ commit, state }, params) {
        commit(types.WEBSOCKET_MESSAGE_DATA, { params });
    },
    removeWebsocketData ({ commit, state }, params) {
        commit(types.REMOVE_MESSAGE, { params });
    }
};

const mutations = {
    [types.WEBSOCKET_MESSAGE_DATA] (state, { params }) {
        state.messageData.push(params);
        if(state.messageRemind){
            for(let i = 0;i<state.messageData.length;i++){
                if(state.messageData[i].mesNumber == 0){
                    webAudio.autoClick(0);
                }
            }
        }
    },
    [types.REMOVE_MESSAGE] (state, { params }) {
        // state.messageData.push(params)
        let indeice = state.messageData.indexOf(params);
        console.log(params,state.messageData)
        state.messageData.splice(indeice,1);
        if(state.messageData.length > 0 ){
            webAudio.autoClick(0);
        }else{
            webAudio.autoClick(1);
        }
    }
};

export default {
    state,
    actions,
    mutations
};
