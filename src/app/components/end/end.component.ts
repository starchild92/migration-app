import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { MainService } from '@services/main.service';
import { Community } from '@classes/community';
import { Section } from '@classes/section';
import { AngularFirestore } from 'angularfire2/firestore';
import { PATHS, STORE } from '@env/environment';
import { tap } from 'rxjs/operators';

import * as firebase from 'firebase/app';
import { Topic } from '@classes/topic';
import { Resource } from '@classes/resource';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { promise } from 'protractor';
import { resolve } from 'dns';

@Component({
	selector: 'app-end',
	templateUrl: './end.component.html',
	styleUrls: ['./end.component.scss']
})
export class EndComponent implements OnInit {

	@ViewChild('ul') ul: ElementRef;

	community: Community
	sections: Array<Section>
	snapshot: Observable<any>;

	task: AngularFireUploadTask;

	constructor(
		private _mainService: MainService,
		private renderer: Renderer,
		private _afs: AngularFirestore,
		private http: HttpClient,
		private storage: AngularFireStorage
	) {
		this.sections = []
	}

	ngOnInit() {
		this.ul.nativeElement.add
		this._mainService.currentCommunity.subscribe(com => {
			this.community = com
			this._mainService.getSections().then(sec => {
				this.sections = sec;

				console.log(this.sections)

				this.starUploadProcess()
			})
		})
	}

	starUploadProcess() {
		this.append('Se está inciando el proceso de carga ....', 'primary')
		this._afs.collection(PATHS.Community).doc(this.community._key).set(this.community.serialize()).then(() => {
			this.append('Se creó la comunidad', 'info')

			let promesas: Array<Promise<any>> = []
			let promesasUnidades: Array<Promise<any>> = []
			let promesasTopics: Array<Promise<any>> = []

			this.sections.forEach(unit => {
				promesas.push(new Promise((resolve, reject) => {
					this._afs.collection(PATHS.Units).doc(unit._key).set(unit.toFirebaseObject()).then(() => {
						this.append(`- Creando la unidad: "${unit._title}"`, 'info')

						promesasUnidades = []
						const topics = unit._topics
						const files = unit._files
						topics.forEach(topic => {
							promesasUnidades.push(new Promise((resolve, reject) => {
								this._afs.collection(PATHS.Topics).doc(topic._key).set(topic.toFirestoreObject()).then(() => {
									this.append(`- - Se creó el topic: "${topic._name}"`, 'info')

									promesasTopics = []
									const resources = topic._resources
									if (resources) {
										resources.forEach(res => {
											promesasTopics.push(new Promise((resolve, reject) => {
												this.append(`<small>- - - Subiendo archivo: "${res._name}"</small>`, 'light')

												this.http.get(res._localPath, { responseType: 'blob' }).subscribe(data => {
													var metadata = { contentType: res._typeFile };
													const storageRef = firebase.storage().ref(`${STORE.Resources}/${res._key}`);
													const uploadTask = storageRef.child(res._key).put(data, metadata);

													uploadTask.then(snap => {
														this.append(`<small>- - - "${res._name}" completado</small>`, 'light')
														const url = snap.downloadURL;
														resolve(url);
													});

													const next = snapshot => {
														const progress = snapshot["bytesTransferred"] / snapshot["totalBytes"] * 100;
													};

													const err = mir => {
														reject(mir);
													};

													const subscribe = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED);
													subscribe(next, err);
												});
											}));
										});
									}
									Promise.all(promesasTopics).then((val) => {
										this.append(`- - Subidos los archivos de "${topic._name}"`, 'success')
										resolve(val)
									});
								});
							}));
						});
						if (files) {
							if (files.length > 0) {
								const file = files[0]
								promesasUnidades.push(new Promise(resolve => {
									this.append(`<small>- - Subiendo img del topic: "${file._name}"</small>`, 'warning')
									this.http.get(file._localPath, { responseType: 'blob' }).subscribe(data => {
										var metadata = { contentType: file._typeFile };
										const storageRef = firebase.storage().ref(`${STORE.Topics}/${unit._key}`);
										const uploadTask = storageRef.child(unit._key).put(data, metadata);

										uploadTask.then(snap => {
											this.append(`<small>- - "${file._name}" completado</small>`, 'warning')
											const url = snap.downloadURL;
											resolve(url);
										});

										const next = snapshot => {
											const progress = snapshot["bytesTransferred"] / snapshot["totalBytes"] * 100;
										};

										const err = mir => {
											reject(mir);
										};

										const subscribe = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED);
										subscribe(next, err);
									});
								}))
							}
						}
						Promise.all(promesasUnidades).then((val) => {
							this.append(`- Se crearon todos los topics de "${unit._title}"`, 'success')
							resolve(val)
						});

					});
				}));
			});

			Promise.all(promesas).then((value) => {
				console.log(value)
				this.append(`Se crearon todas las unidades`, 'success')
				this.append(`El proceso de carga a Finalizado ...`, 'dark')
			});

		}, error => {
			console.log('algo malo pasó insertando la comunidad', error);
		})
	}

	append(message: string, cls: string) {
		this.renderer.invokeElementMethod(this.ul.nativeElement, 'insertAdjacentHTML', ['afterbegin', `<div class="alert alert-${cls} p-0 px-2 mb-1">${message}</div>`]);
	}
}
