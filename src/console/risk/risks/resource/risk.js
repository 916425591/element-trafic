import { Laws } from './';

export default {
    // 获取树数据
    getLawsTypeList: params =>
        Laws.post('../tree', {
            ...params
        }),
    // 获取表格数据
    getLawsTableList: params =>
        Laws.post('../table', {
            ...params
        }),
    // 新增保存
    saveAddLaws: params =>
        Laws.post('../add', {
            params: {
                ...params
            }
        }),
    // 编辑保存
    saveEditLaws: params =>
        Laws.post('../edit', {
            params: {
                ...params
            }
        }),
    // 删除记录
    deleteLawsRecord: params =>
        Laws.post('../del', {
            params: {
                ...params
            }
        })
};
