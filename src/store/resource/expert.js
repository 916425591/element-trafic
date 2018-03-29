import { Refuge } from './';

export default {
    saveExpertResTypeId: params =>
    Refuge.get('http://localhost:8080/resource/expert/getExpertDetail', {
      params: {
        ...params
      }
    })
};
