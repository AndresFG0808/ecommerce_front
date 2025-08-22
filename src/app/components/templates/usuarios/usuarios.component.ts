import { Component, OnInit } from '@angular/core';
import { AuthRequest, AuthResponse } from '../../../models/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  usuarios: AuthResponse[] = [];
  isLoading = true;
  open = false;
  nuevoUsuario: AuthRequest = { username: '', password: '', roles: [] };

  constructor(
    private usuariosService: UsuariosService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    const mapRole = (r: string) => {
      if (!r) return r;
      if (r.includes('ADMIN')) return 'ADMINISTRADOR';
      if (r.includes('USER')) return 'USUARIO';
      return r.replace('ROLE_', '');
    };

    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.map((u) => ({
          ...u,
          roles: (u.roles || []).map(mapRole),
          // Si quieres reemplazar el username por el rol principal, descomenta la línea siguiente:
          // username: ((u.roles || [])[0]) ? mapRole((u.roles || [])[0]) : u.username
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('error: ', error);
        this.isLoading = false;
      },
    });
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
        this.alertService.alertMessage('Éxito', 'Usuario agregado');
        this.closeModal();
      },
      error: (err) => {
        //alert('Error al guardar usuario');
        console.log(err);
      },
    });
  }

  async onEliminar(username: string): Promise<void> {
    const confirm = await this.alertService.alertConfirm(
      '¿Estás seguro?',
      'Una vez eliminado el usuario no podrá ser recuperado',
      'question'
    );
    if (confirm) {
      this.usuariosService.eliminarUsuario(username).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter((u) => u.username !== username);
        },
        error: (err) => {
          console.error('Error al eliminar usuario', err);
          
        },
      });
    }
  }
}
