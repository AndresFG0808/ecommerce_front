// Producto dentro del request
export interface ProductoRequest {
  idProducto: number;
  precio: number;
  cantidad: number;
  stock: number,
  nombre: string
}

// Producto dentro del response
export interface ProductoResponse {
  id: number;
  precio: number;
  cantidad: number;
  nombre: string;
  descripcion: string;
}

// Request completo
export interface PedidosRequest {
  idCliente: number;
  fechaCreacion: string; // formato "yyyy-MM-dd"
  estado: 'PENDIENTE' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  productos: ProductoRequest[];
}

// Response completo
export interface PedidosResponse {
  idPedidos: number;
  idCliente: number;
  cliente: string;
  total: number;
  fechaCreacion: string; // ISO Date con zona horaria
  estado: 'PENDIENTE' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  productos: ProductoResponse[];
}

