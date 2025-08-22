import { Injectable } from "@angular/core";
import { environment } from "../environment/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { ProductosRequest, ProductosResponse } from "../models/productos";

/**
 * decorador de Angular que se usa para marcar una clase como inyectable 
 * (es decir, que puede ser utilizada como un servicio a través de la inyección de dependencias).
 */

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio ProductoService que se encarga de interactuar con la API de productos.
 * Proporciona métodos para obtener, registrar, actualizar y eliminar productos.
 */
export class ProductoService {
/**
    * URL base de la API para productos, obtenida del archivo de entorno.
 */
    private apiUrl: string = environment.apiGatewayUrl + '/productos/';
  
    
/**
 * constructor del servicio ProductoService.
 *  http - instancia de HttpClient para realizar peticiones HTTP.
 */
  constructor(private http: HttpClient) {}


  /**
   * Método para obtener la lista de productos desde la API.
   * Utiliza HttpClient para realizar una petición GET a la URL de la API.
   * 
   * @returns Observable que emite un array de ProductosResponse.
   */
  getProductos(): Observable<ProductosResponse[]> {
    return this.http.get<ProductosResponse[]>(this.apiUrl).pipe(
        map(productos => productos.sort()),
        catchError(error => {
            console.error('Error al obtener productos:', error);
            return of([]);
        })
        );  
  }

  /**
   * Método para registrar un nuevo producto en la API.
   * Utiliza HttpClient para realizar una petición POST a la URL de la API.
   * 
   * @param producto - Objeto de tipo ProductosRequest que contiene los datos del producto a registrar.
   * @returns Observable que emite el producto registrado como ProductosResponse.
   */

  postProducto(producto: ProductosRequest): Observable<ProductosResponse> {
    return this.http.post<ProductosResponse>(this.apiUrl, producto).pipe(
        catchError(error => {
            console.error('Error al registrar el producto:', error);
            return throwError(() => error);
        })
    );
  }

  /**
   * Método para actualizar un producto existente en la API.
   * Utiliza HttpClient para realizar una petición PUT a la URL de la API.
   * 
   * @param producto - Objeto de tipo ProductosRequest que contiene los datos del producto a actualizar.
   * @param productoId - ID del producto a actualizar.
   * @returns Observable que emite el producto actualizado como ProductosResponse.
   */

  putProducto(producto: ProductosRequest, productoId: number): Observable<ProductosResponse> {
    return this.http.put<ProductosResponse>(`${this.apiUrl}${productoId}`, producto).pipe(
        catchError(error => {
            console.error('Error al actualizar el producto:', error);
            return throwError(() => error);
        })
    );
  }

  /**
   * Método para eliminar un producto de la API.
   * Utiliza HttpClient para realizar una petición DELETE a la URL de la API.
   * 
   * @param productoId - ID del producto a eliminar.
   * @returns Observable que emite el producto eliminado como ProductosResponse.
   */
  deleteProducto(productoId: number): Observable<ProductosResponse> {
    return this.http.delete<ProductosResponse>(`${this.apiUrl}${productoId}`).pipe(
        catchError(error => {
            console.error('Error al eliminar el producto:', error);
            return throwError(() => error);
        })
    );
  }

}