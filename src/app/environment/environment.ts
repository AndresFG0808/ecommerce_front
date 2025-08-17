/**
 * @module environment
 * 
 * @description
 * Objeto de configuración que define las credenciales de autenticación para el entorno de la aplicación.
 * 
 * @property {string} authUser - Nombre de usuario utilizado para autenticación.
 * @property {string} authPassword - Contraseña utilizada para autenticación.
 * 
 * @remarks
 * Este objeto se utiliza para almacenar las credenciales necesarias para acceder a ciertas funcionalidades protegidas de la aplicación durante el desarrollo o pruebas.
 * Es común definir estos valores en archivos de entorno para facilitar la configuración y evitar exponer datos sensibles en el código fuente principal.
 */
export const environment = {
    authUser: 'admin',
    authPassword: 'admin',
    testToken: 'token-de-prueba-123'
}