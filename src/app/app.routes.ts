import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Vehicles } from './pages/vehicles/vehicles';
import { Customer } from './pages/customer/customer';
import { Booking } from './pages/booking/booking';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo : 'login',
        pathMatch : 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path : '',
        component: Layout,
        children:[
            {
                path : 'dashboard',
                component: Dashboard,
                canActivate : [authGuard]
            },
            {
                path: 'vehicles',
                component: Vehicles,
                canActivate: [authGuard]
            },
            {
                path : 'customers',
                component: Customer,
                canActivate: [authGuard]
            },
            {
                path: 'booking',
                component: Booking,
                canActivate: [authGuard]
            }
        ]
    }
];
