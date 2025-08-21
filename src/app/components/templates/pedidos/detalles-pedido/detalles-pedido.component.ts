import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosResponse } from '../../../../models/pedidos';

@Component({
  selector: 'app-detalles-pedido',
  standalone: false,
  templateUrl: './detalles-pedido.component.html',
  styleUrl: './detalles-pedido.component.css',
})
export class DetallesPedidoComponent {
  pedido: PedidosResponse;

  constructor(private router: Router) {
    // Recupera el objeto enviado por state
    this.pedido = this.router.getCurrentNavigation()?.extras.state?.['pedido'];
    if (!this.pedido) {
      const pedidoGuardado = localStorage.getItem('pedidoDetalles');
      if (pedidoGuardado) {
        this.pedido = JSON.parse(pedidoGuardado);
      }
    }
    console.log('Pedido recibido:', this.pedido);
  }


    formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 2 
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
