import { CommonModule } from '@angular/common';
import { Component, DestroyRef, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AllServices } from '../../share/all-services';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-customer',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer {



  customerDataRes = signal<any[]>([]);
  showForm: Boolean = false;
  isEditMode: Boolean = false;
  showDeleteModel: boolean = false;
  selectCustomerId: number | null = null;
  showDeleteModal: boolean = false;
  isTableLoading: boolean = false;
  searchTerm = '';
  itemPerPage = 10;

  constructor(private toaster: ToastrService, private allServices: AllServices, private destroy : DestroyRef) { }

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

    const customerPayload = this.customerForm.value;
    console.log('res', customerPayload)

    if (this.isEditMode) {

      this.allServices.UpdateCustomer(customerPayload).pipe(takeUntilDestroyed(this.destroy)).subscribe({
        next: (res: any) => {
          this.toaster.success('customer updated successfully');
          this.onBackToList();
          this.customerForm.reset();
          this.GetCustomersDetails();
        }
      })

    } else {
      customerPayload.CustomerId = 0;
      this.allServices.CreateNewCustomer(customerPayload).pipe(takeUntilDestroyed(this.destroy)).subscribe({
        next: (res: any) => {
          this.toaster.success('customer added successfully');
          this.onBackToList();
          this.customerForm.reset();
          this.GetCustomersDetails();
        }
      })
    }


  }



  GetCustomersDetails() {
    this.isTableLoading = true;
    this.allServices.GetCustomers().pipe(
      finalize(() => {
        this.isTableLoading = false;
      })
    ).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (res: any) => {
        const rows = Array.isArray(res?.data) ? res.data : [];
        this.customerDataRes.set(rows);
      }, error: (err) => {
        this.customerDataRes.set([]);
        this.toaster.error('error while fetching customer details')
      }
    })
  }

  editCustomer(item: any) {
    this.showForm = true;
    this.isEditMode = true;
    this.customerForm.patchValue({
      CustomerId: item.customerId,
      CustomerName: item.customerName,
      CustomerCity: item.customerCity,
      MobileNo: item.mobileNo,
      Email: item.email
    })

  }

  openDeleteModal(customerId: number) {
    this.showDeleteModal = true;
    this.selectCustomerId = customerId;
  }


  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectCustomerId = null;
  }

  confirmDeleteStatic() {
    if (this.selectCustomerId === null) {
      this.toaster.error('invalid customer id');
      return;
    }
    this.allServices.DeleteCustomerById(this.selectCustomerId).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (res: any) => {
        console.log('selectCustomerId  deleted', res)
        this.toaster.success('customer deleted successfully')
        this.closeDeleteModal();
        this.GetCustomersDetails();
      }, error: (err: any) => {
        this.toaster.error('error while deleteing customer')
      }
    })

  }


  onAddCustomer() {
    this.showForm = true;
    this.isEditMode = false;
    this.customerForm.reset();
  }

  onBackToList() {
    this.showForm = false;
    this.isEditMode = false;
    this.customerForm.reset();
  }

  refresh(){
    this.searchTerm = '';
    this.itemPerPage=10;
    this.GetCustomersDetails();
  }


}
