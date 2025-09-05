import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter([
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent) },
            { path: 'aps', loadComponent: () => import('./pages/aps/aps.component').then(c => c.ApsComponent) },
            { path: 'materno', loadComponent: () => import('./pages/materno/materno.component').then(c => c.MaternoComponent) },
            { path: 'financas', loadComponent: () => import('./pages/financas/financas.component').then(c => c.FinancasComponent) },
            { path: 'determinantes', loadComponent: () => import('./pages/determinantes/determinantes.component').then(c => c.DeterminantesComponent) },
            { path: 'controle', loadComponent: () => import('./pages/controle/controle.component').then(c => c.ControleComponent) },
            { path: 'previne', loadComponent: () => import('./pages/previne/previne.component').then(c => c.PrevineComponent) },
            { path: 'qualidade', loadComponent: () => import('./pages/qualidade/qualidade.component').then(c => c.QualidadeComponent) },
            { path: 'faltantes', loadComponent: () => import('./pages/faltantes/faltantes.component').then(c => c.FaltantesComponent) }
        ]),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: 'none'
                }
            }
        })
    ]
};