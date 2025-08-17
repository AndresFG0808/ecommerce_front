/**
 * Interfaz que representa la respuesta de la API para los clientes.
 * Contiene la información básica que llega de los microservicios/api de un cliente.
 */

export interface ClientesResponse {
    idClientes: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion?: string;
}



export interface ClientesRequest {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion?: string;
}
