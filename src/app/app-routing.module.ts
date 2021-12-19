import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGaurd } from './shared/services/auth.gaurd';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
// tslint:disable-next-line: max-line-length
import { AdminLayoutSidebarCompactComponent } from './shared/components/layouts/admin-layout-sidebar-compact/admin-layout-sidebar-compact.component';
// tslint:disable-next-line: max-line-length
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';

const adminRoutes: Routes = [
    {
      path: 'dashboard',
      loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
      path: 'storeditems',
      loadChildren: () => import('./views/storeditems/item.module').then(m => m.ItemModule)
    },
    {
      path: 'stockhistory',
      loadChildren: () => import('./views/stockhistory/stockhistory.module').then(m => m.StockHistoryModule)
    },
    {
      path: 'locations',
      loadChildren: () => import('./views/locations/locations.module').then(m => m.LocationsModule)
    },
    {
      path: 'companies',
      loadChildren: () => import('./views/companies/companies.module').then(m => m.CompaniesModule)
    },
    {
      path: 'reports',
      loadChildren: () => import('./views/reports/reports.module').then(m => m.ReportsModule)
    },
    {
      path: 'categories',
      loadChildren: () => import('./views/categories/categories.module').then(m => m.CategoriesModule)
    },
    {
      path: 'uikits',
      loadChildren: () => import('./views/ui-kits/ui-kits.module').then(m => m.UiKitsModule)
    },
    {
      path: 'forms',
      loadChildren: () => import('./views/forms/forms.module').then(m => m.AppFormsModule)
    },
    {
      path: 'invoice',
      loadChildren: () => import('./views/invoice/invoice.module').then(m => m.InvoiceModule)
    },
    {
      path: 'inbox',
      loadChildren: () => import('./views/inbox/inbox.module').then(m => m.InboxModule)
    },
    {
      path: 'calendar',
      loadChildren: () => import('./views/calendar/calendar.module').then(m => m.CalendarAppModule)
    },
    {
      path: 'chat',
      loadChildren: () => import('./views/chat/chat.module').then(m => m.ChatModule)
    },
    {
      path: 'tables',
      loadChildren: () => import('./views/data-tables/data-tables.module').then(m => m.DataTablesModule)
    },
    {
      path: 'profile',
      loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule)
    },
    {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
    },
    {
      path: 'stockTransTypes',
      loadChildren: () => import('./views/stockTransTypes/stockTransTypes.module').then(m => m.StockTransTypesModule)
    },
    {
      path: 'timeouts',
      loadChildren: () => import('./views/timeouts/timeouts.module').then(m => m.TimeOutModule)
    },
    {
      path: 'brands',
      loadChildren: () => import('./views/brands/brands.module').then(m => m.BrandsModule)
    },
    {
      path: 'itemtypes',
      loadChildren: () => import('./views/itemtypes/itemtypes.module').then(m => m.ItemtypesModule)
    },
    {
      path: 'itemkinds',
      loadChildren: () => import('./views/itemkinds/itemkinds.module').then(m => m.ItemkindsModule)
    },
    {
      path: 'locationTypes',
      loadChildren: () => import('./views/locationTypes/locationTypes.module').then(m => m.LocationTypesModule)
    },
    {
      path: 'sub-users',
      loadChildren: () => import('./views/sub-users/sub-users.module').then(m => m.SubUserModule)
    }
  ];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule)
      }
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'others',
        loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule)
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutSidebarLargeComponent,
    canActivate: [AuthGaurd],
    children: adminRoutes
  },
  {
    path: '**',
    redirectTo: 'others/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
