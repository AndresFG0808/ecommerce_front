import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientesComponent } from './components/templates/clientes/clientes.component';
import { PedidosComponent } from './components/templates/pedidos/pedidos.component';
import { PedidosclientesComponent } from './components/templates/pedidosclientes/pedidosclientes.component';
import { ProductosComponent } from './components/templates/productos/productos.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ClientesComponent,
    PedidosComponent,
    PedidosclientesComponent,
    ProductosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
