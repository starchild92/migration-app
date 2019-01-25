import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { appRouting } from './app.routing';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";

import { AppComponent } from './app.component';
import { firebase } from '../environments/environment';
import { UnitsComponent } from './components/units/units.component';
import { CommunityComponent } from './components/community/community.component';

@NgModule({
	declarations: [
		AppComponent,
		UnitsComponent,
		CommunityComponent
	],
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(firebase),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		AngularFirestoreModule,
		AngularFireStorageModule,
		appRouting
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
