import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const mensaje =
          err.error?.message ||
          err.error?.response ||
          'Ocurrió un error inesperado.';
        const estatus = err.status;
        switch (estatus) {
          case 400:
            Swal.fire({
              icon: 'error',
              title: 'Solicitud incorrecta',
              text: mensaje,
            });
            // Para errores 400 (validaciones de negocio), no propagamos el error
            return throwError(
              () => new Error('Error manejado por interceptor')
            );
          case 401:
            Swal.fire({
              icon: 'warning',
              title: 'No autorizado',
              text: 'Tu sesión ha expirado o no estas autenticado.',
            });
            break;
          case 403:
            const crud = req.method === 'DELETE' || req.method === 'PUT';
            const mensajeError = crud
              ? 'No tienes permisos para esta accion'
              : 'No tienes acceso a este recurso';
            Swal.fire({
              icon: 'error',
              title: 'Acceso denegado',
              text: mensajeError,
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#e74c3c',
            });

            return throwError(()=> new  Error("Error manejado por el interceptor"))
          case 404:
            Swal.fire({
              icon: 'warning',
              title: 'No autorizado',
              text: 'Tu sesión ha expirado o no estas autenticado.',
            });
            break;
          case 409:
            // Mensaje específico para pedidos pendientes
            const mensajeConflicto =
              mensaje.includes('pedido') || mensaje.includes('pendiente')
                ? mensaje
                : 'Ya existe un conflicto con los datos proporcionados. Por favor, verifica la información.';

            Swal.fire({
              icon: 'warning',
              title: 'Conflicto detectado',
              text: mensajeConflicto,
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#f39c12',
            });
            // Para errores 409 (conflictos de negocio), no propagamos el error
            return throwError(
              () => new Error('Error manejado por interceptor')
            );
          case 500:
            Swal.fire({
              icon: 'error',
              title: 'Error interno del servidor',
              text:
                mensaje ||
                'Se produjo un error interno, por favor intenta más tarde.',
            });
            break;
          case 0:
            Swal.fire({
              icon: 'error',
              title: 'Sin conexión',
              text: 'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.',
            });
            break;
          default:
            Swal.fire({
              icon: 'error',
              title: `Error ${estatus}`,
              text: mensaje,
            });
            break;
        }
        return throwError(() => err);
      })
    );
  }
}
