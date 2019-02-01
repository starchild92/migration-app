import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { MainService } from '@services/main.service';
import { Community } from '@classes/community';
import { Section } from '@classes/section';
import { AngularFirestore } from 'angularfire2/firestore';
import { PATHS, STORE } from '@env/environment';

import * as firebase from 'firebase/app';

import { HttpClient } from '@angular/common/http';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Resource } from '@classes/resource';
import { Topic } from '@classes/topic';

@Component({
	selector: 'app-end',
	templateUrl: './end.component.html',
	styleUrls: ['./end.component.scss']
})
export class EndComponent implements OnInit {

	@ViewChild('ul') ul: ElementRef;

	community: Community
	sections: Array<Section>

	snapshot: any;
	progress: any = 0;
	task: AngularFireUploadTask;

	final = []

	constructor(
		private _mainService: MainService,
		private renderer: Renderer,
		private _afs: AngularFirestore,
		private _fsg: AngularFireStorage,
		private http: HttpClient
	) {
		this.sections = []

		// 1 hour max upload retry time
		this._fsg.storage.setMaxUploadRetryTime(3600000)
		this._fsg.storage.setMaxOperationRetryTime(3600000)
	}

	ngOnInit() {
		this.ul.nativeElement.add
		this._mainService.currentCommunity.subscribe(com => {
			this.community = com

			console.log('<COMUNIDAD>', com)

			this._mainService.getSections().then(sec => {
				this.sections = sec;

				console.log('<UNIDADES>', this.sections)

				this.uploadOneByOne()
			})
		});
	}

