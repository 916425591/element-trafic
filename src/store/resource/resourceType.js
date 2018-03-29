import { Refuge } from './'

export default {
// ‘接口路径 | 模块’   xxx功能
    queryResourcesList: params =>
        Refuge.get('http://localhost:8080/resource/resourceType/queryResourceTypeAllTree', {
          params: {
            ...params
          }
    }),
    queryResourcesDetail: params =>
    Refuge.get('http://localhost:8080/resource/resourceType/getResourceTypeById', {
      params: {
        ...params
      }
    })
}
