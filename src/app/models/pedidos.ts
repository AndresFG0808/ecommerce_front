/**
 * Interfaz que representa la respuesta de la API para los pedidos.
 * Contiene la información básica que llega de los microservicios/api de un pedido.
 * 
 * @property idPedidos - ID único del pedido generado por la base de datos
 * @property idCliente - ID del cliente que realizó el pedido (foreign key)
 * @property total - Monto total del pedido (calculado automáticamente)
 * @property fechaCreacion - Fecha y hora cuando se creó el pedido
 * @property estado - Estado actual del pedido (PENDIENTE, ENVIADO, ENTREGADO, CANCELADO)
 */
export interface PedidosResponse {
    idPedidos: number;
    idCliente: number;
    total: number;
    fechaCreacion: Date;
    estado: 'PENDIENTE' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
}

/**
 * Interfaz que representa la petición para crear/actualizar un pedido.
 * No incluye el ID ya que este es generado automáticamente por la base de datos.
 * 
 * @property idCliente - ID del cliente que realiza el pedido (obligatorio)
 * @property total - Monto total del pedido (por defecto 0, se calcula automáticamente)
 * @property fechaCreacion - Fecha de creación del pedido
 * @property estado - Estado inicial del pedido (por defecto 'PENDIENTE')
 */
export interface PedidosRequest {
    idCliente: number;
    total?: number;
    fechaCreacion: Date;
    estado: 'PENDIENTE' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
}
