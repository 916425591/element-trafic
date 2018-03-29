import { Refuge } from './';

export default {
    saveVehicleResTypeId: params =>
    Refuge.get('http://localhost:8080/resource/vehicle/getVehicleDetail', {
      params: {
        ...params
      }
    })
};
