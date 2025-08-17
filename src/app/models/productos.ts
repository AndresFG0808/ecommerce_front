/**
 * Interfaz que representa la respuesta de la API para los productos.
 * Contiene la información básica que llega de los microservicios/api de un producto.
 * 
 * @property idProductos - ID único del producto generado por la base de datos
 * @property nombre - Nombre del producto (mínimo 20 caracteres)
 * @property descripcion - Descripción detallada del producto (mínimo 20 caracteres)
 * @property precio - Precio del producto (debe ser mayor o igual a 0)
 * @property stock - Cantidad disponible en inventario (debe ser mayor o igual a 0)
 */
export interface ProductosResponse {
    idProductos: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
}

/**
 * Interfaz que representa la petición para crear/actualizar un producto.
 * No incluye el ID ya que este es generado automáticamente por la base de datos.
 * 
 * @property nombre - Nombre del producto (obligatorio, mínimo 20 caracteres)
 * @property descripcion - Descripción del producto (obligatorio, mínimo 20 caracteres)
 * @property precio - Precio del producto (obligatorio, mayor o igual a 0)
 * @property stock - Stock inicial del producto (obligatorio, mayor o igual a 0)
 */
export interface ProductosRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
}
