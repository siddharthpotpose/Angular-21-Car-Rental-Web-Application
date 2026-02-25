import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
const loginDetails = sessionStorage.getItem('email') && sessionStorage.getItem('pswd')

  if(loginDetails == null){
    router.navigateByUrl('/login');
    return false;
  }else{
    return true;
  }
};
