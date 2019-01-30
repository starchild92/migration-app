import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { firebaseConfig } from '@env/environment';

import * as firebase from 'firebase/app';
firebase.initializeApp(firebaseConfig);

import { appRouting } from './app.routing';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { HttpClientModule } from '@angular/common/http';

import { MainService } from '@services/main.service';

import { AppComponent } from './app.component';
import { UnitsComponent } from '@components/units/units.component';
import { CommunityComponent } from '@components/community/community.component';
import { MainComponent } from '@components/main/main.component';
import { UnitDisplayComponent } from './components/dumb/unit-display/unit-display.component';
import { TopicsComponent } from './components/topics/topics.component';
import { TopicDisplayComponent } from './components/dumb/topic-display/topic-display.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { EndComponent } from './components/end/end.component';
import { FileSizePipe } from './pipes/filesize.pipe';

@NgModule({
	declarations: [
		AppComponent,
		UnitsComponent,
		CommunityComponent,
		MainComponent,
		UnitDisplayComponent,
		TopicsComponent,
		TopicDisplayComponent,
		ResourcesComponent,
		EndComponent,
		FileSizePipe
	],
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		AngularFirestoreModule,
		AngularFireStorageModule,
		HttpClientModule,
		NgxJsonViewerModule,
		appRouting
	],
	providers: [
		MainService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
