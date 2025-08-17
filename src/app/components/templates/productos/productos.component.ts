import { Component, OnInit } from '@angular/core';
import { ProductosRequest, ProductosResponse } from '../../../models/productos';
import Swal from 'sweetalert2';

/**
 * Componente para gestionar la información de los productos.
 * - Lista productos en una tabla con información de stock y precios.
 * - Permite crear, editar, eliminar y ver detalles de productos.
 * - Controla validaciones específicas según los constraints de la BD.
 *
 * Los comentarios dentro del código explican por qué y cómo se usan
 * las propiedades y métodos más relevantes para facilitar mantenimiento.
 */
@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  // Array con los productos que se muestran en la tabla.
  // Tipo ProductosResponse porque los objetos incluyen el ID generado.
  productos: ProductosResponse[] = [
    {
      idProductos: 1,
      nombre: 'Tenis Nike Air Max 270 React para Hombre Negro',
      descripcion: 'Tenis deportivos con tecnología Air Max, suela de espuma React, diseño moderno y cómodo para uso diario',
      precio: 2599.00,
      stock: 45
    },
    {
      idProductos: 2,
      nombre: 'Camisa de Vestir Slim Fit Azul Marino Hugo Boss',
      descripcion: 'Camisa de algodón premium con corte slim fit, cuello italiano, perfecta para ocasiones formales',
      precio: 1899.50,
      stock: 30
    },
    {
      idProductos: 3,
      nombre: 'Tenis Adidas Ultraboost 22 Running Blanco/Negro',
      descripcion: 'Tenis para correr con tecnología Boost, upper Primeknit, máximo retorno de energía en cada pisada',
      precio: 3299.00,
      stock: 22
    },
    {
      idProductos: 4,
      nombre: 'Pantalón de Mezclilla Levis 501 Original Azul',
      descripcion: 'Jeans clásicos de corte recto, 100% algodón, diseño atemporal y duradero, talla americana',
      precio: 1199.99,
      stock: 35
    },
    {
      idProductos: 5,
      nombre: 'Tenis Puma RS-X3 Puzzle Lifestyle Multicolor',
      descripcion: 'Tenis casual con diseño retro-futurista, suela gruesa, colores vibrantes, ideal para streetwear',
      precio: 2199.00,
      stock: 18
    },
    {
      idProductos: 6,
      nombre: 'Playera Polo Ralph Lauren Classic Fit Blanca',
      descripcion: 'Polo de algodón piqué con bordado del logo, corte clásico, cuello y puños en contraste',
      precio: 899.00,
      stock: 60
    },
    {
      idProductos: 7,
      nombre: 'Tenis Converse Chuck Taylor All Star High Top',
      descripcion: 'Tenis clásicos de caña alta, lona resistente, suela de goma vulcanizada, estilo icónico',
      precio: 1299.00,
      stock: 40
    },
    {
      idProductos: 8,
      nombre: 'Sudadera Champion Powerblend Fleece Hoodie Gris',
      descripcion: 'Sudadera con capucha, mezcla de algodón y poliéster, bolsillo frontal tipo canguro, logo bordado',
      precio: 799.50,
      stock: 0
    }
  ];

  // Indicador para mostrar un spinner mientras se cargan datos
  isLoading = false;

  // Mensaje de error general (si ocurre algún fallo al cargar/guardar)
  error = '';

  // Modelo que representa los campos que se envían al servidor
  // (sin ID). Usamos ProductosRequest para separar Request/Response.
  nuevoProducto: ProductosRequest = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0
  };

  // Estado para indicar si el formulario está en modo edición
  editandoProducto = false;

  // ID del producto que se está editando (0 = no hay edición)
  productoEditandoId = 0;

  /**
   * Constructor vacío (no se inyecta servicio aquí).
   * Si en el futuro se integra un servicio HTTP, inyectarlo en el constructor.
   */
  constructor() {}

  /**
   * Método llamado al inicializar el componente.
   * Aquí se arrancan las cargas iniciales (p. ej. llamar al servicio).
   */
  ngOnInit(): void {
    this.cargarProductos();
  }

  /**
   * Simula la carga de productos desde un servicio.
   * - Marca isLoading mientras "carga".
   * - En producción reemplazar la simulación por un servicio HTTP.
   */
  cargarProductos(): void {
    this.isLoading = true;
    // Simulación: pequeña espera para imitar petición al servidor
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  /**
   * Validaciones específicas para productos según constraints de BD.
   * - Nombre: mínimo 20 caracteres (CHECK LENGTH(NOMBRE) >= 20)
   * - Descripción: mínimo 20 caracteres (CHECK LENGTH(DESCRIPCION) >= 20)
   * - Precio: mayor o igual a 0 (CHECK PRECIO >= 0)
   * - Stock: mayor o igual a 0 (CHECK STOCK >= 0)
   */
  validarFormularioProducto(): { valido: boolean; error?: string } {
    const p = this.nuevoProducto;

    if (!p.nombre || !p.nombre.trim()) return { valido: false, error: 'El nombre no puede estar vacío' };
    if (p.nombre.trim().length < 20) return { valido: false, error: 'El nombre debe tener al menos 20 caracteres' };
    if (p.nombre.trim().length > 30) return { valido: false, error: 'El nombre no debe superar 30 caracteres' };

    if (!p.descripcion || !p.descripcion.trim()) return { valido: false, error: 'La descripción no puede estar vacía' };
    if (p.descripcion.trim().length < 20) return { valido: false, error: 'La descripción debe tener al menos 20 caracteres' };
    if (p.descripcion.trim().length > 150) return { valido: false, error: 'La descripción no debe superar 150 caracteres' };

    if (p.precio === null || p.precio === undefined) return { valido: false, error: 'El precio es obligatorio' };
    if (p.precio < 0) return { valido: false, error: 'El precio debe ser mayor o igual a 0' };

    if (p.stock === null || p.stock === undefined) return { valido: false, error: 'El stock es obligatorio' };
    if (p.stock < 0) return { valido: false, error: 'El stock debe ser mayor o igual a 0' };
    if (!Number.isInteger(p.stock)) return { valido: false, error: 'El stock debe ser un número entero' };

    return { valido: true };
  }

  /**
   * Registrar o actualizar un producto según el estado editandoProducto.
   * - Cuando editandoProducto === true actualiza el producto existente.
   * - Cuando editandoProducto === false crea uno nuevo y lo agrega al array.
   */
  registrarProducto(): void {
    const valid = this.validarFormularioProducto();
    if (!valid.valido) {
      Swal.fire({ title: 'Error de validación', text: valid.error, icon: 'warning', confirmButtonColor: '#3085d6', confirmButtonText: 'Entendido' });
      return;
    }

    if (this.editandoProducto) {
      const actualizado: ProductosResponse = {
        idProductos: this.productoEditandoId,
        nombre: this.nuevoProducto.nombre.trim(),
        descripcion: this.nuevoProducto.descripcion.trim(),
        precio: this.nuevoProducto.precio,
        stock: this.nuevoProducto.stock
      };
      const idx = this.productos.findIndex(p => p.idProductos === this.productoEditandoId);
      if (idx !== -1) this.productos[idx] = actualizado;

      this.cerrarModal();
      this.limpiarFormulario();

      Swal.fire({ title: '¡Éxito!', text: 'Producto actualizado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
    } else {
      const nextId = this.productos.length ? Math.max(...this.productos.map(p => p.idProductos)) + 1 : 1;
      const nuevo: ProductosResponse = {
        idProductos: nextId,
        nombre: this.nuevoProducto.nombre.trim(),
        descripcion: this.nuevoProducto.descripcion.trim(),
        precio: this.nuevoProducto.precio,
        stock: this.nuevoProducto.stock
      };
      this.productos.push(nuevo);

      this.cerrarModal();
      this.limpiarFormulario();

      Swal.fire({ title: '¡Éxito!', text: 'Producto registrado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  }

  /**
   * Preparar el formulario para editar un producto.
   * - Rellena el modelo nuevoProducto con los datos del producto seleccionado.
   * - Abre el modal en modo edición.
   */
  editarProducto(producto: ProductosResponse): void {
    this.editandoProducto = true;
    this.productoEditandoId = producto.idProductos;
    this.nuevoProducto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    };
    this.abrirModal();
  }

  /**
   * Eliminar un producto de la lista (simulado).
   * - En producción llamar al servicio para eliminar en el backend.
   * - Se recomienda mostrar confirmación antes de borrar (SweetAlert).
   */
  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productos = this.productos.filter(p => p.idProductos !== id);
        Swal.fire({ title: 'Eliminado', text: 'Producto eliminado correctamente', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    });
  }

  /**
   * Mostrar los detalles de un producto en un modal informativo.
   * - Uso de SweetAlert para evitar crear otro modal manualmente.
   */
  verDetalles(producto: ProductosResponse): void {
    Swal.fire({
      title: producto.nombre,
      html: `
        <div class="text-start">
          <p><strong>Descripción:</strong> ${producto.descripcion}</p>
          <p><strong>Precio:</strong> $${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          <p><strong>Stock disponible:</strong> ${producto.stock} unidades</p>
          <p><strong>Estado:</strong> ${producto.stock > 0 ? '<span class="text-success">Disponible</span>' : '<span class="text-danger">Agotado</span>'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar'
    });
  }

  /**
   * Restablece el modelo del formulario al estado inicial.
   * - Usado después de crear o actualizar un producto o al cerrar modal.
   */
  limpiarFormulario(): void {
    this.nuevoProducto = { nombre: '', descripcion: '', precio: 0, stock: 0 };
    this.editandoProducto = false;
    this.productoEditandoId = 0;
  }

  /**
   * Abre el modal bootstrap para crear/editar producto.
   * - Busca el elemento por id y usa la API de bootstrap para mostrarlo.
   */
  abrirModal(): void {
    const modal = document.getElementById('modalNuevoProducto');
    if (modal) (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  /**
   * Cierra el modal bootstrap de producto.
   */
  cerrarModal(): void {
    const modal = document.getElementById('modalNuevoProducto');
    if (modal) (window as any).bootstrap.Modal.getOrCreateInstance(modal).hide();
  }

  /**
   * Ejecutado cuando el modal se oculta.
   * - Si no estamos en edición, limpiamos el formulario para evitar datos residuales.
   */
  onModalHidden(): void {
    if (!this.editandoProducto) this.limpiarFormulario();
  }

  /**
   * Formatea el precio para mostrar en la tabla con formato de moneda mexicana.
   * @param precio Precio numérico del producto
   * @returns String formateado como moneda
   */
  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 2 
    });
  }

  /**
   * Determina el color del badge de stock según la cantidad disponible.
   * @param stock Cantidad en inventario
   * @returns Clase CSS para el badge
   */
  obtenerClaseStock(stock: number): string {
    if (stock === 0) return 'badge bg-danger';
    if (stock <= 10) return 'badge bg-warning text-dark';
    return 'badge bg-success';
  }

  /**
   * Cuenta los productos que tienen stock disponible (mayor a 0).
   * @returns Número de productos en stock
   */
  obtenerProductosEnStock(): number {
    return this.productos.filter(p => p.stock > 0).length;
  }

  /**
   * Cuenta los productos que están agotados (stock = 0).
   * @returns Número de productos agotados
   */
  obtenerProductosAgotados(): number {
    return this.productos.filter(p => p.stock === 0).length;
  }
}
