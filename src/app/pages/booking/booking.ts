import { CommonModule } from '@angular/common';
import { Component, DestroyRef, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AllServices } from '../../share/all-services';
import { ToastrService } from 'ngx-toastr';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import dayjs, { Dayjs } from "dayjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, ReactiveFormsModule, NgxDaterangepickerBootstrapModule,FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking {

  showForm: boolean = false;
  isEdiMode: boolean = false;
  showDeleteModal: boolean = false;
 searchTerm = '';
 itemPerPage = 10;
  minSelectableDate: Dayjs = dayjs();  // 🔥 ADD THIS

  datePickerLocale = {
    applyLabel: 'OK',
    format: 'DD-MM-YYYY'
  };


  constructor(private allServices: AllServices, private toaster: ToastrService, private destroy : DestroyRef) { }

  ngOnInit() {
    this.geAllBookingsDetails();
    this.GetCarsList();

  }

  GetCarsDetails = signal<any[]>([]);
  GetCarsList() {
    this.allServices.GetCars().pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (res: any) => {
        this.GetCarsDetails.set(res.data);
      }
    })
  }



  bookingForm = new FormGroup({
    CustomerName: new FormControl('', [Validators.required]),
    CustomerCity: new FormControl('', [Validators.required]),
    MobileNo: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required]),
    BookingId: new FormControl(0),
    CarId: new FormControl('', [Validators.required]),
    BookingDate: new FormControl<any>('', [Validators.required]),
    Discount: new FormControl('', [Validators.required]),
    TotalBillAmount: new FormControl('', [Validators.required])
  })

  // bookingResData = signal<any[]>([]);

  submitForm() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    const bookingResData = this.bookingForm.value;
    console.log(bookingResData, 'data res')

    // ✅ Convert date properly
    if (bookingResData.BookingDate?.startDate) {
      bookingResData.BookingDate =
        bookingResData.BookingDate.startDate.format('YYYY-MM-DD');
    }

    console.log('Final Payload:', bookingResData);


    if (!this.isEdiMode) {
      bookingResData.BookingId = 0;
      this.allServices.CreateNewBooking(bookingResData).pipe(takeUntilDestroyed(this.destroy)).subscribe({
        next: (res: any) => {
          console.log(res, 'new enry data res')
          this.toaster.success(res.message || 'Successfully save');
          this.onBackToList();
          this.bookingForm.reset();
          this.geAllBookingsDetails();

        }
      })
    } else {

    }

  }

  detailsRes = signal<any[]>([]);

  geAllBookingsDetails() {

    this.allServices.geAllBookings().pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (res: any) => {
        // this.toaster.success(res.message);
        this.detailsRes.set(res.data);
      }
    })

  }


  editBooking(item: any) {
    this.showForm = true;
    this.isEdiMode = true;
    this.bookingForm.patchValue({
      CustomerName: item.customerName,
      MobileNo: item.mobileNo,
      BookingDate: item.bookingDate,
      Discount: item.discount,
      TotalBillAmount: item.totalBillAmount,
      CarId: item.CarId
    })
  }

  onAddBoking() {
    this.showForm = true;
    this.isEdiMode = false;
  }

  onBackToList() {
    this.showForm = false;
    this.isEdiMode = false;
  }

   selectedBookingId: number | null = null;

  openDeleteModal(bookingId:any) {
  this.showDeleteModal = true;
  this.selectedBookingId = bookingId
  }

  closeDeleteModal(){
 this.showDeleteModal= false;
 this.selectedBookingId = null;
  }

  confirmDeleteStatic(){

    this.allServices.DeletBookingById(this.selectedBookingId).pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next : (res:any)=>{
        this.toaster.success(res.message || 'Delete Successfully');
        this.showDeleteModal=false;
        this.geAllBookingsDetails();
      }
    })

  }

  refresh(){
    this.searchTerm = '';
    this.itemPerPage = 10;
    this.GetCarsDetails();

  }

}
