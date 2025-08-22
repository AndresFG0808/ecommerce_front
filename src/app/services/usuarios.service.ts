import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRequest, AuthResponse } from '../models/usuarios';



@Injectable({
  providedIn: 'root'
})


export class UsuariosService {

    private apiUrl: string = environment.authCreateUser;

     constructor(private http: HttpClient) { }


    getUsuarios(): Observable<AuthResponse[]> {
                return this.http.get<AuthResponse[]>(this.apiUrl);
    };

    crearUsuario(usuaio: AuthRequest) : Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.apiUrl, usuaio);
    }

    eliminarUsuario(userName: string) : Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userName}`)
    }




}