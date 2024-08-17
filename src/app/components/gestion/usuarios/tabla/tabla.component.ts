import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../../../services/usuarios/usuarios.service';
import { finalize } from 'rxjs';
import { UsuarioDTO } from '../../../../interfaces/usuarios/usuario-dto';
import { AlertasService } from '../../../../services/shared/alertas/alertas.service';
import { CompartidoService } from '../../../../services/compartido/compartido.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'], // Asegúrate de que el nombre del archivo sea correcto
})
export class TablaComponent {
  _UsuariosService = inject(UsuariosService);
  _AlertasService = inject(AlertasService);
  _CompartidoService = inject(CompartidoService);

  usuarios: UsuarioDTO[] = [];
  usuariosFiltrados: UsuarioDTO[] = [];
  unicoAdministrador: boolean = false;
  cargando: boolean = false;

  ngOnInit(): void {
    this.obtenerUsuarios();
    this._CompartidoService.actualizarTitulo('Inicio');
  }

  public obtenerUsuarios() {
    this.cargando = true;

    this._UsuariosService
      .obtenerUsuarios()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
          this.usuariosFiltrados = usuarios;
          this.verificarUnicoAdministrador(); // Verificar si hay un único administrador
        },
        error: (error: any) => {
          this._AlertasService.showError(
            'No se pudo obtener los usuarios, intenta nuevamente',
            'Ocurrió un problema'
          );
          console.error(error);
        },
      });
  }

  private verificarUnicoAdministrador() {
    const administradores = this.usuarios.filter(
      (user) => user.rol === 'Admin'
    );
    this.unicoAdministrador = administradores.length === 1;
  }

  filtrarUsuarios(event: any) {
    const query = event.target.value.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(query) ||
        usuario.correo.toLowerCase().includes(query) ||
        usuario.rol.toLowerCase().includes(query)
    );
  }

  desactivar(id: string) {
    this.cargando = true;

    this._UsuariosService
      .desactivarUsuario(id)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => {
          this._AlertasService.showSuccess(
            'Usuario desactivado correctamente',
            'Éxito'
          );
          this.obtenerUsuarios(); // Refrescar la lista de usuarios
        },
        error: (error: any) => {
          this._AlertasService.showError(
            'No se pudo desactivar el usuario, intenta nuevamente',
            'Ocurrió un problema'
          );
          console.error(error);
        },
      });
  }

  activar(id: string) {
    this.cargando = true;

    this._UsuariosService
      .activarUsuario(id)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => {
          this._AlertasService.showSuccess(
            'Usuario activado correctamente',
            'Éxito'
          );
          this.obtenerUsuarios(); // Refrescar la lista de usuarios
        },
        error: (error: any) => {
          this._AlertasService.showError(
            'No se pudo activar el usuario, intenta nuevamente',
            'Ocurrió un problema'
          );
          console.error(error);
        },
      });
  }

  eliminar(id: string) {
    this.cargando = true;

    this._UsuariosService
      .eliminarUsuario(id)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => {
          this._AlertasService.showSuccess(
            'Usuario eliminado correctamente',
            'Éxito'
          );
          this.obtenerUsuarios(); // Refrescar la lista de usuarios
        },
        error: (error: any) => {
          this._AlertasService.showError(
            'No se pudo eliminar el usuario, intenta nuevamente',
            'Ocurrió un problema'
          );
          console.error(error);
        },
      });
  }
}
