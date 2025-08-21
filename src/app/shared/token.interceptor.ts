import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
/**
 * Interceptor de HTTP que permite modificar las solicitudes salientes.
 * 
 * Esta clase implementa la interfaz `HttpInterceptor` y se utiliza para interceptar
 * y manipular las solicitudes HTTP antes de que sean enviadas al servidor.
 * 
 * Usualmente, este interceptor se emplea para agregar un token de autenticación
 * (por ejemplo, JWT) en los encabezados de las solicitudes, permitiendo así
 * que el backend valide la identidad del usuario.
 * 
 * @see HttpInterceptor
 * @see Injectable En el contexto de un interceptor, `@Injectable()` permite que Angular cree y gestione instancias de la clase,
 * asegurando que pueda ser utilizada en la cadena de interceptores HTTP.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
    
    console.log('🔍 TokenInterceptor - URL:', req.url);
    console.log('🔍 TokenInterceptor - Token presente:', !!token);
    
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ TokenInterceptor - Token agregado al header');
      return next.handle(cloned);
    }
    
    console.log('❌ TokenInterceptor - No hay token disponible');
    return next.handle(req);
  }
}