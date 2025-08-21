import { Component, OnInit } from '@angular/core';
import { PedidosRequest, PedidosResponse } from '../../../models/pedidos';
import { ClientesResponse } from '../../../models/clientes';
import Swal from 'sweetalert2';
import { PedidosService } from '../../../services/pedidos.service';
import { Router } from '@angular/router';

/**
 * Componente para gestionar la información de los pedidos.
 * - Lista pedidos en una tabla con información de clientes y estados.
 * - Permite crear, editar estado, eliminar y ver detalles de pedidos.
 * - Muestra relación con clientes mediante foreign key.
 *
 * Los comentarios dentro del código explican por qué y cómo se usan
 * las propiedades y métodos más relevantes para facilitar mantenimiento.
 */
@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {
   pedidos: PedidosResponse[] = [];
    isLoading = true;

    constructor(private pedidosService: PedidosService, private router: Router) {}

  ngOnInit(): void {
    this.pedidosService.getPedidos().subscribe({
      next: (data) => {
        console.log("data", data)
        this.pedidos = data;
        this.isLoading = false;
      },
      error: (error) => {
          console.error('Error: ', error);
            this.isLoading = false;
      }
    })
  }

   verDetalles(pedido: PedidosResponse) {
    // Navega pasando el objeto completo por state
    localStorage.setItem('pedidoDetalles', JSON.stringify(pedido));
    this.router.navigate(['/dashboard/pedidos/detalles'], { state: { pedido } });
  }


  /* 
  <div *ngIf="error" class="alert alert-danger">
    {{ error }}
  </div>



   this.movimientoService.getMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;

        this.tipoService.getTipos().subscribe({
          next: (data) => {
            this.tipos = data;
            this.getPokemon();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al cargar tarjetas', err);
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar tarjetas', err);
        this.loading = false;
      },
    });
  
  */


  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 2 
    });
  }

  
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  
  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bg-warning text-dark';
      case 'ENVIADO': return 'bg-info';
      case 'ENTREGADO': return 'bg-success';
      case 'CANCELADO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  
  obtenerIconoEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bi-clock';
      case 'ENVIADO': return 'bi-truck';
      case 'ENTREGADO': return 'bi-check-circle';
      case 'CANCELADO': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }



  
}


