import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../environment/environment';
import Swal from 'sweetalert2';

/**
 * ==================================================================================
 * HISTORIAL DE CORRECCIONES - AuthService
 * ==================================================================================
 *
 * PROBLEMA REPORTADO (16/08/2025):
 * - Error: "Cannot read properties of undefined" al recargar la página
 * - El error aparecía en logoutDueToExpiration()
 * - Causaba que la aplicación no cargara correctamente después de un refresh
 *
 * CAUSA RAÍZ IDENTIFICADA:
 * 1. Errores de sintaxis en logoutDueToExpiration() (faltaba ; y .then())
 * 2. Inicialización del BehaviorSubject llamaba a hasToken() que ejecutaba efectos secundarios
 * 3. Los efectos secundarios (alertas, navegación) se ejecutaban antes de la inicialización completa
 *
 * SOLUCIONES IMPLEMENTADAS:
 * 1. Crear checkInitialToken() para verificación silenciosa durante inicialización
 * 2. Corregir errores de sintaxis en logoutDueToExpiration()
 * 3. Agregar notificaciones explícitas de cambio de estado en login/logout
 * 4. Mejorar el método logout() para limpieza completa
 *
 * TESTING RECOMENDADO:
 * - Probar recarga de página con token válido y expirado
 * - Verificar que las alertas aparezcan solo cuando corresponde
 * - Confirmar que el estado de autenticación se sincroniza correctamente
 * ==================================================================================
 */

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
  providedIn: 'root',
})
export class AuthService {
  private authUrl: string = environment.authUrl;
  private intervalId: any = null;
  private tokenKey = 'auth-token';
  private payLoad: any | null = null; // Variable para almacenar el payload del token decodificado

  /**
   * PROBLEMA RESUELTO: Error "Cannot read properties of undefined" al recargar página
   *
   * CAUSA DEL ERROR:
   * - Al usar this.hasToken() en la inicialización del BehaviorSubject, se ejecutaba
   *   logoutDueToExpiration() antes de que el servicio estuviera completamente inicializado
   * - Esto causaba errores de referencia undefined cuando Angular intentaba acceder
   *   a propiedades del servicio durante la recarga de página
   *
   * SOLUCIÓN IMPLEMENTADA:
   * - Cambiar la inicialización del BehaviorSubject a 'false' por defecto
   * - Inicializar el estado real en el constructor usando checkInitialToken()
   * - Crear un método separado (checkInitialToken) que no ejecute alertas ni navegación
   *   durante la inicialización del servicio
   */
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    // Inicializar el estado de autenticación al crear el servicio
    // Se usa checkInitialToken() en lugar de hasToken() para evitar efectos secundarios
    const hasValidToken = this.checkInitialToken();
    this.isLoggedInSubject.next(hasValidToken);
    this.decodeToken(); // Decodificar el token al inicializar el servicio

