import { Component, OnInit } from '@angular/core';
import { PedidosResponse } from '../../../models/pedidos';
import { ClientesResponse } from '../../../models/clientes';

import { ClientesService } from '../../../services/clientes.service';
import { PedidosService } from '../../../services/pedidos.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

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
  styleUrl: './pedidosclientes.component.css',
})
export class PedidosclientesComponent implements OnInit {
  // Lista completa de clientes disponibles para seleccionar (Ahora se llena desde el back)
  clientes: ClientesResponse[] = [];
  pedidos: PedidosResponse [] = [];

  // Cliente actualmente seleccionado (null = mostrar todos)
  selectedClientId: number | null = null;

  constructor(private clientesService: ClientesService, private pedidosService: PedidosService) {}

  ngOnInit(): void {
    //Carga los datos del cliente desde el back
    this.cargarClientes();
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidosService.getPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos
      }, 
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar clientes',
          text:
            err?.error?.message ||
            'No se pudieron obtener los clientes del servidor',
          confirmButtonText: 'Entendido',
        });
      }
    })

    
  }

  cargarClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar clientes',
          text:
            err?.error?.message ||
            'No se pudieron obtener los clientes del servidor',
          confirmButtonText: 'Entendido',
        });
      },
    });
  }

  /**
   * Getter que retorna los pedidos filtrados según el cliente seleccionado.
   * Si no hay cliente seleccionado, retorna todos los pedidos.
   * @returns Array de pedidos filtrados
   */
  get filteredPedidos(): PedidosResponse[] {
    if (!this.selectedClientId) return this.pedidos;
    return this.pedidos.filter((p) => p.idCliente === this.selectedClientId);
  }

  /**
   * Obtiene el nombre completo del cliente por su ID.
   * @param idCliente ID del cliente a buscar
   * @returns Nombre completo del cliente o ID si no se encuentra
   */
  obtenerNombreCliente(idCliente: number): string {
    const cliente = this.clientes.find((c) => c.id === idCliente);
    return cliente
      ? `${cliente.nombre} ${cliente.apellido}`
      : `Cliente #${idCliente}`;
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
      day: 'numeric',
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
      minimumFractionDigits: 2,
    });
  }

  /**
   * Obtiene la clase CSS para el badge del estado.
   * @param estado Estado del pedido
   * @returns Clase CSS para el badge
   */
  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'badge bg-warning text-dark';
      case 'ENVIADO':
        return 'badge bg-info';
      case 'ENTREGADO':
        return 'badge bg-success';
      case 'CANCELADO':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  /**
   * Calcula el total de pedidos para el cliente seleccionado.
   * @returns Suma total de los pedidos filtrados
   */
  calcularTotalPedidos(): number {
    return this.filteredPedidos.reduce(
      (total, pedido) => total + pedido.total,
      0
    );
  }

  /**
   * Cuenta cuántos pedidos tiene cada estado para el cliente seleccionado.
   * @param estado Estado a contar
   * @returns Número de pedidos con ese estado
   */
  contarPedidosPorEstado(estado: string): number {
    return this.filteredPedidos.filter((p) => p.estado === estado).length;
  }
}
