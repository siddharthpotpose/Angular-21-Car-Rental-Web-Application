import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { carModel } from '../../share/api-requestbody';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AllServices } from '../../share/all-services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicles',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css',
})
export class Vehicles {
  showForm = false;
  isEditMode = false;
  showDeleteModal = false;

  carObj = new carModel();
  carDetailsRes = signal<any[]>([]);
  constructor(private allServices: AllServices, private toaster: ToastrService) { }

  ngOnInit() {
    this.carDetails();
  }


  vehicleForm = new FormGroup({
    CarId: new FormControl(0),
    Brand: new FormControl('', Validators.required),
    Model: new FormControl('', Validators.required),
    Year: new FormControl('', Validators.required),
    Color: new FormControl('', Validators.required),
    DailyRate: new FormControl('', Validators.required),
    CarImage: new FormControl('', Validators.required),
    RegNo: new FormControl('', Validators.required)
  })

  submitForm() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    const vehicleData = this.vehicleForm.value;

    if (this.isEditMode) {
      // update
      console.log('Vehicle Data:', vehicleData);
      this.allServices.UpdateCar(vehicleData).subscribe({
        next: (res: any) => {
          this.toaster.success('vehicle updated successfully');
          this.onBackToList();
          this.vehicleForm.reset();
          this.carDetails();
        }
      })

    } else {
      // new entry
      vehicleData.CarId = 0;
      this.allServices.createNewCar(vehicleData).subscribe({
        next: (res: any) => {
          console.log('Vehicle created successfully:', res);
          this.toaster.success('Vehicle Created Successfully');
          this.onBackToList();
          this.vehicleForm.reset();
          this.carDetails();
        },
        error: (err: any) => {
          console.error('Error creating vehicle:', err);
          this.toaster.error('Error Creating Vehicle');
        }
      })

    }

  }

  carDetails() {
    this.allServices.GetCars().subscribe({
      next: (res: any) => {
        console.log('car details', res.data);
        this.carDetailsRes.set(res.data);
        console.log('car details res', this.carDetailsRes);
      }
    })
  }

  editVehicle(item: any) {
    this.isEditMode = true;
    this.showForm = true;
    this.vehicleForm.patchValue({
      CarId: item.carId,
      Brand: item.brand,
      Model: item.model,
      Year: item.year,
      Color: item.color,
      DailyRate: item.dailyRate,
      CarImage: item.carImage,
      RegNo: item.regNo
    })
  }


  onAddVehicle(): void {
    this.isEditMode = false;
    this.vehicleForm.reset();
    this.showForm = true;
  }

  onBackToList(): void {
    this.showForm = false;
    this.isEditMode = false;
  }

  onEditVehicle(): void {
    this.showForm = true;
  }

  selectedCarId: number | null = null;
  openDeleteModal(carId: number): void {
    this.showDeleteModal = true;
    this.selectedCarId = carId;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedCarId = null;
  }

  confirmDeleteStatic(): void {
    if (this.selectedCarId === null) {
      this.toaster.error('Invalid car id for delete');
      return;
    }

    this.allServices.DeleteCarbyCarId(this.selectedCarId).subscribe({
      next:(res:any)=>{
        console.log('car deleted', res)
        this.toaster.success('car deleted successfully')
        this.carDetails();
        this.closeDeleteModal();
      },
      error: () => {
        this.toaster.error('Error deleting car');
      }
    })
  }
}
