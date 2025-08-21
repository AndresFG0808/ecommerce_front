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

username: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * MÉTODO CORREGIDO: logout()
   * 
   * PROBLEMA IDENTIFICADO (17/08/2025):
   * - No se llamaba authService.logout() para limpiar el token
   * - Solo navegaba al login sin limpiar el estado de autenticación
   * - Los usuarios podían volver a acceder usando el botón "atrás"
   * 
   * SOLUCIÓN:
   * - Llamar primero authService.logout() para limpiar tokens
   * - Mostrar confirmación después de la limpieza
   * - El authService.logout() ya incluye la navegación
   */


   



  logout(): void {
    Swal.fire({
      title: "Cerrar sesión",
      text: "¿Estás seguro de cerrar sesión?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        // CORRECCIÓN: Llamar al authService para limpiar tokens y estado
        this.authService.logout();
        
        // Mostrar confirmación de logout exitoso
        Swal.fire({
          title: '¡Sesión cerrada!',
          text: 'Has cerrado sesión correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}
