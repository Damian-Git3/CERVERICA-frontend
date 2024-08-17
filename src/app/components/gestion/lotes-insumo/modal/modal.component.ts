import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { LoteInsumoDTO } from '../../../../interfaces/lotes-insumo/lote-insumo-dto';
import { Dialog } from 'primeng/dialog';
import { LotesInsumoService } from '../../../../services/lotes-insumo/lotes-insumo.service';
import { AlertasService } from '../../../../services/shared/alertas/alertas.service';
import { CompartidoService } from '../../../../services/compartido/compartido.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UsuarioDTO } from '../../../../interfaces/usuarios/usuario-dto';
import { CrearLoteInsumoDTO } from '../../../../interfaces/lotes-insumo/crear-lote-insumo-dto';
import { finalize } from 'rxjs';
import { EditarLoteInsumoDTO } from '../../../../interfaces/lotes-insumo/editar-lote-insumo-dto';
import { ProveedoresService } from '../../../../services/proveedores/proveedores.service';
import { Proveedor } from '../../../../interfaces/proveedores/proveedor';
import { InsumosService } from '../../../../services/insumos/insumos.service';
import { IInsumo } from '../../../../interfaces/insumo.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Output() reload: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal!: Dialog;

  _LotesInsumoService = inject(LotesInsumoService);
  _InsumosService = inject(InsumosService);
  _ProveedoresService = inject(ProveedoresService);
  _AlertasService = inject(AlertasService);
  _CompartidoService = inject(CompartidoService);
  _FormBuilder = inject(FormBuilder);

  public mostrarModal: boolean = false;
  public nuevo: boolean = false;
  public cargando: boolean = false;
  public mensajesError: string = '';
  public loteInsumoSeleccionado!: LoteInsumoDTO;
  minDate: Date = new Date();

  proveedores!: Proveedor[];
  insumos!: IInsumo[];

  ngOnInit(): void {
    this.obtenerProveedores();
    this.obtenerInsumos();
  }

  crearForm: FormGroup = this._FormBuilder.group({
    proveedor: [, Validators.required],
    insumo: [, Validators.required],
    fechaCaducidad: [, Validators.required],
    cantidad: ['', Validators.required],
    montoCompra: ['', Validators.required],
  });

  editarForm: FormGroup = this._FormBuilder.group({
    fechaCaducidad: ['', Validators.required],
    cantidad: ['', Validators.required],
    montoCompra: ['', Validators.required],
  });

  show(loteInsumo?: LoteInsumoDTO) {
    this.mostrarModal = true;
    if (loteInsumo) {
      this.modal.header = 'Editar lote insumo';
      this.nuevo = false;
      this.loteInsumoSeleccionado = loteInsumo;
    } else {
      this.modal.header = 'Crear lote insumo';
      this.nuevo = true;
    }
  }

  registrar() {
    this.cargando = true;

    let objetoNuevo: CrearLoteInsumoDTO = {
      idProveedor: this.crearForm.value.proveedor.id,
      idInsumo: this.crearForm.value.insumo.id,
      fechaCaducidad: this.crearForm.value.fechaCaducidad,
      cantidad: this.crearForm.value.cantidad,
      montoCompra: this.crearForm.value.montoCompra,
    };

    this._LotesInsumoService
      .crearLoteInsumo(objetoNuevo)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => {
          this._AlertasService.showSuccess(
            'EL lote insumo fue guardado exitosamente',
            'Lote insumo guardado'
          );
          this.reload.emit();
          this.mostrarModal = false;
        },
        error: (error: any) => {
          if (error.status == 400) {
            this._AlertasService.showInfo(
              'Verifica los mensajes e intenta de nuevo',
              'Ocurrió un problema'
            );

            this.mensajesError =
              this._CompartidoService.extraerMensajesCodigo400(error.error);
          } else {
            this._AlertasService.showError(
              'No se pudo guardar el lote insumo vuelve a intentarlo',
              'Ocurrió un problema'
            );
          }
          console.error(error);
        },
      });
  }

  get minFractionDigits(): number {
    return this.crearForm.value.insumo?.unidadMedida === 'PZ' ? 0 : 2;
  }

  editar() {
    this.cargando = true;

    let objetoEditar: EditarLoteInsumoDTO = {
      fechaCaducidad: this.crearForm.value.fechaCaducidad,
      cantidad: this.crearForm.value.cantidad,
      montoCompra: this.crearForm.value.fechaCaducidad,
    };

    this._LotesInsumoService
      .editarLoteInsumo(this.loteInsumoSeleccionado.id, objetoEditar)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => {
          this._AlertasService.showSuccess(
            'EL lote insumo fue editado exitosamente',
            'Lote insumo editado'
          );
          this.reload.emit();
          this.mostrarModal = false;
        },
        error: (error: any) => {
          if (error.status == 400) {
            this._AlertasService.showInfo(
              'Verifica los mensajes e intenta de nuevo',
              'Ocurrió un problema'
            );

            this.mensajesError =
              this._CompartidoService.extraerMensajesCodigo400(error.error);
          } else {
            this._AlertasService.showError(
              'No se pudo guardar el lote insumo vuelve a intentarlo',
              'Ocurrió un problema'
            );
          }
          console.error(error);
        },
      });
  }

  hide() {
    this.mostrarModal = false;
  }

  obtenerProveedores() {
    this.cargando = true;

    this._ProveedoresService
      .obtenerProveedores()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (proveedores: Proveedor[]) => {
          this.proveedores = proveedores;
        },
        error: (error: any) => {
          this._AlertasService.showError(
            'No se pudo obtener los proveedores, intenta nuevamente',
            'Ocurrió un problema'
          );
          console.error(error);
        },
      });
  }

  obtenerInsumos() {
    this.cargando = true;

    this._InsumosService
      .obtener()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (insumos) => {
          this.insumos = insumos;
        },
        error: (error: any) => {
          this._AlertasService.showError(
            'No se pudo obtener los insumos, intenta nuevamente',
            'Ocurrió un problema'
          );
          console.error(error);
        },
      });
  }
}