import * as types from '../constants/mutation-types';
import Classify from '../resource/Classify';

const state = {
    classifyTypeList: [
        {
            id: 0,
            title: '法律法规',
            expand: true,
            children: [
                {
                    id: 1,
                    title: '突发事件应对法',
                    expand: true,
                    children: [
                        {
                            id: 10,
                            title: '中华人民共和国突发事件应对法'
                        },
                        {
                            id: 11,
                            title: '突发事件应对有关行政法规'
                        }
                    ]
                },
                {
                    id: 3,
                    title: '自然灾害有关法律',
                    expand: true,
                    children: [
                        {
                            id: 9,
                            title: '水旱灾害有关法律'
                        }
                    ]
                }
            ]
        },
        {
            id: 4,
            title: '技术规范',
            expand: true,
            children: [
                {
                    id: 5,
                    title: '自然灾害有关技术规范',
                    expand: true,
                    children: [
                        {
                            id: 8,
                            title: '地质灾害有关技术规范'
                        }
                    ]
                },
                {
                    id: 6,
                    title: '事故灾难有关技术规范',
                    expand: true,
                    children: [
                        {
                            id: 7,
                            title: '火灾事故有关法律法规'
                        }
                    ]
                }
            ]
        },
        {
            id: 4,
            title: '技术规范',
            expand: true,
            children: [
                {
                    id: 5,
                    title: '自然灾害有关技术规范',
                    expand: true,
                    children: [
                        {
                            id: 8,
                            title: '地质灾害有关技术规范'
                        }
                    ]
                },
                {
                    id: 6,
                    title: '事故灾难有关技术规范',
                    expand: true,
                    children: [
                        {
                            id: 7,
                            title: '火灾事故有关法律法规'
                        }
                    ]
                }
            ]
        },
        {
            id: 4,
            title: '技术规范',
            expand: true,
            children: [
                {
                    id: 5,
                    title: '自然灾害有关技术规范',
                    expand: true,
                    children: [
                        {
                            id: 8,
                            title: '地质灾害有关技术规范'
                        }
                    ]
                },
                {
                    id: 6,
                    title: '事故灾难有关技术规范',
                    expand: true,
                    children: [
                        {
                            id: 7,
                            title: '火灾事故有关法律法规'
                        }
                    ]
                }
            ]
        }
    ],
    classifyTypeModalTreeList: [
        {
            id: 0,
            title: '法律法规',
            expand: true,
            children: [
                {
                    id: 1,
                    title: '突发事件应对法',
                    expand: true,
                    children: [
                        {
                            title: '中华人民共和国突发事件应对法'
                        },
                        {
                            title: '突发事件应对有关行政法规'
                        }
                    ]
                },
                {
                    id: 2,
                    title: '自然灾害有关法律',
                    expand: true,
                    children: [
                        {
                            title: '水旱灾害有关法律'
                        }
                    ]
                }
            ]
        },
        {
            title: '技术规范',
            expand: true,
            children: [
                {
                    id: 3,
                    title: '自然灾害有关技术规范',
                    expand: true,
                    children: [
                        {
                            title: '地质灾害有关技术规范'
                        }
                    ]
                },
                {
                    id: 4,
                    title: '事故灾难有关技术规范',
                    expand: true,
                    children: [
                        {
                            title: '火灾事故有关法律法规'
                        }
                    ]
                }
            ]
        }
    ],
    classifyTableList: [
        {
            index: 4,
            id: 4,
            title: '水旱灾害应对法律',
            incidentType: '水旱灾害有关法律法规',
            incidentLevel: '4',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            title: '水旱灾害应对法律',
            incidentType: '水旱灾害有关法律法规',
            incidentLevel: '4',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            title: '水旱灾害应对法律',
            incidentType: '水旱灾害有关法律法规',
            incidentLevel: '4',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            title: '水旱灾害应对法律',
            incidentType: '水旱灾害有关法律法规',
            incidentLevel: '4',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            title: '水旱灾害应对法律',
            incidentType: '水旱灾害有关法律法规',
            incidentLevel: '4',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            title: '水旱灾害应对法律',
            incidentType: '水旱灾害有关法律法规',
            incidentLevel: '4',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            title: '水旱灾害应对法律',
            incidentType: '水旱灾害有关法律法规',
            incidentLevel: '4',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            title: '水旱灾害应对法律',
            incidentType: '水旱灾害有关法律法规',
            incidentLevel: '4',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        }
    ],
    classifyInfo: {
        id: '',
        incidentType: '', // 事件类型
        incidentLevel: '', // 事件等级
        title: '', // 标题
        keywords: '', // 关键字
        content: '' // 内容
    },
    queryConditions: {
        title: '',
        incidentLevel: '',
        keywords: ''
    },
    classifyFileTypeInfo: {
        id: '',
        name: ''
    },
    modalStatus: false,
    typeModalStatus: false,
    addEditStatus: 'add',
    returnCode: '',
    nodes:''
};

