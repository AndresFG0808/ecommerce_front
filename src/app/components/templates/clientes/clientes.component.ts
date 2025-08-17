import { Component } from '@angular/core';
import { ClientesRequest, ClientesResponse } from '../../../models/clientes';
import Swal from 'sweetalert2';


/**
 * Componente para gestionar la información de los clientes.
 * Permite crear, editar y eliminar clientes.
 *
 * Los metodos se crean con void, ya que void indica que no se espera un valor de retorno.
 * Porque en este caso no necesitamos devolver nada, solo realizar acciones.
 *
 * @method ngOnInit() : void
 * @description Método que se ejecuta al inicializar el componente.
 * Aquí se pueden realizar tareas de configuración inicial.
 *
 * @var clientes: ClientesResponse[] : Viene de el modelo/interfaz ClientesResponse
 * @var nuevoCliente: ClientesRequest : Viene de el modelo/interfaz ClientesRequest
 * @var editandoCliente: boolean : Indica si se está editando un cliente
 * @var clienteEditandoId: number : ID del cliente que se está editando
 * @var isLoading: boolean : Indica si se está cargando la información
 * @var error: string : Mensaje de error en caso de fallo
 *
 * @Method cerrarModal() : void
 * @description Método para cerrar el modal de cliente.
 * @Method limpiarFormulario() : void
 * @description Método para limpiar el formulario de cliente.
 * @Method abrirModal() : void
 * @description Método para abrir el modal de cliente.
 * @Method onModalHidden() : void
 * @description Método que se ejecuta cuando se cierra el modal de cliente.
 * @Method onModalShown() : void
 * @description Método que se ejecuta cuando se muestra el modal de cliente.
 */

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  clientes: ClientesResponse[] = [
    {
      idClientes: 1,
      nombre: 'Luis',
      apellido: 'Andres',
      email: 'luis.andres@email.com',
      telefono: '1234567890',
      direccion: 'Calle 123, Ciudad'
    },
    {
      idClientes: 2,
      nombre: 'Maria',
      apellido: 'Gomez',
      email: 'maria.gomez@email.com',
      telefono: '0987654321',
      direccion: 'Avenida 456, Ciudad'
    },
    {
      idClientes: 3,
      nombre: 'Carlos',
      apellido: 'Ruiz',
      email: 'carlos.ruiz@email.com',
      telefono: '5555555555',
      direccion: 'Plaza 789, Ciudad'
    },
    {
      idClientes: 4,
      nombre: 'Ana',
      apellido: 'Torres',
      email: 'ana.torres@email.com',
      telefono: '1111111111',
      direccion: 'Barrio 321, Ciudad'
    }
  ]

  isLoading = false;
  error = '';

  nuevoCliente: ClientesRequest = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  editandoCliente = false;
  clienteEditandoId = 0;

  /**
   * El constructor sirve para inicializar el componente. Con el propósito de
   * manejar la lógica de los clientes.
   */
  constructor() {}

  /**
   * El método ngOnInit se ejecuta al inicializar el componente.
   * Aquí se pueden realizar tareas de configuración inicial.
   */
  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.isLoading = true;
    // Simulacion carga desde servicio
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  //Agregar
  registrarCliente(): void {

    //const valid = this.validarFormularioCliente(); a quien le toque validaciones en el front

    if (this.editandoCliente) {
      const actualizado: ClientesResponse = {
        idClientes: this.clienteEditandoId,
        nombre: this.nuevoCliente.nombre.trim(),
        apellido: this.nuevoCliente.apellido.trim(),
        email: this.nuevoCliente.email.trim(),
        telefono: this.nuevoCliente.telefono.trim(),
        direccion: this.nuevoCliente.direccion?.trim() || ''
      };
      const idx = this.clientes.findIndex(c => c.idClientes === this.clienteEditandoId);
      if (idx !== -1) this.clientes[idx] = actualizado;

      this.cerrarModal();
      this.limpiarFormulario();

      Swal.fire({ title: '¡Éxito!', text: 'Cliente actualizado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
    } else {
      const nextId = this.clientes.length ? Math.max(...this.clientes.map(c => c.idClientes)) + 1 : 1;
      const nuevo: ClientesResponse = {
        idClientes: nextId,
        nombre: this.nuevoCliente.nombre.trim(),
        apellido: this.nuevoCliente.apellido.trim(),
        email: this.nuevoCliente.email.trim(),
        telefono: this.nuevoCliente.telefono.trim(),
        direccion: this.nuevoCliente.direccion?.trim() || ''
      };
      this.clientes.push(nuevo);

      this.cerrarModal();
      this.limpiarFormulario();

      Swal.fire({ title: '¡Éxito!', text: 'Cliente registrado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  }

  
  editarCliente(cliente: ClientesResponse): void {
    this.editandoCliente = true;
    this.clienteEditandoId = cliente.idClientes;
    this.nuevoCliente = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion || ''
    };
    this.abrirModal();
  }

  eliminarCliente(id: number): void {
    
  }

  verDetalles(cliente: ClientesResponse): void {
    Swal.fire({
      title: `${cliente.nombre} ${cliente.apellido}`,
      html: `
        <div class="text-start">
          <p><strong>Email:</strong> ${cliente.email}</p>
          <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
          <p><strong>Dirección:</strong> ${cliente.direccion || 'No especificada'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar'
    });
  }

  limpiarFormulario(): void {
    this.nuevoCliente = { nombre: '', apellido: '', email: '', telefono: '', direccion: '' };
    this.editandoCliente = false;
    this.clienteEditandoId = 0;
  }

  abrirModal(): void {
    const modal = document.getElementById('modalNuevoCliente');
    if (modal) (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  cerrarModal(): void {
    const modal = document.getElementById('modalNuevoCliente');
    if (modal) (window as any).bootstrap.Modal.getOrCreateInstance(modal).hide();
  }

  onModalHidden(): void {
    if (!this.editandoCliente) this.limpiarFormulario();
  }
}
