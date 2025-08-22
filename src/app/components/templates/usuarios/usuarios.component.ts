import { Component, OnInit } from '@angular/core';
import { AuthRequest, AuthResponse } from '../../../models/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent  implements OnInit{

  usuarios: AuthResponse[] = [];
   isLoading = true;
   open = false;
  nuevoUsuario: AuthRequest = { username: '', password: '', roles: [] };



   constructor(
    private usuariosService : UsuariosService,
    private alertService: AlertService,
  ) {}


  ngOnInit(): void {
    this.getUsuarios();
    
  }


  getUsuarios() : void {

    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading= false
      },
      error: (error) => {
        console.log("error: ", error)
      }
    })
  }

  openModal(): void {
    this.open = true;
    this.nuevoUsuario = { username: '', password: '', roles: [] };
  }

  closeModal(): void {
    this.open = false;
  }

  guardarUsuario(): void {
    this.usuariosService.crearUsuario(this.nuevoUsuario).subscribe({
      next: (data) => {
        this.usuarios.push(data);
        this.alertService.alertMessage("Éxito", "Usuario agregado")
        this.closeModal();
      },
      error: (err) => {
        alert("Error al guardar usuario");
        console.log(err);
      }
    });
  }

  async onEliminar(username: string): Promise<void> {

   const confirm = await  this.alertService.alertConfirm("¿Estás seguro?", "Una vez eliminado el usuario no podrá ser recuperado", 'question')
  if (confirm) {
    this.usuariosService.eliminarUsuario(username).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.username !== username);
      },
      error: (err) => {
        console.error("Error al eliminar usuario", err);
        alert("No se pudo eliminar el usuario.");
      }
    });
  }
}




}
