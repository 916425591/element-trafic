// // 
import * as types from './constants/expert-types'
import Refuge from './resource/expert'
import axios from 'axios'


const state = {
    resTypeId: null,
    expertDetail: {
        id: null,
        name: '',
        mobile: '', //移动电话
        duty: '', //职务
        dutyTitle:'', //职称
        affiliationOrg: {
            id: null,
            name: ''
        },
        dutyOrg: {
            id: null,
            name: ''
        },
        major:'', //专业类别
        politics: null, //政治面貌
        politicsName:'', 
        sex: null, //性别
        sexName: '',
        birthday: '',
        email: '',
        education: null,//最高学历
        educationName: '',
        school: '', //毕业院校
        expertise: '', // 个人专长
        experience: '', // 应急处置经验
        academic: '',   //学术成果
        address: '' // 通讯地址
    },
    resourceTypeData:[],
    ds_edit: true
}

const actions = {
    saveExpertResTypeId({ commit, state }, params) {
        const resTypeId =  params
        commit(types.EXPERT_SAVE_RESTYPEID, { resTypeId })
    },
    saveExpertDetailData({ commit, state }, params) {
        const expertDetail =  params
        commit(types.EXPERT_SAVE_DETAIL, { expertDetail })
    },
    getExpertResourceType ({ commit, state }, params) {
        axios({
            method: 'post',
            url: params.url,
            data: params.data
        }).then(
            response => {
                if(response.data.code === 200) {
                    const { data } = response.data;
                    commit(types.GET_EXPERT_RESOURCE_TYPE, { data });
                } else {
                }
            }
        ).catch( 
            error => {
                
            }
        )
    },
    changeEditStatus({ commit, state }, params) {
        const editStatue =  params
        commit(types.EDIT_STATUS, { editStatue })
    }
}

const mutations = {
    [types.EXPERT_SAVE_RESTYPEID](state, { resTypeId }) {
        state.resTypeId = resTypeId
    },
    [types.EXPERT_SAVE_DETAIL](state, { expertDetail }) {
        const res = expertDetail
        state.expertDetail = {
            id: res.id,
            name: res.name,
            mobile: res.mobile,
            duty: res.duty,
            dutyTitle: res.dutyTitle,
            affiliationOrg: {
                id: res.affiliationOrg ? res.affiliationOrg.id : null,
                name: res.affiliationOrg ? res.affiliationOrg.name : ''
            },
            dutyOrg: {
                id: res.dutyOrg ? res.dutyOrg.id : null,
                name: res.dutyOrg ? res.dutyOrg.name : ''
            },
            major: res.major,
            politics: res.politics,
            politicsName: res.politicsName, 
            sex: res.sex,
            sexName: res.sexName,
            birthday: res.birthday,
            email: res.email,
            education: res.education,
            educationName: res.educationName,
            school: res.school,
            expertise: res.expertise,
            experience: res.experience,
            academic : res.academic,
            address: res.address
        }
    },
    [types.GET_EXPERT_RESOURCE_TYPE](state, { data }) {
        state.resourceTypeData = []
        state.resourceTypeData.push({
            value: 'null',
            label: '请选择'
        });
        data.forEach((v, i) => {
            state.resourceTypeData.push({
                value: parseInt(v.id),
                label: v.name
            })
        });
    },
    [types.EDIT_STATUS](state, { editStatue }) {
        state.ds_edit = editStatue
    }
}

export default {
  state,
  actions,
  mutations
}