/* 




// Array con los pedidos que se muestran en la tabla.
  // Tipo PedidosResponse porque los objetos incluyen el ID generado.
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
    }
  ];

  // Lista de clientes para mostrar nombres en lugar de IDs
  // En producción esto vendría de un servicio de clientes
  clientes: ClientesResponse[] = [
    { id: 1, nombre: 'Luis', apellido: 'Andres', email: 'luis.andres@email.com', telefono: '1234567890' },
    { id: 2, nombre: 'Maria', apellido: 'Gomez', email: 'maria.gomez@email.com', telefono: '0987654321' },
    { id: 3, nombre: 'Carlos', apellido: 'Ruiz', email: 'carlos.ruiz@email.com', telefono: '5555555555' },
    { id: 4, nombre: 'Ana', apellido: 'Torres', email: 'ana.torres@email.com', telefono: '1111111111' }
  ];

  // Estados posibles para un pedido (según constraint de BD)
  estadosPedido: ('PENDIENTE' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO')[] = 
    ['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

  // Indicador para mostrar un spinner mientras se cargan datos
  isLoading = false;

  // Mensaje de error general (si ocurre algún fallo al cargar/guardar)
  error = '';

  // Modelo que representa los campos que se envían al servidor
  // (sin ID). Usamos PedidosRequest para separar Request/Response.
  nuevoPedido: PedidosRequest = {
    idCliente: 0,
    total: 0,
    fechaCreacion: new Date(),
    estado: 'PENDIENTE'
  };

  // Estado para indicar si el formulario está en modo edición
  editandoPedido = false;

  // ID del pedido que se está editando (0 = no hay edición)
  pedidoEditandoId = 0;

  
  constructor() {}

  
  ngOnInit(): void {
    this.cargarPedidos();
  }

  
  cargarPedidos(): void {
    this.isLoading = true;
    // Simulación: pequeña espera para imitar petición al servidor
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  
  validarFormularioPedido(): { valido: boolean; error?: string } {
    const p = this.nuevoPedido;

    if (!p.idCliente || p.idCliente <= 0) return { valido: false, error: 'Debe seleccionar un cliente' };
    
    const clienteExiste = this.clientes.some(c => c.id === p.idCliente);
    if (!clienteExiste) return { valido: false, error: 'El cliente seleccionado no existe' };

    if (p.total === null || p.total === undefined) return { valido: false, error: 'El total es obligatorio' };
    if (p.total < 0) return { valido: false, error: 'El total debe ser mayor o igual a 0' };

    if (!p.estado) return { valido: false, error: 'Debe seleccionar un estado' };
    if (!this.estadosPedido.includes(p.estado)) return { valido: false, error: 'Estado no válido' };

    if (!p.fechaCreacion) return { valido: false, error: 'La fecha de creación es obligatoria' };

    return { valido: true };
  }

  
  registrarPedido(): void {
    const valid = this.validarFormularioPedido();
    if (!valid.valido) {
      Swal.fire({ title: 'Error de validación', text: valid.error, icon: 'warning', confirmButtonColor: '#3085d6', confirmButtonText: 'Entendido' });
      return;
    }

    if (this.editandoPedido) {
      const actualizado: PedidosResponse = {
        idPedidos: this.pedidoEditandoId,
        idCliente: this.nuevoPedido.idCliente,
        total: this.nuevoPedido.total || 0,
        fechaCreacion: this.nuevoPedido.fechaCreacion,
        estado: this.nuevoPedido.estado
      };
      const idx = this.pedidos.findIndex(p => p.idPedidos === this.pedidoEditandoId);
      if (idx !== -1) this.pedidos[idx] = actualizado;

      this.cerrarModal();
      this.limpiarFormulario();

      Swal.fire({ title: '¡Éxito!', text: 'Pedido actualizado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
    } else {
      const nextId = this.pedidos.length ? Math.max(...this.pedidos.map(p => p.idPedidos)) + 1 : 1;
      const nuevo: PedidosResponse = {
        idPedidos: nextId,
        idCliente: this.nuevoPedido.idCliente,
        total: this.nuevoPedido.total || 0,
        fechaCreacion: this.nuevoPedido.fechaCreacion,
        estado: this.nuevoPedido.estado
      };
      this.pedidos.push(nuevo);

      this.cerrarModal();
      this.limpiarFormulario();

      Swal.fire({ title: '¡Éxito!', text: 'Pedido registrado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  }

  
  editarPedido(pedido: PedidosResponse): void {
    this.editandoPedido = true;
    this.pedidoEditandoId = pedido.idPedidos;
    this.nuevoPedido = {
      idCliente: pedido.idCliente,
      total: pedido.total,
      fechaCreacion: pedido.fechaCreacion,
      estado: pedido.estado
    };
    this.abrirModal();
  }

  
  eliminarPedido(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el pedido permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.pedidos = this.pedidos.filter(p => p.idPedidos !== id);
        Swal.fire({ title: 'Eliminado', text: 'Pedido eliminado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    });
  }

  
  verDetalles(pedido: PedidosResponse): void {
    const cliente = this.obtenerNombreCliente(pedido.idCliente);
    Swal.fire({
      title: `Pedido #${pedido.idPedidos}`,
      html: `
        <div class="text-start">
          <p><strong>Cliente:</strong> ${cliente}</p>
          <p><strong>Total:</strong> ${this.formatearPrecio(pedido.total)}</p>
          <p><strong>Fecha:</strong> ${this.formatearFecha(pedido.fechaCreacion)}</p>
          <p><strong>Estado:</strong> <span class="badge ${this.obtenerClaseEstado(pedido.estado)}">${pedido.estado}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar'
    });
  }

  
  limpiarFormulario(): void {
    this.nuevoPedido = { idCliente: 0, total: 0, fechaCreacion: new Date(), estado: 'PENDIENTE' };
    this.editandoPedido = false;
    this.pedidoEditandoId = 0;
  }

  
  abrirModal(): void {
    const modal = document.getElementById('modalNuevoPedido');
    if (modal) (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  
  cerrarModal(): void {
    const modal = document.getElementById('modalNuevoPedido');
    if (modal) (window as any).bootstrap.Modal.getOrCreateInstance(modal).hide();
  }

  
  onModalHidden(): void {
    if (!this.editandoPedido) this.limpiarFormulario();
  }

  
  obtenerNombreCliente(idCliente: number): string {
    const cliente = this.clientes.find(c => c.id === idCliente);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : `Cliente #${idCliente}`;
  }

  
  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 2 
    });
  }

  
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  
  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bg-warning text-dark';
      case 'ENVIADO': return 'bg-info';
      case 'ENTREGADO': return 'bg-success';
      case 'CANCELADO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  
  obtenerIconoEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bi-clock';
      case 'ENVIADO': return 'bi-truck';
      case 'ENTREGADO': return 'bi-check-circle';
      case 'CANCELADO': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  }


*/
