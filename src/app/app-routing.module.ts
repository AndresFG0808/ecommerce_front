import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PedidosclientesComponent } from './components/templates/pedidosclientes/pedidosclientes.component';
import { ClientesComponent } from './components/templates/clientes/clientes.component';
import { PedidosComponent } from './components/templates/pedidos/pedidos.component';
import { ProductosComponent } from './components/templates/productos/productos.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DetallesPedidoComponent } from './components/templates/pedidos/detalles-pedido/detalles-pedido.component';
import { AgregarPedidoComponent } from './components/templates/pedidos/agregar-pedido/agregar-pedido.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    /**
     * @description
     * Protege la ruta del dashboard, evitando que usuarios no autenticados accedan a esta ruta.
     * Si se intenta acceder a una ruta protegida sin estar autenticado, se redirige al usuario a la
     * página de login.
     *
     * @returns {boolean} canActivate: true si el usuario está autenticado y da acceso a la ruta.
     *
     * @class [AuthGuard]: Guardia de autenticación que protege las rutas de la aplicación.
     *
     */
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'pedidosclientes', pathMatch: 'full' },
      { path: 'pedidosclientes', component: PedidosclientesComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'pedidos/detalles', component: DetallesPedidoComponent },
      { path: 'pedidos/agregar', component: AgregarPedidoComponent },
      { path: 'productos', component: ProductosComponent },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
