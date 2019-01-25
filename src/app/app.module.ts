import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { appRouting } from './app.routing';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";

import { MainService } from '@services/main.service';

import { AppComponent } from './app.component';
import { UnitsComponent } from '@components/units/units.component';
import { CommunityComponent } from '@components/community/community.component';
import { MainComponent } from '@components/main/main.component';
import { firebase } from '@env/environment';

@NgModule({
	declarations: [
		AppComponent,
		UnitsComponent,
		CommunityComponent,
		MainComponent
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
	providers: [
		MainService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