const actions = {
    // 获取树列表
    getClassifyTypeList ({ commit, state }, params) {
        Classify.getClassifyTypeList(params).then(response => {
            if (response.data && response.data.data) {
                if (response.data.data.list) {
                    const { list } = response.data.data;
                    commit(types.classify_TYPE_LIST, { list });
                }
            }
        });
    },
    // 获取表格列表
    getClassifyTableList ({ commit, state }, params) {
        Classify.getClassifyTableList(params).then(response => {
            if (response.data && response.data.data) {
                const { data } = response.data;
                commit(types.TABLE_LIST, { data });
            }
        });
    },
    // 点击表格行设置信息
    setInfoWhereClick ({ commit, state }, params) {
        commit(types.SET_INFO, { params });
    },
    // 改变新增修改弹出框状态
    changeModalStatus ({ commit, state }, params) {
        commit(types.CHANGE_STATUS, { params });
    },
    // 设置类型弹框显示状态
    changeTypeModalStatus ({ commit, state }, params) {
        commit(types.CHANGE_TYPE_STATUS, { params });
    },
    // 新增保存
    saveAddClassify ({ commit, state }, params) {
        Classify.saveAddClassify(params).then(response => {
            if (response.data && response.data.code === 200) {
                commit(types.ADD_CLASSIFY, '200');
            } else {
                commit(types.ADD_CLASSIFY, '');
            }
        });
    },
    // 编辑保存
    saveEditClassify ({ commit, state }, params) {
        Classify.saveEditClassify(params).then(response => {
            if (response.data && response.data.code === 200) {
                commit(types.EDIT_CLASSIFY, { params });
            }
        });
    },
    // 删除记录
    deleteClassifyRecord ({ commit, state }, params) {
        Classify.deleteClassifyRecord(params).then(response => {
            if (response.data && response.data.code === 200) {
                commit(types.DELETE_INFO, '200');
            } else {
                commit(types.DELETE_INFO, '');
            }
        });
    },
    // 设置新增编辑状态
    setAddEditStatus ({ commit, state }, params) {
        commit(types.SET_ADD_EDIT_STATUS, { params });
    },
    // 设置类型ID
    setClassifyTypeId ({ commit, state }, params) {
        commit(types.SET_CLASSIFY_TYPE_ID, { params });
    },
    // 设置查询条件
    setQueryConditions ({ commit, state }, params) {
        commit(types.SET_QUERY_CONDITIONS, { params });
    },
    // 设置文件类型
    setFileType ({ commit, state }, params) {
        commit(types.SET_FILE_TYPE, { params });
    },
    // 设置文件类型ID
    setClassifyFileTypeInfo ({ commit, state }, params) {
        commit(types.SET_FILE_TYPE_INFO, { params });
    },
    // 格式化时间
    dateFormat ({ commit, state }, params) {
        commit(types.DATE_FORMAT, { params });
    },
    // 保存法律法规类型
    saveLawTreeNode ({ commit, state }, params) {
        commit(types.SAVE_LAW_TREE_NODE, { params });
    },
};

const mutations = {
    // 获取树列表
    [types.CLASSIFY_TYPE_LIST] (state, list) {
        // state.ClassifyTypeList = commonJS.AssemblyArray(list);
        state.classifyTypeList = state.classifyTypeList.concat(list);
    },
    // 改变弹出框状态
    [types.CHANGE_STATUS] (state, { params }) {
        state.modalStatus = params;
    },
    // 获取表格列表
    [types.TABLE_LIST] (state, { data }) {
        state.classifyTableList = data;
    },
    // 删除记录
    [types.DELETE_INFO] (state, params) {
        state.returnCode = params;
    },
    // 设置信息
    [types.SET_INFO] (state, { params }) {
        state.classifyInfo.id = params ? params.id ? params.id : '' : '';
        state.classifyInfo.incidentType = params ? params.incidentType ? params.incidentType : state.classifyFileTypeInfo.id : state.classifyFileTypeInfo.id;
        state.classifyInfo.incidentTypeName = params ? params.incidentType ? params.incidentType : state.classifyFileTypeInfo.name : state.classifyFileTypeInfo.name;
        state.classifyInfo.title = params ? params.title ? params.title : '' : '';
        state.classifyInfo.incidentLevel = params ? params.incidentLevel ? params.incidentLevel : '' : '';
        state.classifyInfo.keywords = params ? params.keywords ? params.keywords : '' : '';
        state.classifyInfo.content = params ? params.content ? params.content : '' : '';
    },
    // 新增
    [types.ADD_CLASSIFY] (state, params) {
        state.returnCode = params;
    },
    // 编辑
    [types.EDIT_CLASSIFY] (state, { data }) {
        state.classifyTableList = data;
    },
    // 设置新增编辑状态
    [types.SET_ADD_EDIT_STATUS] (state, { params }) {
        state.addEditStatus = params;
    },
    // 设置类型ID
    [types.SET_CLASSIFY_TYPE_ID] (state, { params }) {
        state.classifyTypeId = params;
    },
    // 设置查询条件
    [types.SET_QUERY_CONDITIONS] (state, { params }) {
        state.queryConditions.title = params ? params.title ? params.title : '' : '';
        state.queryConditions.incidentLevel = params ? params.incidentLevel ? params.incidentLevel : '' : '';
        state.queryConditions.keywords = params ? params.keywords ? params.keywords : '' : '';
    },
    // 时间格式化
    [types.DATE_FORMAT] (state, { params }) {
        state.classifyInfo.publishDate = params;
    },
    // 类型弹出框状态
    [types.CHANGE_TYPE_STATUS] (state, { params }) {
        state.typeModalStatus = params;
    },
    // 设置文件类型
    [types.SET_FILE_TYPE] (state, { params }) {
        state.classifyInfo.fileType = params.fileType;
        state.classifyInfo.fileTypeName = params.fileTypeName;
    },
    // 设置文件类型ID
    [types.SET_FILE_TYPE_INFO] (state, { params }) {
        state.classifyFileTypeInfo.id = params.id;
        state.classifyFileTypeInfo.name = params.name;
        state.classifyInfo.fileType = params.id;
        state.classifyInfo.fileTypeName = params.name;
    },
    // 保存法律法规类型
    [types.SAVE_LAW_TREE_NODE] (state, { params }) {
        state.nodes = params;
    }
};

export default {
    state,
    actions,
    mutations
};
