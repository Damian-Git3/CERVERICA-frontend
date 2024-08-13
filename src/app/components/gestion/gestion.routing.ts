import { Routes, RouterModule } from '@angular/router';
import { GestionComponent } from './gestion.component';
import { MenuComponent } from './menu/menu.component';
import { ProduccionesModule } from './producciones/producciones.module';
import { InsumosModule } from './insumos/insumos.module';

const routes: Routes = [
  {
    path: '',
    component: GestionComponent,
    children: [
      {
        path: 'producciones',
        loadChildren: () => ProduccionesModule
      },
      {
        path: 'insumos',
        loadChildren: () => InsumosModule
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

export const GestionRoutes = RouterModule.forChild(routes);
