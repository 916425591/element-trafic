import { Refuge } from './'

export default {
// ‘接口路径 | 模块’   xxx功能
    saveEquipmentResTypeId: params =>
        Refuge.get('http://localhost:8080/resource/equipment/getEquipmentDetail', {
          params: {
            ...params
          }
    })
}
