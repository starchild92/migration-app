import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnitsComponent } from './components/units/units.component';
import { CommunityComponent } from './components/community/community.component';
import { MainComponent } from '@components/main/main.component';
import { TopicsComponent } from '@components/topics/topics.component';
import { ResourcesComponent } from '@components/resources/resources.component';
import { EndComponent } from '@components/end/end.component';

const routes: Routes = [
    {
        path: 'main',
        component: MainComponent
	},
	{
        path: 'community',
        component: CommunityComponent
    },
	{
        path: 'units',
        component: UnitsComponent
	},
	{
        path: 'topics',
        component: TopicsComponent
	},
	{
        path: 'resources',
        component: ResourcesComponent
	},
	{
        path: 'end',
        component: EndComponent
    },
    {
        path: '**',
        redirectTo: '/main'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class appRouting { }
