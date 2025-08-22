# EcommerceFront

* En el archivo de producto.service primero se agregó el decorador de Angular que se usa para marcar una clase como inyectable 
 (es decir, que puede ser utilizada como un servicio a través de la inyección de dependencias).
   . Se especifica que endpoint se va a consumir que se ereda de Enviroment.
   
   . Se crea el contructor del servicio.
   
   .Luego creamos el método para obtener la lista de productos desde la API.
    Utiliza HttpClient para realizar una petición GET a la URL de la API.
    
    .postProducto: Método para registrar un nuevo producto en la API.
    Utiliza HttpClient para realizar una petición POST a la URL de la API.

    .putProducto:  Método para actualizar un producto existente en la API.
    Utiliza HttpClient para realizar una petición PUT a la URL de la API

    deleteProducto: Método para eliminar un producto de la API.
    Utiliza HttpClient para realizar una petición DELETE a la URL de la API.

* En el archico de productos.component.ts primero se agrega el componente para manejar la visualización y gestión de productos.
 Permite crear, editar, eliminar y listar productos.

. se declara la clase ProductosComponent.
 Que implementa la lógica para manejar productos en la aplicación.

. Constructor del componente ProductosComponent.
 Inicializa el formulario de productos y los servicios necesarios.

 . Se inicializa el componente y se carga los productos.
   Se llama al método cargarProductos para obtener la lista de productos desde el servicio.

   . Cargamos la lista de productos desde el servicio y
   Muestra un mensaje de error si no se pueden cargar los productos.

   .En toggleForm() se muestra u oculta el formulario para crear o editar un producto.
    Si el formulario está visible, se oculta; si está oculto, se muestra.
    Resetea el formulario y establece el modo de edición a falso.

    .El metodo  resetForm()  Limpia los campos del formulario y restablece el estado del modal.

    . En  onsubmit() se envía el formulario para crear o editar un producto.
    Si el formulario es válido, se envía la solicitud al servicio correspondiente.
    En caso de éxito, se actualiza la lista de productos y se muestra un mensaje de éxito.
    En caso de error, se muestra un mensaje de error.

   . editProducto: Edita un producto existente.
   Muestra el formulario con los datos del producto seleccionado.

  .deleteProducto: Elimina un producto por su ID.
  Validar que el ID sea válido antes de intentar eliminar
   Muestra un modal de confirmación antes de eliminar.
   Si el usuario confirma la eliminación
se llama al servicio para eliminar el producto
Si ocurre un error, se muestra un mensaje de error al usuario.

. con el metodo abrirModal() y cerrarModal se gestiona que se muestren o se oculte el formulario para agregar y editar Productos.

. onlyNumbers: sSe usa para permitir que solo se ingresen números en los campos de stock y precio.



This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



