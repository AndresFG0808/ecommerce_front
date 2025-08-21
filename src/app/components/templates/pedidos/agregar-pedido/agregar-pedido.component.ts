import { Component } from '@angular/core';
import { PedidosService } from '../../../../services/pedidos.service';
import { ClientesService } from '../../../../services/clientes.service';
import { Router } from '@angular/router';
import { ClientesResponse } from '../../../../models/clientes';
import { PedidosRequest } from '../../../../models/pedidos';

@Component({
  selector: 'app-agregar-pedido',
  standalone: false,
  templateUrl: './agregar-pedido.component.html',
  styleUrl: './agregar-pedido.component.css'
})
export class AgregarPedidoComponent {
   //pedidos: PedidosResponse[] = [];

   pedido: PedidosRequest = {
     idCliente: 0,
     fechaCreacion: "",
      estado : "PENDIENTE",
     productos: [],
   };

  clientes: ClientesResponse[] = []
  isLoading = true;

    constructor(private pedidosService: PedidosService, private router: Router, private clientesService: ClientesService) {}

    ngOnInit(): void {
      this.getClientes();
      this.isLoading = false

    }


    getClientes() : void {
      this.clientesService.getClientes().subscribe({
        next: (data) => {
          // Faltaba parsear, por que estamos en un array de datos
          this.clientes = Array.isArray(data) ? data : [data];
        }, error : (error) => {
          console.log('error: ', error)
        }
      })
    }

}
