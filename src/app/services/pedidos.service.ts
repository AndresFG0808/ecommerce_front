import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidosRequest, PedidosResponse } from '../models/pedidos';



@Injectable({
  providedIn: 'root'
})

export class PedidosService {
      private apiUrl = `${environment.apiGatewayUrl}/pedidos`;
       constructor(private http: HttpClient) { }

       getPedidos(): Observable<PedidosResponse[]> {
           return this.http.get<PedidosResponse[]>(this.apiUrl);
         }
       
         getCliente(id: number): Observable<any> {
           return this.http.get(`${this.apiUrl}/${id}`);
         }
       
         crearPedido(cliente: PedidosRequest): Observable<PedidosResponse> {
           return this.http.post<PedidosResponse>(this.apiUrl, cliente);
         }

         cambiarEstado(id: number, estado: string): Observable<PedidosResponse> {
           return this.http.patch<PedidosResponse>(`${this.apiUrl}/estado/${estado}/${id}`, null,);
         }
       
         
       
         eliminarCliente(id: number): Observable<any> {
           return this.http.delete(`${this.apiUrl}/${id}`);
         }
       
    


}

