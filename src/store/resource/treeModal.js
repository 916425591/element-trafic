import { Refuge } from './'

export default {
// ‘接口路径 | 模块’   xxx功能
    queryResourcesList: params =>
        Refuge.get('http://127.0.0.1/queryTeamMember', {
          params: {
            ...params
          }
    })
}
