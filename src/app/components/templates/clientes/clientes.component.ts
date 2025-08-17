import { Component } from '@angular/core';
import { ClientesRequest, ClientesResponse } from '../../../models/clientes';
import Swal from 'sweetalert2';

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
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  // Array con los clientes que se muestran en la tabla.
  // Tipo ClientesResponse porque los objetos incluyen el ID generado.
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

  // Indicador para mostrar un spinner mientras se cargan datos
  isLoading = false;

  // Mensaje de error general (si ocurre algún fallo al cargar/guardar)
  error = '';

  // Modelo que representa los campos que se envían al servidor
  // (sin ID). Usamos ClientesRequest para separar Request/Response.
  nuevoCliente: ClientesRequest = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  // Estado para indicar si el formulario está en modo edición
  editandoCliente = false;

  // ID del cliente que se está editando (0 = no hay edición)
  clienteEditandoId = 0;

  /**
   * Constructor vacío (no se inyecta servicio aquí).
   * Si en el futuro se integra un servicio HTTP, inyectarlo en el constructor.
   */
  constructor() {}

  /**
   * Método llamado al inicializar el componente.
   * Aquí se arrancan las cargas iniciales (p. ej. llamar al servicio).
   */
  ngOnInit() {
    this.cargarClientes();
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

      // Cerrar modal y limpiar formulario después de actualizar
      this.cerrarModal();
      this.limpiarFormulario();

      // Feedback al usuario
      Swal.fire({ title: '¡Éxito!', text: 'Cliente actualizado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
    } else {
      // Crear nuevo cliente: generar un ID local (el backend lo generaría en producción)
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

      // Cerrar modal y limpiar formulario después de crear
      this.cerrarModal();
      this.limpiarFormulario();

      Swal.fire({ title: '¡Éxito!', text: 'Cliente registrado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  }

  /**
   * Preparar el formulario para editar un cliente.
   * - Rellena el modelo nuevoCliente con los datos del cliente seleccionado.
   * - Abre el modal en modo edición.
   */
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
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        // Filtrar el array local para eliminar el cliente
        this.clientes = this.clientes.filter(c => c.idClientes !== id);
        Swal.fire({ title: 'Eliminado', text: 'Cliente eliminado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    });
  }

  /**
   * Mostrar los detalles de un cliente en un modal informativo.
   * - Uso de SweetAlert para evitar crear otro modal manualmente.
   */
  verDetalles(cliente: ClientesResponse): void {
    Swal.fire({ // Fire: Función para mostrar una ventana emergente de SweetAlert2 con un objeto de opciones, todas opcionales.
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

  /**
   * Restablece el modelo del formulario al estado inicial.
   * - Usado después de crear o actualizar un cliente o al cerrar modal.
   */
  limpiarFormulario(): void {
    this.nuevoCliente = { nombre: '', apellido: '', email: '', telefono: '', direccion: '' };
    this.editandoCliente = false;
    this.clienteEditandoId = 0;
  }

  /**
   * Abre el modal bootstrap para crear/editar cliente.
   * - Busca el elemento por id y usa la API de bootstrap para mostrarlo.
   * - Si en el proyecto no se usa bootstrap, reemplazar por la lógica modal correspondiente.
   */
  abrirModal(): void {
    const modal = document.getElementById('modalNuevoCliente');
    if (modal) (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  /**
   * Cierra el modal bootstrap de cliente.
   */
  cerrarModal(): void {
    const modal = document.getElementById('modalNuevoCliente');
    if (modal) (window as any).bootstrap.Modal.getOrCreateInstance(modal).hide();
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