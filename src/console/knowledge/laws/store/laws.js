import * as types from '../constants/mutation-types';
import Laws from '../resource/laws';

const state = {
    lawsTypeList: [
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
                            title: '地质灾害有关技术规范1'
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
        // {
        //     id: 4,
        //     title: '技术规范',
        //     expand: true,
        //     children: [
        //         {
        //             id: 5,
        //             title: '自然灾害有关技术规范',
        //             expand: true,
        //             children: [
        //                 {
        //                     id: 8,
        //                     title: '地质灾害有关技术规范'
        //                 }
        //             ]
        //         },
        //         {
        //             id: 6,
        //             title: '事故灾难有关技术规范',
        //             expand: true,
        //             children: [
        //                 {
        //                     id: 7,
        //                     title: '火灾事故有关法律法规'
        //                 }
        //             ]
        //         }
        //     ]
        // }
    ],
    lawsTypeModalTreeList: [
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
    lawsTableList: [
        {
            index: 1,
            id: 1,
            name: '水旱灾害应对法律',
            fileCode: '国2017[15]',
            fileType: '4',
            fileTypeName: '水旱灾害有关法律法规',
            fileLevel: '1',
            publishOrg: '中华人民共和国',
            publishDate: '2014-12-12',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 2,
            id: 2,
            name: '水旱灾害应对法律',
            fileCode: '国2017[15]',
            fileType: '3',
            fileTypeName: '水旱灾害有关法律法规',
            fileLevel: '2',
            publishOrg: '中华人民共和国',
            publishDate: '2014-12-12',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 3,
            id: 3,
            name: '水旱灾害应对法律',
            fileCode: '国2017[15]',
            fileType: '2',
            fileTypeName: '水旱灾害有关法律法规',
            fileLevel: '3',
            publishOrg: '中华人民共和国',
            publishDate: '2014-12-12',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            name: '水旱灾害应对法律',
            fileCode: '国2017[15]',
            fileType: '1',
            fileTypeName: '水旱灾害有关法律法规',
            fileLevel: '4',
            publishOrg: '中华人民共和国',
            publishDate: '2014-12-12',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            name: '水旱灾害应对法律',
            fileCode: '国2017[15]',
            fileType: '1',
            fileTypeName: '水旱灾害有关法律法规',
            fileLevel: '4',
            publishOrg: '中华人民共和国',
            publishDate: '2014-12-12',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            name: '水旱灾害应对法律',
            fileCode: '国2017[15]',
            fileType: '1',
            fileTypeName: '水旱灾害有关法律法规',
            fileLevel: '4',
            publishOrg: '中华人民共和国',
            publishDate: '2014-12-12',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            name: '水旱灾害应对法律',
            fileCode: '国2017[15]',
            fileType: '1',
            fileTypeName: '水旱灾害有关法律法规',
            fileLevel: '4',
            publishOrg: '中华人民共和国',
            publishDate: '2014-12-12',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        },
        {
            index: 4,
            id: 4,
            name: '水旱灾害应对法律4',
            fileCode: '国2017[15]',
            fileType: '1',
            fileTypeName: '水旱灾害有关法律法规',
            fileLevel: '4',
            publishOrg: '中华人民共和国',
            publishDate: '2014-12-12',
            keywords: '水旱灾',
            content: '暴雨引发积水'
        }
    ],
    lawsInfo: {
        id: '',
        fileType: '', // 文件类型
        fileTypeName: '', // 文件类型名称
        name: '', // 文件标题
        fileCode: '', // 文件号
        fileLevel: '', // 文件层级
        publishOrg: '', // 发布单位
        publishDate: '', // 发布时间
        keywords: '', // 关键字
        content: '' // 内容
    },
    queryConditions: {
        name: '',
        fileLevel: '',
        keywords: ''
    },
    lawsFileTypeInfo: {
        id: '',
        name: ''
    },
    modalStatus: false,
    typeModalStatus: false,
    addEditStatus: 'add',
    returnCode: '',
    nodes: ''
};

const actions = {
    // 获取树列表
    getLawsTypeList ({ commit, state }, params) {
        Laws.getLawsTypeList(params).then(response => {
            if (response.data && response.data.data) {
                if (response.data.data.list) {
                    const { list } = response.data.data;
                    commit(types.LAWS_TYPE_LIST, { list });
                }
            }
        });
    },
    // 获取表格列表
    getLawsTableList ({ commit, state }, params) {
        Laws.getLawsTableList(params).then(response => {
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
    saveAddLaws ({ commit, state }, params) {
        Laws.saveAddLaws(params).then(response => {
            if (response.data && response.data.code === 200) {
                commit(types.ADD_LAWS, '200');
            } else {
                commit(types.ADD_LAWS, '');
            }
        });
    },
    // 编辑保存
    saveEditLaws ({ commit, state }, params) {
        Laws.saveEditLaws(params).then(response => {
            if (response.data && response.data.code === 200) {
                commit(types.EDIT_LAWS, { params });
            }
        });
    },
    // 删除记录
    deleteLawsRecord ({ commit, state }, params) {
        Laws.deleteLawsRecord(params).then(response => {
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
    setLawsTypeId ({ commit, state }, params) {
        commit(types.SET_LAWS_TYPE_ID, { params });
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
    setLawsFileTypeInfo ({ commit, state }, params) {
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
    [types.LAWS_TYPE_LIST] (state, list) {
        // state.lawsTypeList = commonJS.AssemblyArray(list);
        state.lawsTypeList = state.lawsTypeList.concat(list);
    },
    // 改变弹出框状态
    [types.CHANGE_STATUS] (state, { params }) {
        state.modalStatus = params;
    },
    // 获取表格列表
    [types.TABLE_LIST] (state, { data }) {
        state.lawsTableList = data;
    },
    // 删除记录
    [types.DELETE_INFO] (state, params) {
        state.returnCode = params;
    },
    // 设置信息
    [types.SET_INFO] (state, { params }) {
        state.lawsInfo.id = params ? params.id ? params.id : '' : '';
        state.lawsInfo.fileType = params ? params.fileType ? params.fileType : state.lawsFileTypeInfo.id : state.lawsFileTypeInfo.id;
        state.lawsInfo.fileTypeName = params ? params.fileTypeName ? params.fileTypeName : state.lawsFileTypeInfo.name : state.lawsFileTypeInfo.name;
        state.lawsInfo.name = params ? params.name ? params.name : '' : '';
        state.lawsInfo.fileCode = params ? params.fileCode ? params.fileCode : '' : '';
        state.lawsInfo.fileLevel = params ? params.fileLevel ? params.fileLevel : '' : '';
        state.lawsInfo.publishOrg = params ? params.publishOrg ? params.publishOrg : '' : '';
        state.lawsInfo.publishDate = params ? params.publishDate ? params.publishDate : '' : '';
        state.lawsInfo.keywords = params ? params.keywords ? params.keywords : '' : '';
        state.lawsInfo.content = params ? params.content ? params.content : '' : '';
    },
    // 新增
    [types.ADD_LAWS] (state, params) {
        state.returnCode = params;
    },
    // 编辑
    [types.EDIT_LAWS] (state, { data }) {
        state.lawsTableList = data;
    },
    // 设置新增编辑状态
    [types.SET_ADD_EDIT_STATUS] (state, { params }) {
        state.addEditStatus = params;
    },
    // 设置类型ID
    [types.SET_LAWS_TYPE_ID] (state, { params }) {
        state.lawsTypeId = params;
    },
    // 设置查询条件
    [types.SET_QUERY_CONDITIONS] (state, { params }) {
        state.queryConditions.name = params ? params.name ? params.name : '' : '';
        state.queryConditions.fileLevel = params ? params.fileLevel ? params.fileLevel : '' : '';
        state.queryConditions.keywords = params ? params.keywords ? params.keywords : '' : '';
    },
    // 时间格式化
    [types.DATE_FORMAT] (state, { params }) {
        state.lawsInfo.publishDate = params;
    },
    // 类型弹出框状态
    [types.CHANGE_TYPE_STATUS] (state, { params }) {
        state.typeModalStatus = params;
    },
    // 设置文件类型
    [types.SET_FILE_TYPE] (state, { params }) {
        state.lawsInfo.fileType = params.fileType;
        state.lawsInfo.fileTypeName = params.fileTypeName;
    },
    // 设置文件类型ID
    [types.SET_FILE_TYPE_INFO] (state, { params }) {
        state.lawsFileTypeInfo.id = params.id;
        state.lawsFileTypeInfo.name = params.name;
        state.lawsInfo.fileType = params.id;
        state.lawsInfo.fileTypeName = params.name;
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