    // Si hay un token válido al inicializar, comenzar el monitoreo de expiración
    if (hasValidToken) {
      this.startTokenExpirationCheck();
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(this.authUrl, { username, password })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            this.decodeToken();
            // ✅ CORRECCIÓN: Notificar cambio de estado y comenzar monitoreo
            this.isLoggedInSubject.next(true);
            this.startTokenExpirationCheck();
          }
        })
      );
  }

  // Obtener el observable del estado de autenticación
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * MÉTODO AGREGADO: checkInitialToken()
   *
   * PROPÓSITO:
   * - Verificar el token durante la inicialización del servicio sin efectos secundarios
   * - Evitar mostrar alertas SweetAlert2 o navegar durante la carga inicial de la aplicación
   *
   * DIFERENCIA CON hasToken():
   * - hasToken() ejecuta logoutDueToExpiration() que muestra alertas y navega
   * - checkInitialToken() solo limpia el localStorage silenciosamente
   * - Se usa únicamente en el constructor para inicialización segura
   */
  private checkInitialToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) return false;

    const now = Date.now();
    if (now > parseInt(expiration)) {
      // Limpiar tokens expirados silenciosamente (sin alertas ni navegación)
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('token_expiration');
      return false;
    }

    return true;
  }

  // Metodo para guardar el token en el localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * MÉTODO MEJORADO: logout()
   *
   * MEJORAS AGREGADAS:
   * 1. Limpiar también 'token_expiration' del localStorage (antes solo limpiaba el token)
   * 2. Detener el monitoreo de expiración del token (stopTokenExpirationCheck)
   * 3. Notificar a los suscriptores que el estado cambió a 'false'
   *
   * PROPÓSITO:
   * - Asegurar una limpieza completa del estado de autenticación
   * - Evitar memory leaks por intervalos que siguen corriendo
   * - Mantener sincronizado el estado en toda la aplicación
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('token_expiration');
    this.stopTokenExpirationCheck();
    this.isLoggedInSubject.next(false);
    this.payLoad = null;
    this.router.navigate(['/login']);
  }

  // Metodo para validar si el token esta vigente o no :
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (e) {
      return true;
    }
  }

  // Detiene el proceso de monitorieo del expiracion
  stopTokenExpirationCheck(): void {
    if (this.intervalId) {
      // Si hay un intervalo en ejecución
      clearInterval(this.intervalId); // Detener el intervalo: El intervalo es el encargado de verificar la expiración del token
      this.intervalId = null; // Limpiar el ID del intervalo
    }
  }

  /**
   * MÉTODO IMPLEMENTADO: startTokenExpirationCheck()
   *
   * PROBLEMA SOLUCIONADO:
   * - El token expiraba pero no se ejecutaba automáticamente logoutDueToExpiration()
   * - No aparecía el SweetAlert de sesión expirada
   * - No redirigía automáticamente al login
   *
   * FUNCIONALIDAD:
   * - Verifica cada 1000ms (1 segundo) si el token ha expirado
   * - Si encuentra que el token expiró, ejecuta logoutDueToExpiration()
   * - Solo se ejecuta si hay un token válido en localStorage
   *
   * CICLO DE VIDA:
   * - Se inicia después de un login exitoso
   * - Se detiene en logout manual o por expiración
   * - Se reinicia en cada nuevo login
   */
  startTokenExpirationCheck(): void {
    // Detener cualquier verificación previa para evitar múltiples intervalos
    this.stopTokenExpirationCheck();

    // Verificar cada segundo si el token ha expirado
    this.intervalId = setInterval(() => {
      const token = this.getToken();
      if (!token) {
        // Si no hay token, detener el monitoreo
        this.stopTokenExpirationCheck();
        return;
      }

      if (this.isTokenExpired()) {
        // Token expirado: ejecutar logout automático con alerta
        this.logoutDueToExpiration();
      }
    }, 1000); // Verificar cada 1 segundo
  }

  /**
   * MÉTODO CORREGIDO: logoutDueToExpiration()
   *
   * ERRORES SOLUCIONADOS:
   * 1. ERROR DE SINTAXIS: Faltaba punto y coma (;) en this.isLoggedInSubject.next(false)
   * 2. ERROR DE SINTAXIS: La llamada a Swal.fire() no tenía .then() para manejar la respuesta
   *
   * PROBLEMA ORIGINAL:
   * - TypeScript arrojaba "Cannot read properties of undefined"
   * - Los errores de sintaxis impedían la compilación correcta
   * - Al recargar la página, el método se ejecutaba antes de la inicialización completa
   *
   * MEJORAS IMPLEMENTADAS:
   * - Agregar .then() a Swal.fire() para navegar después de cerrar la alerta
   * - Corregir la sintaxis para evitar errores de compilación
   * - Asegurar que la navegación solo ocurra después de que el usuario confirme la alerta
   */
  logoutDueToExpiration(): void {
    this.stopTokenExpirationCheck(); // Detener el monitoreo de expiración en caso de cierre de sesión
    localStorage.removeItem(this.tokenKey); // Remover el token de acceso del localStorage
    localStorage.removeItem('token_expiration'); // Remover la expiración del token del localStorage
    this.isLoggedInSubject.next(false); // Notificar a los suscriptores que el usuario ha cerrado sesión

    Swal.fire({
      title: '🔒 Sesión expirada',
      text: 'Tu sesión ha caducado por seguridad. Por favor, inicia sesión nuevamente.',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'De acuerdo',
      allowOutsideClick: false,
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  /**
   * MÉTODO MEJORADO: isAuthenticated()
   *
   * PROBLEMA IDENTIFICADO (17/08/2025):
   * - Las rutas protegidas no funcionaban correctamente
   * - Usuarios podían acceder con links directos sin autenticación
   * - hasToken() ejecutaba efectos secundarios en el guard
   *
   * SOLUCIÓN:
   * - Verificación silenciosa sin efectos secundarios para el guard
   * - Limpieza automática de tokens expirados
   * - Retorno confiable para el AuthGuard
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    if (this.isTokenExpired()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('token_expiration');
      this.isLoggedInSubject.next(false);
      return false;
    }
    
    return true;
  }

  /**
   * MÉTODO PARA VERIFICACIÓN CON ALERTA: hasTokenWithAlert()
   *
   * PROPÓSITO:
   * - Usar cuando queremos mostrar la alerta de expiración
   * - Para verificaciones durante uso activo de la aplicación
   * - Separado de isAuthenticated() para evitar efectos secundarios en el guard
   */
  hasTokenWithAlert(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired()) {
      this.logoutDueToExpiration();
      return false;
    }
    return true;
  }

  /**
   * MÉTODO LEGACY: hasToken() (mantener para compatibilidad)
   *
   * NOTA: Se mantiene para compatibilidad con código existente
   * pero se recomienda usar isAuthenticated() o hasTokenWithAlert()
   */
  hasToken(): boolean {
    return this.isAuthenticated();
  }

  /**
   * MÉTODO DE DEBUG: getAuthStatus() (SOLO PARA DESARROLLO)
   *
   * PROPÓSITO:
   * - Ayudar a diagnosticar problemas de autenticación
   * - Mostrar información detallada del estado actual
   * - Usar en consola para debugging
   *
   * NOTA: Remover en producción
   */
  getAuthStatus(): {
    token: string | null;
    expired: boolean;
    authenticated: boolean;
  } {
    const token = this.getToken();
    const expired = this.isTokenExpired();
    const authenticated = this.isAuthenticated();

    console.log('🔍 AUTH DEBUG:', {
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : null,
      expired: expired,
      authenticated: authenticated,
      expiration: localStorage.getItem('token_expiration'),
    });

    return {
      token: token,
      expired: expired,
      authenticated: authenticated,
    };
  }

  private decodeToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        this.payLoad = JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        this.payLoad = null; // Si hay un error al decodificar, establecer payLoad como null
      }
    } else {
      this.payLoad = null; // Si no hay token, establecer payLoad como null
    }
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null; // Retorna el username del payload o null si no existe
    } catch (e) {
      console.error('Error leyendo username del token:', e);
      return null; // Si hay un error al decodificar, retornar null
    }
  }

  getRoles(): string[] {
    if (!this.payLoad) this.decodeToken(); // Asegurarse de que payLoad esté decodificado
    return this.payLoad?.roles || []; // Si payLoad es null, retornar un array vacío
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((r) => this.getRoles().includes(r));
  }
}