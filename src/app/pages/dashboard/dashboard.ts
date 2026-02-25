import { CommonModule } from '@angular/common';
import { Component, DestroyRef, signal } from '@angular/core';
import { AllServices } from '../../share/all-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Trend = 'up' | 'down' | 'flat';

interface KpiCard {
  title: string;
  value: string;
  delta: string;
  trend: Trend;
  icon: string;
}

interface BookingSnapshot {
  label: string;
  count: number;
  tone: 'active' | 'warning' | 'neutral';
}

interface UpcomingBooking {
  customer: string;
  car: string;
  date: string;
  city: string;
  status: 'Confirmed' | 'Pending' | 'Ready';
}

interface FleetMetric {
  title: string;
  value: string;
  helper: string;
}

interface ActivityItem {
  text: string;
  time: string;
}

interface DashboardBookingRow {
  customerName: string;
  mobileNo: string;
  bookingDate: string;
  brand: string;
  model: string;
  totalBillAmount: string;
  discount: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly kpis: KpiCard[] = [
    { title: 'Total Vehicles', value: '128', delta: '+6 this week', trend: 'up', icon: 'fa-car' },
    { title: 'Active Bookings', value: '46', delta: '+9 today', trend: 'up', icon: 'fa-calendar-check-o' },
    { title: 'Available Cars', value: '72', delta: '-4 vs yesterday', trend: 'down', icon: 'fa-check-circle-o' },
    { title: 'Monthly Revenue', value: '$84,200', delta: '+12.4%', trend: 'up', icon: 'fa-line-chart' }
  ];

  readonly bookingSnapshot: BookingSnapshot[] = [
    { label: 'Today Pickups', count: 14, tone: 'active' },
    { label: 'Today Returns', count: 11, tone: 'neutral' },
    { label: 'Pending Approvals', count: 5, tone: 'warning' },
    { label: 'Late Returns', count: 2, tone: 'warning' }
  ];

  readonly fleetMetrics: FleetMetric[] = [
    { title: 'Fleet Utilization', value: '62%', helper: '80/128 cars on rent' },
    { title: 'Avg Booking Value', value: '$182', helper: 'Current month average' },
    { title: 'Customer Rating', value: '4.7/5', helper: 'From 318 feedback entries' }
  ];

  readonly upcomingBookings: UpcomingBooking[] = [
    { customer: 'Aarav Shah', car: 'Hyundai Creta', date: '26 Feb, 09:30 AM', city: 'Ahmedabad', status: 'Confirmed' },
    { customer: 'Neha Verma', car: 'Kia Seltos', date: '26 Feb, 11:00 AM', city: 'Pune', status: 'Ready' },
    { customer: 'Rohan Iyer', car: 'Maruti Brezza', date: '26 Feb, 01:15 PM', city: 'Bengaluru', status: 'Pending' },
    { customer: 'Ishita Nair', car: 'Toyota Innova', date: '26 Feb, 03:45 PM', city: 'Mumbai', status: 'Confirmed' }
  ];

  readonly activities: ActivityItem[] = [
    { text: 'Booking #BR-2184 confirmed for Hyundai Creta', time: '5 min ago' },
    { text: 'Vehicle MH12AB3021 marked ready for pickup', time: '18 min ago' },
    { text: 'Payment received for Booking #BR-2179', time: '35 min ago' },
    { text: 'New customer profile created by front desk', time: '1 hr ago' }
  ];

  readonly allBookings: DashboardBookingRow[] = [
    { customerName: 'Aarav Shah', mobileNo: '9876543210', bookingDate: '26-02-2026', brand: 'Hyundai', model: 'Creta', totalBillAmount: '$220', discount: '$20' },
    { customerName: 'Neha Verma', mobileNo: '9898989898', bookingDate: '26-02-2026', brand: 'Kia', model: 'Seltos', totalBillAmount: '$198', discount: '$15' },
    { customerName: 'Rohan Iyer', mobileNo: '9811122233', bookingDate: '27-02-2026', brand: 'Maruti', model: 'Brezza', totalBillAmount: '$165', discount: '$10' },
    { customerName: 'Ishita Nair', mobileNo: '9765432109', bookingDate: '27-02-2026', brand: 'Toyota', model: 'Innova', totalBillAmount: '$310', discount: '$25' },
    { customerName: 'Sahil Mehta', mobileNo: '9900011122', bookingDate: '28-02-2026', brand: 'Honda', model: 'City', totalBillAmount: '$185', discount: '$12' },
    { customerName: 'Pooja Rana', mobileNo: '9887766554', bookingDate: '28-02-2026', brand: 'Tata', model: 'Nexon', totalBillAmount: '$172', discount: '$8' }
  ];


  constructor(private allServices: AllServices, private destroyRef: DestroyRef) { }

  ngOnInit() {
    this.getAllBooking();

    setInterval(() => {
      this.getAllBooking();
    }, 15000);
  }

  trackByIndex(index: number): number {
    return index;
  }


  getAllBookingData = signal<any[]>([]);

  getAllBooking() {
    this.allServices.geAllBookings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        console.log(res.data)
        this.getAllBookingData.set(res.data)
      }
    })
  }


}
