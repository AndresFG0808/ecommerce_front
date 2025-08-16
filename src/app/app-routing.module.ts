import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PedidosclientesComponent } from './components/templates/pedidosclientes/pedidosclientes.component';
import { ClientesComponent } from './components/templates/clientes/clientes.component';
import { PedidosComponent } from './components/templates/pedidos/pedidos.component';
import { ProductosComponent } from './components/templates/productos/productos.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, children: [
    {path: '', redirectTo: 'pedidosclientes', pathMatch:'full'},
    {path: 'pedidosclientes', component: PedidosclientesComponent},
    {path: 'clientes', component: ClientesComponent},
    {path: 'pedidos', component:PedidosComponent},
    {path: 'productos', component: ProductosComponent},
  ]},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
