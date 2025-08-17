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

/**
 * Interfaz que representa la solicitud de creación/actualización de un cliente.
 * Contiene solo los campos necesarios para enviar al microservicio/api.
 */

export interface ClientesRequest {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion?: string;
}
