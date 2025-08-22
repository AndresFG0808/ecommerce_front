import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { ClientesRequest, ClientesResponse } from '../models/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = `${environment.apiGatewayUrl}/clientes`; // API Gateway URL

  constructor(private http: HttpClient) { }

  getClientes(): Observable<ClientesResponse[]> {
    return this.http.get<ClientesResponse[]>(this.apiUrl);
  }

  getCliente(id: number): Observable<ClientesResponse> {
    return this.http.get<ClientesResponse>(`${this.apiUrl}/${id}`);
  }

  crearCliente(cliente: ClientesRequest): Observable<ClientesResponse> {
    return this.http.post<ClientesResponse>(this.apiUrl, cliente);
  }

  actualizarCliente(id: number, cliente: ClientesRequest): Observable<ClientesResponse> {
    return this.http.put<ClientesResponse>(`${this.apiUrl}/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<ClientesResponse> {
    return this.http.delete<ClientesResponse>(`${this.apiUrl}/${id}`);
  }
}
