import { Refuge } from './';

export default {
    saveVehicleResTypeId: params =>
    Refuge.get('http://localhost:8080/resource/refuge/getRefugeDetail', {
      params: {
        ...params
      }
    })
};
