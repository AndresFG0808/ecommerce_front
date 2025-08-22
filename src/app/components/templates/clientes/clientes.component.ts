import { Component } from '@angular/core';
import { ClientesRequest, ClientesResponse } from '../../../models/clientes';
import Swal from 'sweetalert2';
import { ClientesService } from '../../../services/clientes.service';
import { AuthService } from '../../../services/auth.service';
import { ProductosResponse } from '../../../models/productos';
import { PedidosRequest } from '../../../models/pedidos';
import { PedidosService } from '../../../services/pedidos.service';
import { Router } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { AlertService } from '../../../services/alert.service';

/**
 * Componente para gestionar la información de los clientes.
 * - Lista clientes en una tabla.
 * - Permite crear, editar, eliminar y ver detalles.
 *
 * Los comentarios dentro del código explican por qué y cómo se usan
 * las propiedades y métodos más relevantes para facilitar mantenimiento.
 */
@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent {
  isAdmin: boolean = false;

  // Array con los clientes que se muestran en la tabla.
  // Tipo ClientesResponse porque los objetos incluyen el ID generado.
  clientes: ClientesResponse[] = [];

  // Indicador para mostrar un spinner mientras se cargan datos
  isLoading = false;

  // Mensaje de error general (si ocurre algún fallo al cargar/guardar)
  error = '';

  // Modelo que representa los campos que se envían al servidor
  // (sin ID). Usamos ClientesRequest para separar Request/Response.
  nuevoCliente: string = '';
  nuevoApellido: string = '';
  nuevoEmail: string = '';
  nuevoTelefono: string = '';
  nuevoDireccion: string = '';

  // Estado para indicar si el formulario está en modo edición
  editandoCliente = false;
  open = false

  // ID del cliente que se está editando (0 = no hay edición)
  clienteEditandoId = 0;


  pedido: PedidosRequest = {
      idCliente: 0,
      cliente: "",
      estado: 'PENDIENTE',
      productos: [],
    };
  
    //clientes: ClientesResponse[] = [];
    //isLoading = true;
    productos: ProductosResponse[] = [];
    productosAux: ProductosResponse[] = [];

  /**
   * Constructor vacío (no se inyecta servicio aquí).
   * Si en el futuro se integra un servicio HTTP, inyectarlo en el constructor.
   */
  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private clienteService: ClientesService, private authService: AuthService,
    private productosService: ProductoService,
    private alertService: AlertService
  ) {}

  /**
   * Método llamado al inicializar el componente.
   * Aquí se arrancan las cargas iniciales (p. ej. llamar al servicio).
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        //Se le hicieron cambios aqui por que se cambio en el service para la respuesta
        this.getProductos();
        this.clientes = Array.isArray(clientes) ? clientes : [clientes];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron obtener los datos de los clientes:';
        this.isLoading = false;
      },
    });

    this.isAdmin = this.authService.getRoles().join(', ') === "ROLE_ADMIN" ? true : false;

    this.cargarClientes();
  }


  abrirNuevoPedido(cliente: ClientesResponse):void{
    this.open = true,
    this.pedido.idCliente = cliente.id;
    this.pedido.cliente = `${cliente.nombre} ${cliente.apellido}`
  }

  cerrarNuevoPedido() : void {
    this.open = false;
    this.pedido.idCliente = 0;
    this.pedido.cliente = ``
    this.pedido.productos = []
    this.productos = this.productosAux

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

      if(producto.stock> 0) {
        const productoRequest = {
        idProducto: producto.id,
        precio: producto.precio,
        cantidad: 1,
        stock: producto.stock,
        nombre: producto.nombre,
      };

      this.productos = this.productos.filter((item) => item.id !== id);
      this.pedido.productos.push(productoRequest);
      }else{
         this.alertService.alertPositioned(
          'Error',
          "No hay suficiente stock para hacer un pedido",
          'top-end',
          'error'
        );
      }
      
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
            console.log("error: ", error)
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

  /**
   * Simula la carga de clientes desde un servicio.
   * - Marca isLoading mientras "carga".
   * - En producción reemplazar la simulación por un servicio HTTP.
   */
  cargarClientes(): void {
    this.isLoading = true;
    // Simulación: pequeña espera para imitar petición al servidor
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  /**
   * Registrar o actualizar un cliente según el estado editandoCliente.
   * - Cuando editandoCliente === true actualiza el cliente existente.
   * - Cuando editandoCliente === false crea uno nuevo y lo agrega al array.
   *
   * Nota: validaciones de formulario se omiten aquí (se puede agregar un metodo en donde
   * hagamos las validaciones).
   */
  registrarCliente(): void {
    // Si está en modo edición, actualizamos el cliente existente en memoria.
    //Limpiar el nombre:

    if (this.editandoCliente) {
      this.clienteService
        .actualizarCliente(this.clienteEditandoId, {
          nombre: this.nuevoCliente,
          apellido: this.nuevoApellido,
          email: this.nuevoEmail,
          telefono: this.nuevoTelefono,
          direccion: this.nuevoDireccion,
        })
        .subscribe({
          next: (clienteActualizado) => {
            const index = this.clientes.findIndex(
              (t) => t.id === this.clienteEditandoId
            );
            if (index !== -1) {
              this.clientes[index] = clienteActualizado;
            }
            
            this.limpiarFormulario();
            // Cerrar el modal de actualizacion antes de mostrar el SwetAlert de exito/error
            this.cerrarModal();

            Swal.fire({
              text: 'Tipo actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              timer: 2000,
              showConfirmButton: false,
              allowEnterKey: false,
              allowEscapeKey: true,
            });
          },
          error: (err) => {
            console.error("Error al actualizar un cliente: ", err);
          },
        });
    } else {
      this.clienteService
        .crearCliente({
          nombre: this.nuevoCliente,
          apellido: this.nuevoApellido,
          email: this.nuevoEmail,
          telefono: this.nuevoTelefono,
          direccion: this.nuevoDireccion,
        })
        .subscribe({
          next: (cliente) => {
            this.clientes.push(cliente);
            this.limpiarFormulario();

            // Cerrar el modal de actualizacion antes de mostrar el SwetAlert de exito/error
            this.cerrarModal();

            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo registrado correctamente',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              timer: 2000,
              showConfirmButton: false,
              allowEnterKey: false,
              allowEscapeKey: true,
            });
          },
          error: () =>
            Swal.fire({
              title: 'Error',
              text: 'Error al registrar el tipo',
              icon: 'error',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Cerrar',
            }),
        });

      Swal.fire({
        title: '¡Éxito!',
        text: 'Cliente registrado correctamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }

  /**
   * Preparar el formulario para editar un cliente.
   * - Rellena el modelo nuevoCliente con los datos del cliente seleccionado.
   * - Abre el modal en modo edición.
   */
  editarCliente(cliente: ClientesResponse): void {
    this.editandoCliente = true;
    this.clienteEditandoId = cliente.id;
    this.nuevoCliente = cliente.nombre;
    this.nuevoApellido = cliente.apellido;
    this.nuevoEmail = cliente.email;
    this.nuevoTelefono = cliente.telefono;
    this.nuevoDireccion = cliente.direccion ?? '';

    this.abrirModal();
  }

  /**
   * Eliminar un cliente de la lista (simulado).
   * - En producción llamar al servicio para eliminar en el backend.
   * - Se recomienda mostrar confirmación antes de borrar (SweetAlert).
   */
  eliminarCliente(id: number): void {
    // Mostrar confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Filtrar el array local para eliminar el cliente
        this.clienteService.eliminarCliente(id).subscribe({
          next: (cliente) => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El tipo ha sido eliminado correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
            this.clientes = this.clientes.filter(
              (cliente) => cliente.id !== id
            );
          },
          error: (err) =>
            console.error("Error al eliminar cliente: ", err)
        });
      }
    });
  }

  /**
   * Mostrar los detalles de un cliente en un modal informativo.
   * - Uso de SweetAlert para evitar crear otro modal manualmente.
   */
  verDetalles(cliente: ClientesResponse): void {
    Swal.fire({
      // Fire: Función para mostrar una ventana emergente de SweetAlert2 con un objeto de opciones, todas opcionales.
      title: `${cliente.nombre} ${cliente.apellido}`,
      html: `
        <div class="text-start">
          <p><strong>Email:</strong> ${cliente.email}</p>
          <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
          <p><strong>Dirección:</strong> ${
            cliente.direccion || 'No especificada'
          }</p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar',
    });
  }

  /**
   * Restablece el modelo del formulario al estado inicial.
   * - Usado después de crear o actualizar un cliente o al cerrar modal.
   */
  limpiarFormulario(): void {
    this.editandoCliente = false;
    this.clienteEditandoId = 0;

    this.nuevoCliente = '';
    this.nuevoApellido = '';
    this.nuevoEmail = '';
    this.nuevoTelefono = '';
    this.nuevoDireccion = '';
    this.cerrarModal();
  }

  /**
   * Abre el modal bootstrap para crear/editar cliente.
   * - Busca el elemento por id y usa la API de bootstrap para mostrarlo.
   * - Si en el proyecto no se usa bootstrap, reemplazar por la lógica modal correspondiente.
   */
  abrirModal(): void {
    const modal = document.getElementById('modalNuevoCliente');
    if (modal)
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  /**
   * Cierra el modal bootstrap de cliente.
   */
  cerrarModal(): void {
    const modal = document.getElementById('modalNuevoCliente');
    if (modal)
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).hide();
  }

  /**
   * Ejecutado cuando el modal se oculta.
   * - Si no estamos en edición, limpiamos el formulario para evitar datos residuales.
   *
   *  Lo agregue por que me pasaba que cuando cerraba el modal y lo volvía a abrir,
   * los campos se quedaban con los datos del cliente anterior. Pero basicamente manda a llamar
   * el metodo limpiarFormulario() que es el que vacia los campos si en la variable editandoCliente
   * hay un cliente en edicion al cerrar el modal.
   */
  onModalHidden(): void {
    if (!this.editandoCliente) this.limpiarFormulario();
  }
}
