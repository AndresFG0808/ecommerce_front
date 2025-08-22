import { Component, OnInit } from '@angular/core';
import { ProductosRequest, ProductosResponse } from '../../../models/productos';
import Swal from 'sweetalert2';
import { ProductoService } from '../../../services/producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

/**
 * Componente para manejar la visualización y gestión de productos.
 * Permite crear, editar, eliminar y listar productos.
 */
@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit {
  productos: ProductosResponse[] = [];
  productoForm: FormGroup;
  textoModal: string = 'Nuevo Producto';
  showForm = false;
  selectedProducto: ProductosResponse | null = null;
  isEditMode: boolean = false;
  muestraAcciones: boolean = false;
  isLoading = false;
  error = '';

  isAdmin: boolean = false;

  /**
   * Constructor del componente ProductosComponent.
   * Inicializa el formulario de productos y los servicios necesarios.
   * @param productoService Servicio para manejar productos.
   * @param formBuilder FormBuilder para crear formularios reactivos.
   */
  constructor(
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.productoForm = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(30),
        ],
      ],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(150),
        ],
      ],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
    });
  }
  /**
   * Inicializa el componente y carga los productos.
   * Se llama al método cargarProductos para obtener la lista de productos desde el servicio.
   */

  ngOnInit(): void {
    this.cargarProductos();
    if (this.authService.hasRole('ROLE_ADMIN')) {
      this.muestraAcciones = true;
    }

    this.isAdmin = this.authService.getRoles().join(', ') === 'ROLE_ADMIN' ? true : false;
  }

  /**
   * Carga la lista de productos desde el servicio.
   * Muestra un mensaje de error si no se pueden cargar los productos.
   */
  cargarProductos(): void {
    this.isLoading = true;
    this.productoService.getProductos().subscribe({
      next: (resp) => {
        this.productos = resp;
        console.log(this.productos);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar productos';
        this.isLoading = false;
      },
    });
  }

  /**
   * Muestra u oculta el formulario para crear o editar un producto.
   * Si el formulario está visible, se oculta; si está oculto, se muestra.
   * Resetea el formulario y establece el modo de edición a falso.
   */
  toggleForm(): void {
    this.showForm = !this.showForm;
    this.textoModal = 'Nuevo Producto';
    this.isEditMode = false;
    this.productoForm.reset();
    this.selectedProducto = null;
    this.abrirModal();
  }

  /**
   * Resetea el formulario y oculta el modal.
   * Limpia los campos del formulario y restablece el estado del modal.
   */
  resetForm(): void {
    this.productoForm.reset();
    this.showForm = false;
    this.textoModal = 'Nuevo Producto';
    this.isEditMode = false;
    this.selectedProducto = null;
  }
  /**
   * Envía el formulario para crear o editar un producto.
   * Si el formulario es válido, se envía la solicitud al servicio correspondiente.
   * En caso de éxito, se actualiza la lista de productos y se muestra un mensaje de éxito.
   * En caso de error, se muestra un mensaje de error.
   */

  onsubmit(): void {
    if (this.productoForm.valid) {
      const productoData: ProductosRequest = this.productoForm.value;

      if (this.isEditMode && this.selectedProducto) {
        /**Editar producto existente
         * Aquí se agrega la lógica para editar un producto existente.
         * Se utiliza el servicio productoService para enviar la solicitud de actualización al backend.
         *  */
        this.productoService
          .putProducto(productoData, this.selectedProducto.id)
          .subscribe({
            next: (updateProducto) => {
              const index = this.productos.findIndex(
                (p) => p.id === updateProducto.id
              );
              if (index !== -1) {
                this.productos[index] = updateProducto;
              }
              Swal.fire({
                title: 'Éxito',
                text: 'Producto actualizado correctamente',
                icon: 'success',
              });
              this.resetForm();
              const modal = document.getElementById('modalProducto');
              if (modal)
                (window as any).bootstrap.Modal.getOrCreateInstance(
                  modal
                ).hide();

              this.cerrarModal();
            },
            error: (err) => {
              console.error('Error al eliminar un productos');
            },
          });
      } else {
        // Crear nuevo producto
        /**
         * Aquí se agrega la lógica para crear un nuevo producto.
         */

        this.productoService.postProducto(productoData).subscribe({
          next: (newProducto) => {
            this.productos.push(newProducto);
            Swal.fire({
              title: 'Éxito',
              text: 'Producto creado correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            this.resetForm();
            const modal = document.getElementById('modalProducto');
            if (modal)
              (window as any).bootstrap.Modal.getOrCreateInstance(modal).hide();

            this.cerrarModal();
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo crear el producto',
              icon: 'error',
            });
          },
        });
      }
    }
  }

  /**
   * Edita un producto existente.
   * Muestra el formulario con los datos del producto seleccionado.
   * @param producto
   */

  editProducto(producto: ProductosResponse): void {
    this.showForm = true;
    this.textoModal = 'Editando Producto ' + producto.nombre;
    this.isEditMode = true;
    this.selectedProducto = producto;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
    });
    this.abrirModal();
  }
  /**
   *   Elimina un producto por su ID.
   * Muestra un modal de confirmación antes de eliminar.
   * @param id
   * @returns
   */
  deleteProducto(id: number): void {
    if (!id) {
      Swal.fire({
        title: 'Error',
        text: 'ID de producto inválido. No se puede eliminar.',
        icon: 'error',
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(id).subscribe({
          next: (deletedProducto) => {
            this.productos = this.productos.filter((p) => p.id !== id);
            Swal.fire({
              title: 'Éxito',
              text:
                'Producto ' +
                deletedProducto.nombre +
                ' eliminado correctamente',
              icon: 'success',
            });
          },
          error: () => {
            console.error('Error al eliminar un productos')
          },
        });
      }
    });
  }

  /**
   * Abre el modal bootstrap de cliente.
   * @param {void}
   * @returns {void}
   */
  abrirModal(): void {
    const modal = document.getElementById('modalProducto');
    if (modal)
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  /**
   * Cierra el modal bootstrap de cliente.
   * @param {void}
   * @returns {void}
   */
  cerrarModal(): void {
    const modal = document.getElementById('modalNuevoCliente');
    if (modal)
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).hide();
  }
  /**
   *
   * Permite que solo se ingresen números en los campos de tipo número.
   * @param event Evento de teclado.
   */

  onlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Solo permitir números (0-9) y punto para decimales
    if (event.key !== '.' && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
}
