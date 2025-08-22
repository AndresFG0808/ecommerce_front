import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../environment/environment';
import { LoginRequest } from '../../models/login-request';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;
  private routerSubscription: Subscription = new Subscription(); // Para cerrar una sesion que nunca se cancela.

  constructor(private router: Router, private authService: AuthService) {} // Dar acceso restringido solo a este componente
  ngOnInit(): void {
    // Limpiar cualquier sesión previa al cargar el componente
    this.authService.logout();
  }

  onLogin() {
    this.authService.logout();
    // Metodo que se ejecutara al dar clic en el boton de inciar
    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if(success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Credenciales incorrectas'
        }
      },
      error: () => {
        this.error = 'Error de conexion'
      }
    })

  }
}
