import { Refuge } from './';

export default {
    //  获取
    getExpertTreeList: params =>
        Refuge.post('http://localhost:8080/resource/expert/queryExpertsByPage', {
            // params: {
            ...params
            // }
        }),

};
