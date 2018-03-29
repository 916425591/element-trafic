import * as types from './constants/processArrow-types'
import axios from 'axios'


const state = {
    processArrow: '',
    id: null,
    data:[],
    processArrowMenu:['s-cur', 's-cur-next', '', '', ''],
    status: 0
}

const actions = {
    getProcessArrow({ commit, state }, params) {
        const processArrow = params
        commit(types.GET_PROCESS_ARROW, { processArrow })
    },
    getProcessArrowId({ commit, state }, params) {
        const id = params
        commit(types.GET_PROCESS_ARROW_ID, { id })
    },
    getNewDisposalList ({ commit, state }, params) {
        axios({
            method: 'get',
            url: params.url,
            params: params.data
        }).then(
            response => {
                if(response.data.code === 200) {
                    const { data } = response.data;
                    commit(types.GET_TEMPLATE_DATA_LIST, { data });
                } else {
                }
            }
        ).catch( 
            error => {
                
            }
        )
    },
    setProcessArrowMenu ({ commit, state }, params) {
        const data = params
        commit(types.SET_PROCESS_ARROW_MENU, { data })
    },
    setProcessArrowStatus ({ commit, state }, params) {
        const status = params
        commit(types.SET_PROCESS_ARROW_STATUS, { status })
    },
    clearProcessArrowData ({ commit, state }, params) {
        const data = params
        commit(types.CLEAR_PROCESS_ARROW_MENU, { data })
    }
}

const mutations = {
    [types.CLEAR_PROCESS_ARROW_MENU](state, { data }) {
        state.data = []
    },
    [types.GET_PROCESS_ARROW](state, { processArrow }) {
        state.data = []
        state.processArrow = processArrow
    },
    [types.GET_PROCESS_ARROW_ID](state, { id }) {
        state.data = []
        state.id = id
    },
    [types.GET_TEMPLATE_DATA_LIST](state, { data }) {
        state.data = []
        data.forEach((v, i) => {
            state.data.push({
                id: v.id,
                workName: v.name,
                importantce: v.importanceName,
                measures: v.measures
            })
        })
    },
    [types.SET_PROCESS_ARROW_MENU](state, { data }) {
        state.processArrowMenu = data
    },
    [types.SET_PROCESS_ARROW_STATUS](state, { status }) {
        state.status = status
    }
}

export default {
  state,
  actions,
  mutations
}
