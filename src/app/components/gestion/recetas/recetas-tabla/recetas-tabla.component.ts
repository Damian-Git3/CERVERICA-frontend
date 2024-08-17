import { Component, inject, OnInit } from '@angular/core';
import { RecetaService } from '../../../../services/receta/receta.service';
import { finalize } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { CompartidoService } from '../../../../services/compartido/compartido.service';
import { AlertasService } from '../../../../services/shared/alertas/alertas.service';

@Component({
  selector: 'app-recetas-tabla',
  templateUrl: './recetas-tabla.component.html',
  styleUrl: './recetas-tabla.component.css',
})
export class RecetasTablaComponent implements OnInit {
  public _CompartidoService = inject(CompartidoService);

  public recetas: any[] = [];
  public items: MenuItem[];
  public valorBuscado: string = '';
  constructor(
    private recetaService: RecetaService,
    private alertasService: AlertasService
  ) {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
  }

  public ngOnInit(): void {
    this.obtenerRecetas();
    
    this._CompartidoService.actualizarTitulo('Roles');
  }

  obtenerRecetas() {
    this.recetaService
      .obtener(this._CompartidoService.obtenerSesion().token)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (data: any) => {
          this.alertasService.showSuccess('Recetas obtenidas correctamente');
          this.recetas = data;
        },
        error: (error: any) => {
          this.alertasService.showError('Error al obtener las recetas');
          console.error(error);
        },
      });
  }

  activar(id: number) {
    this.recetaService
      .activar(id)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (data: any) => {
          this.alertasService.showSuccess('Desbloqueado');
          this.obtenerRecetas();
        },
        error: (error: any) => {
          this.alertasService.showError('Error al activar la receta');
        },
      });
  }

  desactivar(id: number) {
    this.recetaService
      .desactivar(id)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (data: any) => {
          this.alertasService.showSuccess('Bloqueado');
          this.obtenerRecetas();
        },
        error: (error: any) => {
          this.alertasService.showError('Error al desactivar la receta');
        },
      });
  }

  eliminar(id: number) {
    this.recetaService
      .eliminar(id)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (data: any) => {
          this.alertasService.showSuccess('Eliminado');
          this.obtenerRecetas();
        },
        error: (error: any) => {
          this.alertasService.showError('Error al eliminar');
        },
      });;
  }
}
