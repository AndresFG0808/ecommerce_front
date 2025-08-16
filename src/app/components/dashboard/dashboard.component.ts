import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    Swal.fire({
      title: "Cerrar sesion",
      text: "¿Estas seguro de cerrar sesion?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar sesion',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        this.router.navigate(['/login'])
        Swal.fire({
          title: 'Sesion cerrada!',
          text: 'Haz cerrado sesion correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }
    });
  }
}
