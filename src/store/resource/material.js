import { Refuge } from './';

export default {
    saveMaterialResTypeId: params =>
    Refuge.get('http://localhost:8080/resource/material/getMaterialDetail', {
      params: {
        ...params
      }
    })
};
