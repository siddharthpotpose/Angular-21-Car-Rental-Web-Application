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

  //  get customer details

  GetCustomers() {
    return this.http.get(`${environment.apiUrl}/${apiNames.GetCustomers}`)
  }

  CreateNewCustomer(requestBody: any) {
    return this.http.post(`${environment.apiUrl}/${apiNames.CreateNewCustomer}`, requestBody)
  }

  UpdateCustomer(requestBody:any){
  return this.http.put(`${environment.apiUrl}/${apiNames.UpdateCustomer}`,requestBody)
  }

  DeleteCustomerById(customerId : number | string){
  const id = Number(customerId);
  return this.http.delete(`${environment.apiUrl}/${apiNames.DeletCustomerById}`,{
    params : {id: String(id)}
  })
  }







}
