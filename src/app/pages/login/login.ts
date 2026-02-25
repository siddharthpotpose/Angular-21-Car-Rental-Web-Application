import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private toaster: ToastrService, private route: Router) { }

  ngOnInit() { }


  loginForm = new FormGroup({
    emailid: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { emailid, password } = this.loginForm.value;
    if (emailid === 'admin' && password === 'admin@123') {
      console.log('login')
      sessionStorage.setItem('email',emailid);
      sessionStorage.setItem('pswd',password);
      this.toaster.success('Login Successfull');
      this.route.navigate(['/dashboard'])
    } else {
      console.log('invalid')
      this.toaster.error('Invalid credentials')
    }

  }



}
