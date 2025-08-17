import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../environment/environment';
import Swal from 'sweetalert2';

/**
 * Que son las subscripciones en este servicio?:
 * 
 * Las subscripciones en este servicio permiten a los componentes de la aplicación reaccionar a cambios 
 * en el estado de autenticación del usuario. 
 * 
 * Por ejemplo, cuando un usuario inicia o cierra sesión, los componentes pueden suscribirse a los cambios 
 * en el estado de `isLoggedInSubject` para actualizar su interfaz de usuario en consecuencia.
 * Esto en el login sirve para que, al iniciar sesión, los componentes que dependen de la autenticación
 * del usuario (como el componente de perfil) puedan reaccionar y mostrar la información adecuada.
 * 
 */

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly TOKEN_KEY = 'acces_token'
  private intervalId: any;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken())

  constructor(private http: HttpClient, private router: Router) {}

  // metodo que llama a el servicio. Nos suscribimos al resultado ya que el metodo retornara un Observable.
  login(credentials: LoginRequest): Observable<boolean> {


    if (credentials.username === environment.authUser && credentials.password === environment.authPassword) {
      //Guardar el token de prueba en el localStorage:
      localStorage.setItem(this.TOKEN_KEY, environment.testToken);

      //Simular un tiempo de expiracion del token:
      // A quien le toke confugurar el token, favor de poner la condicional de si el token ya viene con tiempo
      // de expiracion desde el back:
      const expiration = Date.now() + (15 * 1000); // solo para simular
      localStorage.setItem('token_expiration', expiration.toString());
      return of(true);
    }else {
      return of(false);
    }
  };

  // Metodo para guardar el token en el localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  //Metodo para remover el token de localStorage
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    this.router.navigate(['/login']);
  }

  // Metodo para validar si el token esta vigente o no :
  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) return true;
    return Date.now() > Number(expiration);
  }

  // Detiene el proceso de monitorieo del expiracion
  stopTokenExpirationCheck(): void {
    if (this.intervalId) { // Si hay un intervalo en ejecución
      clearInterval(this.intervalId); // Detener el intervalo: El intervalo es el encargado de verificar la expiración del token
      this.intervalId = null; // Limpiar el ID del intervalo
    }
  }

  // Metodo para cerrar sesión debido a la expiración del token
  logoutDueToExpiration(): void {
    this.stopTokenExpirationCheck(); // Detener el monitoreo de expiración en caso de cierre de sesión
    localStorage.removeItem(this.TOKEN_KEY);// Remover el token de acceso del localStorage
    localStorage.removeItem('token_expiration'); // Remover la expiración del token del localStorage
    this.isLoggedInSubject.next(false) // Notificar a los suscriptores que el usuario ha cerrado sesión

    Swal.fire({
      title: "🔒 Sesión expirada",
      text: "Tu sesión ha caducado por seguridad. Por favor, inicia sesión nuevamente.",
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'De acuerdo',
      allowOutsideClick: false
    })
  }

  // verifica si el usuario tiene un token válido y vigente en el localStorage.
  hasToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired()) {
      this.logoutDueToExpiration();
      return false;
    }
    return true;
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.hasToken() && !this.isTokenExpired();
  }
}