	asyncUploadIndividualResource(res: Resource) {
		return new Promise((resolve) => {
			if (res._localPath) {
				this.http.get(res._localPath, { responseType: 'blob' }).subscribe(data => {
					var metadata = { contentType: res._typeFile };
					const storageRef = this._fsg.storage.ref(`${STORE.Resources}/${res._key}`);
					const uploadTask = storageRef.child(res._key).put(data, metadata);

					this.append(`<small>- - - Enviando recurso "${res._name}" a Firestorage</small>`, 'warning');

					uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
						(snapshot) => {
							this.snapshot = snapshot
							this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
							this.progress = this.progress.toFixed(2);
							console.log(`( ${this.progress} % ) ${res._name}`);
						}, (error) => {
							console.warn(error)
							this.append(`<small>Hubo un error enviando el recurso "${res._name}" a Firestorage</small>`, 'danger')
							resolve(false)
						}, () => {
							this.append(`<small>- - - Recurso "${res._name}" envidado a Firestorage</small>`, 'light')
							uploadTask.snapshot.ref.getDownloadURL().then(url => {
								res.$previewImage = url
								res.$urlFile = url
								this._afs.collection(PATHS.Resources).doc(res._key).set(res.toFirebaseObj()).then(() => {
									this.append(`<small>- - - Firestore: "${res._name}", recurso creado</small>`, 'light')
									resolve(res)
								}, () => {
									this.append(`Hubo un error creando el recurso "${res._name}" en Firestore`, 'danger')
									resolve(res)
								})
							})
						});
				});
			} else {
				this._afs.collection(PATHS.Resources).doc(res._key).set(res.toFirebaseObj()).then(() => {
					this.append(`<small>- - - "${res._name}" recurso creado</small>`, 'light')
					resolve(res)
				}, () => {
					this.append(`Hubo un error creando el recurso "${res._name}"`, 'danger')
					resolve(res)
				})
			}
		})
	}

	asyncUploadIndividualResourceTopics(topic: Topic) {
		return new Promise((resolve) => {
			this.append(`<small>- - - Subiendo img del topico: "${topic._name}"</small>`, 'light');
			if (topic['file']) {
				const res = topic['file']
				if (res._localPath) {
					this.http.get(res._localPath, { responseType: 'blob' }).subscribe(data => {
						var metadata = { contentType: res._typeFile };
						const storageRef = this._fsg.storage.ref(`${STORE.Topics}/${topic._key}`);
						const uploadTask = storageRef.child(topic._key).put(data, metadata);

						this.append(`<small>- - - Enviando recurso "${res._name}" a Firestorage</small>`, 'warning');

						uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
							(snapshot) => {
								this.snapshot = snapshot
								this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
								this.progress = this.progress.toFixed(2)
								console.log(`( ${this.progress} % ) ${res._name}`);
							},
							(error) => {
								console.warn(error)
								this.append(`<small>Hubo un error subiendo la imagen "${res._name}" del topico "${topic._name}"</small>`, 'danger')
								resolve(false)
							},
							() => {
								this.append(`<small>- - - Imagen del topico "${topic._name}" completado</small>`, 'light')
								uploadTask.snapshot.ref.getDownloadURL().then(url => {
									topic.$urlImage = url
									topic.$nameImage = res._name
									this._afs.collection(PATHS.Topics).doc(topic._key).set(topic.toFirestoreObject()).then(() => {
										this.append(`<small>- - - Topico: "${topic._name}" creado</small>`, 'light')
										resolve(topic)
									}, () => {
										this.append(`Hubo un creando el topico "${topic._name}"`, 'danger')
										resolve(false)
									})
								});
							});
					});
				} else {
					this._afs.collection(PATHS.Topics).doc(topic._key).set(topic.toFirestoreObject()).then(() => {
						this.append(`<small>- - - Topico: "${topic._name}" creado</small>`, 'light')
						resolve(topic)
					}, () => {
						this.append(`Hubo un creando el topico "${topic._name}"`, 'danger')
						resolve(false)
					})
				}
			} else {
				this._afs.collection(PATHS.Topics).doc(topic._key).set(topic.toFirestoreObject()).then(() => {
					this.append(`<small>- - - Topico: "${topic._name}" creado</small>`, 'light')
					resolve(topic)
				}, () => {
					this.append(`Hubo un creando el topico "${topic._name}"`, 'danger')
					resolve(false)
				})
			}
		})
	}

	workMyCollection(arr: Array<Resource>) {
		return arr.reduce((promise, item) => {
			return promise
				.then(() => {
					return this.asyncUploadIndividualResource(item).then(result => this.final.push(result));
				})
				.catch(console.error);
		}, Promise.resolve());
	}

	workMyCollectionTopics(arr: Array<Topic>) {
		return arr.reduce((promise, item) => {
			return promise
				.then(() => {
					return this.asyncUploadIndividualResourceTopics(item).then(result => this.final.push(result));
				})
				.catch(console.error);
		}, Promise.resolve());
	}

	uploadOneByOne() {
		const recursos: Array<Resource> = [];
		const allTopics: Array<Topic> = [];

		this.append(`Iniciando subida de elementos ....`, 'primary')
		this.append(`Subiendo recursos de la comunidad`, 'info')

		// Obteniendo los archivos que se van a subir para obter el enlace
		this.sections.forEach(unit => {
			const topics = unit._topics
			topics.forEach(topic => {
				const resources = topic._resources
				if (resources) {
					resources.forEach(res => {
						recursos.push(res)
					});
				}
			});
		});

		this.workMyCollection(recursos).then(() => {
			this.append(`Proceso de subida de recursos finalizado..!`, 'success')
			this.append(`Creando los topicos`, 'warning')

			this.sections.forEach(unit => {
				const topics = unit._topics
				const files = unit._files
				topics.forEach(topic => {
					if (files) {
						if (files.length > 0) {
							const res = files[0];
							topic['file'] = res;
						}
					}
					allTopics.push(topic);
				});
			});

			this.workMyCollectionTopics(allTopics).then(() => {
				this.append(`Todos los topicos creados`, 'primary')
				this.append(`Creando las unidades`, 'warning')

				let promesasUnidades: Array<Promise<any>> = []
				this.sections.forEach(unit => {
					promesasUnidades.push(new Promise((resolve) => {
						this._afs.collection(PATHS.Units).doc(unit._key).set(unit.toFirebaseObject()).then(() => {
							this.append(`- La unidad: "${unit._title}" fue creada`, 'info')
							resolve(unit)
						}), () => {
							this.append(`Error creando la unidad "${unit._title}"`, 'danger')
							resolve(false)
						};
					}));
				});

				Promise.all(promesasUnidades).then(() => {
					this.append(`Todos las unidades creadas`, 'primary')
					this.append(`Creando la Comunidad`, 'warning')

					this._afs.collection(PATHS.Community).doc(this.community._key).set(this.community.serialize()).then(() => {
						this.append(`Se creó la comunidad "${this.community._name}"`, 'info')
						this.append(`El proceso de carga a Finalizado ...`, 'dark')
						this.snapshot = null;
					}, () => {
						this.append(`Error creando la comunidad "${this.community._name}"`, 'danger')
					});
				});
			});
		});
	}

	append(message: string, cls: string) {
		this.renderer.invokeElementMethod(this.ul.nativeElement, 'insertAdjacentHTML', ['afterbegin', `<div class="alert alert-${cls} p-0 px-2 mb-1">${message}</div>`]);
	}
}
