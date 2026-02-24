import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../envorment/environment';
import { apiNames } from './api-names';

@Injectable({
  providedIn: 'root',
})
export class AllServices {


  constructor(public http: HttpClient) { }

  GetCars() {
    return this.http.get(`${environment.apiUrl}/${apiNames.GetCars}`)
  }


  createNewCar(requestBody: any) {
    return this.http.post(`${environment.apiUrl}/${apiNames.CreateNewCar}`, requestBody)
  }

  UpdateCar(requestBody: any) {
    return this.http.put(`${environment.apiUrl}/${apiNames.UpdateCar}`, requestBody)
  }

  DeleteCarbyCarId(carId: number | string) {
    const id = Number(carId);
    return this.http.delete(`${environment.apiUrl}/${apiNames.DeleteCarbyCarId}`, {
      params: { carId: String(id) },
    })
  }

  //   DeleteCarbyCarId(carId: number) {
  //   return this.http.delete(`${environment.apiUrl}/${apiNames.DeleteCarbyCarId}/${carId}`);
  // }






}
