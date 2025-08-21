import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import Swal from "sweetalert2";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(req).pipe(
            catchError((err:HttpErrorResponse) => {
                const mensaje = err.error?.message || err.error?.response || 'Ocurrió un error inesperado.';
                const estatus = err.status;
                switch(estatus){
                    case 400:
                        Swal.fire({
                            icon: 'error',
                            title: 'Solicitud incorrecta',
                            text: mensaje,
                        });
                        // Para errores 400 (validaciones de negocio), no propagamos el error
                        return throwError(() => new Error('Error manejado por interceptor'));
                    case 401:
                        Swal.fire({
                            icon: 'warning',
                            title: 'No autorizado',
                            text: 'Tu sesión ha expirado o no estas autenticado.'
                        });
                        break;
                    case 404:
                        Swal.fire({
                            icon: 'warning',
                            title: 'No autorizado',
                            text: 'Tu sesión ha expirado o no estas autenticado.'
                        });
                        break;
                    case 409:
                        Swal.fire({
                            icon: 'error',
                            title: 'Conflicto',
                            text: mensaje
                        });
                        // Para errores 409 (conflictos de negocio), no propagamos el error
                        return throwError(() => new Error('Error manejado por interceptor'));
                    case 500:
                        Swal.fire({
                            icon: 'error',
                            title: 'Error interno del servidor',
                            text: mensaje || 'Se produjo un error interno, por favor intenta más tarde.'
                        });
                        break;
                    case 0:
                        Swal.fire({
                            icon: 'error',
                            title: 'Sin conexión',
                            text: 'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.'
                        });
                        break;
                    default:
                        Swal.fire({
                            icon: 'error',
                            title: `Error ${estatus}`,
                            text: mensaje
                        });
                        break;
                }
                return throwError(() => err);
            })
        );
    }
}