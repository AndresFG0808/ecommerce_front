import { Component, OnInit } from '@angular/core';
import { PedidosResponse } from '../../../models/pedidos';
import { ClientesResponse } from '../../../models/clientes';

/**
 * Componente para mostrar los pedidos filtrados por cliente.
 * - Permite seleccionar un cliente específico para ver sus pedidos.
 * - Muestra una tabla filtrada con los pedidos del cliente seleccionado.
 * - Es útil para el seguimiento de pedidos por cliente específico.
 *
 * Este componente se enfoca en la relación entre clientes y sus pedidos,
 * aprovechando la foreign key ID_CLIENTE en la tabla PEDIDOS.
 */
@Component({
  selector: 'app-pedidosclientes',
  standalone: false,
  templateUrl: './pedidosclientes.component.html',
  styleUrl: './pedidosclientes.component.css'
})
export class PedidosclientesComponent implements OnInit {
  
  // Lista completa de clientes disponibles para seleccionar
  clientes: ClientesResponse[] = [
    { id: 1, nombre: 'Luis', apellido: 'Andres', email: 'luis.andres@email.com', telefono: '1234567890' },
    { id: 2, nombre: 'Maria', apellido: 'Gomez', email: 'maria.gomez@email.com', telefono: '0987654321' },
    { id: 3, nombre: 'Carlos', apellido: 'Ruiz', email: 'carlos.ruiz@email.com', telefono: '5555555555' },
    { id: 4, nombre: 'Ana', apellido: 'Torres', email: 'ana.torres@email.com', telefono: '1111111111' }
  ];

  // Cliente actualmente seleccionado (null = mostrar todos)
  selectedClientId: number | null = null;

  // Lista completa de todos los pedidos en el sistema
  pedidos: PedidosResponse[] = [
    {
      idPedidos: 1,
      idCliente: 1,
      total: 17299.49,
      fechaCreacion: new Date('2025-01-15T10:30:00'),
      estado: 'PENDIENTE'
    },
    {
      idPedidos: 2,
      idCliente: 2,
      total: 4798.50,
      fechaCreacion: new Date('2025-01-14T15:45:00'),
      estado: 'ENVIADO'
    },
    {
      idPedidos: 3,
      idCliente: 3,
      total: 8999.99,
      fechaCreacion: new Date('2025-01-13T09:15:00'),
      estado: 'ENTREGADO'
    },
    {
      idPedidos: 4,
      idCliente: 1,
      total: 1299.50,
      fechaCreacion: new Date('2025-01-12T16:20:00'),
      estado: 'CANCELADO'
    },
    {
      idPedidos: 5,
      idCliente: 2,
      total: 2599.00,
      fechaCreacion: new Date('2025-01-11T14:15:00'),
      estado: 'ENTREGADO'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Inicialización del componente
  }

  /**
   * Getter que retorna los pedidos filtrados según el cliente seleccionado.
   * Si no hay cliente seleccionado, retorna todos los pedidos.
   * @returns Array de pedidos filtrados
   */
  get filteredPedidos(): PedidosResponse[] {
    if (!this.selectedClientId) return this.pedidos;
    return this.pedidos.filter(p => p.idCliente === this.selectedClientId);
  }

  /**
   * Obtiene el nombre completo del cliente por su ID.
   * @param idCliente ID del cliente a buscar
   * @returns Nombre completo del cliente o ID si no se encuentra
   */
  obtenerNombreCliente(idCliente: number): string {
    const cliente = this.clientes.find(c => c.id === idCliente);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : `Cliente #${idCliente}`;
  }

  /**
   * Formatea la fecha para mostrar en formato legible.
   * @param fecha Fecha a formatear
   * @returns String con fecha formateada
   */
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Formatea el precio para mostrar como moneda mexicana.
   * @param precio Precio a formatear
   * @returns String con precio formateado
   */
  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 2 
    });
  }

  /**
   * Obtiene la clase CSS para el badge del estado.
   * @param estado Estado del pedido
   * @returns Clase CSS para el badge
   */
  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'badge bg-warning text-dark';
      case 'ENVIADO': return 'badge bg-info';
      case 'ENTREGADO': return 'badge bg-success';
      case 'CANCELADO': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  /**
   * Calcula el total de pedidos para el cliente seleccionado.
   * @returns Suma total de los pedidos filtrados
   */
  calcularTotalPedidos(): number {
    return this.filteredPedidos.reduce((total, pedido) => total + pedido.total, 0);
  }

  /**
   * Cuenta cuántos pedidos tiene cada estado para el cliente seleccionado.
   * @param estado Estado a contar
   * @returns Número de pedidos con ese estado
   */
  contarPedidosPorEstado(estado: string): number {
    return this.filteredPedidos.filter(p => p.estado === estado).length;
  }
}
