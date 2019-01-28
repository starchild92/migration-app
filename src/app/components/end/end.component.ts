import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { MainService } from '@services/main.service';
import { Community } from '@classes/community';
import { Section } from '@classes/section';
import { AngularFirestore } from 'angularfire2/firestore';
import { PATHS } from '@env/environment';

import * as firebase from 'firebase/app';
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

	constructor(
		private _mainService: MainService,
		private renderer: Renderer,
		private _afs: AngularFirestore
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
		this.append('Se está inciando el proceso de carga ....')
		this._afs.collection(PATHS.Community).doc(this.community._key).set(this.community.serialize()).then(() => {
			this.append('Se creó la comunidad')

			let promesas: Array<Promise<any>> = []
			this.sections.forEach(unit => {

				promesas.push(new Promise((resolve, reject) => {
					this._afs.collection(PATHS.Units).doc(unit._key).set(unit.toFirebaseObject()).then(() => {
						this.append(`Se creo la unidad: "${unit._title}"`)
						resolve(true)
					}, error => {
						reject(error)
					});
				}));
			});

			Promise.all(promesas).then((value) => {

				this.append(`Se crearon todas las unidades`)
				this.append(`Creando Topics`)

				promesas = []

				this.sections.forEach(unit => {
					const topics = unit._topics
					topics.forEach(topic => {
						let obj: Topic = topic.toFirestoreObject()
						Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])

						promesas.push(new Promise((resolve, reject) => {
							this._afs.collection(PATHS.Topics).doc(topic._key).set(obj).then(() => {
								this.append(`Se creó el topic: "${topic._name}"`)
								resolve(true)
							}, error => {
								reject(error)
							});
						}));

					});
				});

				Promise.all(promesas).then((value) => {

					this.append(`Se crearon todos los topicos`)
					this.append(`Subiendo recursos (archivos) ...`)

				});

			});

		}, error => {
			console.log('algo malo pasó insertando la comunidad', error);
		})
	}

	append(message: string) {
		this.renderer.invokeElementMethod(this.ul.nativeElement, 'insertAdjacentHTML', ['beforeend', `<li>${message}</li>`]);
	}

	uploadFile(base64: string, path: string, name: string, progres?: (pro: number) => void): Promise<string> {
		return new Promise((resolve, reject) => {
			if (base64.length < 500) {
				resolve(base64)
			} else {
				const storageRef = firebase.storage().ref(path);
				const file = this.dataURItoBlob(base64);
				const uploadTask = storageRef.child(name).put(file);
				uploadTask.then(snap => {
					const url = snap.downloadURL;
					resolve(url);
				});

				const next = snapshot => {
					const progress = snapshot["bytesTransferred"] / snapshot["totalBytes"] * 100;
					if (progres != null) {
						progres(progress);
					}
				};

				const err = mir => {
					reject(mir);
				};

				const subscribe = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED);
				subscribe(next, err);
			}
		});
	}

	private dataURItoBlob(dataURI: string): Blob {
		const arr = dataURI.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1])
		let n = bstr.length
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	}

}
