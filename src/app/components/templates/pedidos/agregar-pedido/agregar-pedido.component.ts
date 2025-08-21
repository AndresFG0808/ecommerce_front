import { Component } from '@angular/core';
import { PedidosService } from '../../../../services/pedidos.service';
import { ClientesService } from '../../../../services/clientes.service';
import { Router } from '@angular/router';
import { ClientesResponse } from '../../../../models/clientes';
import { PedidosRequest, ProductoResponse } from '../../../../models/pedidos';
import { ProductoService } from '../../../../services/producto.service';
import { ProductosResponse } from '../../../../models/productos';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-agregar-pedido',
  standalone: false,
  templateUrl: './agregar-pedido.component.html',
  styleUrl: './agregar-pedido.component.css',
})
export class AgregarPedidoComponent {
  //pedidos: PedidosResponse[] = [];

  pedido: PedidosRequest = {
    idCliente: 0,
    fechaCreacion: '',
    estado: 'PENDIENTE',
    productos: [],
  };

  clientes: ClientesResponse[] = [];
  isLoading = true;
  productos: ProductosResponse[] = [];
  productosAux: ProductosResponse[] = [];

  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private clientesService: ClientesService,
    private productosService: ProductoService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getClientes();
    this.getProductos();
    this.isLoading = false;
  }


    
  getClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.log('error: ', error);
      },
    });
  }

  getProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        console.log('productos: ', data);
        this.productos = data;
        this.productosAux = data;
      },
      error: (error) => {
        console.log('error: ', error);
      },
    });
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    });
  }

  addProductoToPedidos(id: number): void {
    const producto = this.productos.find((item) => item.id === id);

    if (producto) {
      const productoRequest = {
        idProducto: producto.id,
        precio: producto.precio,
        cantidad: 1,
        stock: producto.stock,
        nombre: producto.nombre,
      };

      this.productos = this.productos.filter((item) => item.id !== id);
      this.pedido.productos.push(productoRequest);
    }
  }

  deleteProductoToPedidos(id: number): void {
    const producto = this.productosAux.find((item) => item.id === id);
    if (producto) {
      this.pedido.productos = this.pedido.productos.filter(
        (item) => item.idProducto !== id
      );
      this.productos.push(producto);
    }
  }

  savePedido(): void {
    if (this.validarForm() !== '') {
      this.alertService.alertPositioned(
        'Error',
        this.validarForm(),
        'top-end',
        'error'
      );
    } else {
      if (this.validarLista() !== '') {
        this.alertService.alertPositioned(
          'Error',
          this.validarLista(),
          'top-end',
          'error'
        );
      } else {
        this.pedidosService.crearPedido(this.pedido).subscribe({
          next: async (data) => {
            await this.alertService.alertMessage(
              'Éxito',
              'El pedido ha sido agregado con éxito'
            );
             this.router.navigate(['/dashboard/pedidos']);
          },
          error: (error) => {
            this.alertService.alertPositioned(
              'Error',
              error,
              'top-end',
              'error'
            );
          },
        });
      }
    }
  }

  calcularTotal(): number {
    return this.pedido.productos.reduce(
      (acc, item) => acc + item.cantidad * item.precio,
      0
    );
  }

  validarCantidad(producto: any, event: any) {
    const value = event.target.valueAsNumber;

    if (value > producto.stock) {
      producto.cantidad = producto.stock;
      event.target.value = producto.stock;
    }

    if (value < 1) {
      producto.cantidad = 1;
      event.target.value = 1;
    }
  }

  validarPrecio(producto: any, event: any) {
    const value = event.target.valueAsNumber;
    if (value < 1) {
      producto.precio = 1;
      event.target.value = 1;
    }
  }

  validarForm(): string {
    if (this.pedido.idCliente === 0) {
      return 'El cliente es requerido';
    }
    if (this.pedido.fechaCreacion === '') {
      return 'La fecha de creación es requerida';
    }

    if (this.pedido.productos.length === 0) {
      return 'Debe haber al menos un producto en el pedido';
    }
    return '';
  }

  validarLista(): string {
    let message = '';
    for (const item of this.pedido.productos) {
      if (!item.cantidad) {
        message = `La cantidad del producto #${item.idProducto} es requerida`;
        break;
      }

      if (!item.precio) {
        message = `El precio del producto #${item.idProducto} es requerido`;
        break;
      }
    }
    return message;
  }
}
