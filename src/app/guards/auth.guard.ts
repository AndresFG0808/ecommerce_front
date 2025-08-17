import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * ==================================================================================
 * AUTHGUARD MEJORADO - Protección de Rutas
 * ==================================================================================
 * 
 * PROBLEMA REPORTADO (17/08/2025):
 * - Las rutas protegidas no funcionaban correctamente
 * - Usuarios podían acceder con links directos sin autenticación
 * - No se redirigía al login cuando el token expiraba
 * - No se limpiaba el token al cerrar sesión
 * 
 * MEJORAS IMPLEMENTADAS:
 * - Verificación robusta de autenticación
 * - Manejo silencioso de tokens expirados
 * - Redirección confiable al login
 * - Limpieza automática de estado
 * ==================================================================================
 */

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    /**
     * MÉTODO MEJORADO: canActivate()
     * 
     * FUNCIONALIDAD:
     * - Verifica autenticación sin efectos secundarios
     * - Redirige silenciosamente al login si no está autenticado
     * - Maneja tokens expirados de forma transparente
     * 
     * @returns {boolean} true si puede activar la ruta, false si debe redirigir
     */
    canActivate(): boolean {
        // Verificar autenticación usando método sin efectos secundarios
        if (this.authService.isAuthenticated()) {
            return true;
        } else {
            // Redirigir al login si no está autenticado
            console.log('🔒 AuthGuard: Usuario no autenticado, redirigiendo al login');
            this.router.navigate(['/login']);
            return false;
        }
    }
}