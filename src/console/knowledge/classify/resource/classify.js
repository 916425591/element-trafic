import { Classify } from './';

export default {
    // 获取树数据
    getClassifyTypeList: params =>
        Classify.post('../tree', {
            ...params
        }),
    // 获取表格数据
    getClassifyTableList: params =>
        Classify.post('../table', {
            ...params
        }),
    // 新增保存
    saveAddClassify: params =>
        Classify.post('../add', {
            params: {
                ...params
            }
        }),
    // 编辑保存
    saveEditClassify: params =>
        Classify.post('../edit', {
            params: {
                ...params
            }
        }),
    // 删除记录
    deleteClassifyRecord: params =>
        Classify.post('../del', {
            params: {
                ...params
            }
        })
};
