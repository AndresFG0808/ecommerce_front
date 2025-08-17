import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientesComponent } from './components/templates/clientes/clientes.component';
import { PedidosComponent } from './components/templates/pedidos/pedidos.component';
import { PedidosclientesComponent } from './components/templates/pedidosclientes/pedidosclientes.component';
import { ProductosComponent } from './components/templates/productos/productos.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ClientesComponent,
    PedidosComponent,
    PedidosclientesComponent,
    ProductosComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
