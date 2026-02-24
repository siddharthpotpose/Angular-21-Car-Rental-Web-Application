import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AllServices } from '../../share/all-services';

@Component({
  selector: 'app-customer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer {


  
  customerDataRes = signal<any[]>([]);
  showForm : Boolean = false;
  isEditMode : Boolean = false;
  showDeleteModel : boolean = false;
  selectCustomerId : number | null = null;
  showDeleteModal : boolean = false;

  constructor(private toaster : ToastrService, private allServices : AllServices) { }

  ngOnInit() { 
    this.GetCustomersDetails();
  }


  customerForm = new FormGroup({
    CustomerId: new FormControl(0),
    CustomerName: new FormControl('', Validators.required),
    CustomerCity: new FormControl('', Validators.required),
    MobileNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    Email: new FormControl('', Validators.required)
  })

  submitForm() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const customerDataRes = this.customerForm.value;
    console.log('res',customerDataRes)

    if(this.isEditMode){
      
      this.allServices.UpdateCustomer(customerDataRes).subscribe({
        next : (res:any)=>{
          this.toaster.success('customer updated successfully');
          this.onBackToList();
          this.customerForm.reset();
          this.GetCustomersDetails();
        }
      })

    }else{
      customerDataRes.CustomerId = 0;
      this.allServices.CreateNewCustomer(customerDataRes).subscribe({
        next:(res:any)=>{
          this.toaster.success('customer added successfully');
          this.onBackToList();
          this.customerForm.reset();
          this.GetCustomersDetails();
        }
      })
    }


  }



  GetCustomersDetails(){

    this.allServices.GetCustomers().subscribe({
      next : (res:any)=>{
        this.toaster.success('customer details fetched successfully');
        this.customerDataRes.set(res.data);
      },error : (err)=>{
        this.toaster.error('error while fetching customer details')
      }
    })
  }

  editCustomer(item:any){
    this.showForm = true;
    this.isEditMode = true;
    this.customerForm.patchValue({
      CustomerId : item.customerId,
      CustomerName: item.customerName,
      CustomerCity: item.customerCity,
      MobileNo: item.mobileNo,
      Email : item.email
    })
  
  }

  openDeleteModal(customerId : number){
    this.showDeleteModal = true;
   this.selectCustomerId = customerId;
  }


  closeDeleteModal(){
   this.showDeleteModal = false;
   this.selectCustomerId = null;
  }

  confirmDeleteStatic(){
    if(this.selectCustomerId === null){
       this.toaster.error('invalid customer id');
       return;
    }
    this.allServices.DeleteCustomerById(this.selectCustomerId).subscribe({
      next:(res:any)=>{
         console.log('selectCustomerId  deleted', res)
        this.toaster.success('customer deleted successfully')
          this.closeDeleteModal();
          this.GetCustomersDetails();
      },error:(err:any)=>{
        this.toaster.error('error while deleteing customer')
      }
    })

  }


  onAddCustomer(){
    this.showForm = true;
    this.isEditMode = false;
    this.customerForm.reset();
  }

  onBackToList(){
    this.showForm = false;
    this.isEditMode = false;
    this.customerForm.reset();
  }



}
