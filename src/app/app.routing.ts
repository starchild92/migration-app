import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnitsComponent } from './components/units/units.component';
import { CommunityComponent } from './components/community/community.component';

const routes: Routes = [
    {
        path: '',
        component: CommunityComponent
	},
	{
        path: 'units',
        component: UnitsComponent
    },
    {
        path: '**',
        redirectTo: '/'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class appRouting { }
