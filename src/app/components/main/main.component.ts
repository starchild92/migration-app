import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';
import { Community } from '@classes/community';
import { GRIKY_UID, BACKUP_SOURCE, HARD_CODED } from '@env/environment';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';

var xml2js = require('xml2js');
import { remove, findIndex } from 'lodash';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	main: any = {};
	canGo: boolean = false
	newRef: any = null

	Areas: Array<any>[] = [];
	Carreras: Array<any>[] = [];
	CarrerasFiltered: Array<any>[] = [];

	constructor(
		private _mainService: MainService,
		private _db: AngularFireDatabase,
		private _afs: AngularFirestore,
		private http: HttpClient
	) {
		this.newRef = this._db.database.app.database().ref().push();
	}

	ngOnInit() {
		let parser = new xml2js.Parser();
		let serv = this._mainService;

		this._afs.collection('user').doc(GRIKY_UID).ref.get().then(data => {
			if (data.exists) {
				this.http.get(`${BACKUP_SOURCE}/moodle_backup.xml`, { responseType: 'text' }).subscribe(data => {
					parser.parseString(data, function (err, resp) {
						let main = resp['moodle_backup']['information'][0];
						flatThat(main)
						serv.updateMain(main);
					});
				});

				this.getAreasCarreras().then(() => {
					this._mainService.currentFile.subscribe(val => {
						this.main = val;

						if (val['name']) {

							var courseXML: any = {}

							this.http.get(`${BACKUP_SOURCE}/course/course.xml`, { responseType: 'text' }).subscribe(data => {
								parser.parseString(data, function (err, resp) {
									courseXML = resp['course'];
									flatThat(courseXML)
								});

								let community = new Community();

								community.$key = this.newRef.key;
								community.$name = courseXML['fullname'];
								community.$shortname = courseXML['shortname'];
								community.$uid = GRIKY_UID;
								community.$urlPhoto = HARD_CODED.Community;
								community.$resume = courseXML['summary'];

								this.http.get(`${BACKUP_SOURCE}/files.xml`, { responseType: 'text' }).subscribe(data => {
									parser.parseString(data, function (err, resp) {
										let file = resp['files']['file'];
										flatThatFile(file)
										remove(file, function (f) { return Number(f['filesize']) == 0 })
										remove(file, function (f) { return String(f['filename']).includes('First_Frame') })
										serv.updateFile(file);
									});

									this.http.get(`${BACKUP_SOURCE}/questions.xml`, { responseType: 'text' }).subscribe(data => {
										parser.parseString(data, function (err, resp) {
											let questions = resp['question_categories']['question_category'];
											if (questions) {
												flatThatQuestions(questions)
											} else {
												console.warn('No hay preguntas en este curso.')
												questions = [];
											}
											serv.updateQuestions(questions);
										});

										this.canGo = true;
									});
								});

								this._mainService.updateCommunity(community);

							});
						}
					});
				});
			} else {
				window.alert('No existe un GRIKY con ese UID. Revisa ENV')
			}
		});
	}

	getAreasCarreras(): Promise<any> {
		return new Promise((resolve, reject) => {
			this._db.database.ref('/areas').once('value', snap => {
				Object.keys(snap.val()).forEach(key => { this.Areas.push(snap.val()[key]) });

				this._db.database.ref('/carreras').once('value', sack => {
					Object.keys(sack.val()).forEach(key => { this.Carreras.push(sack.val()[key]) });

					// organizando
					this.Carreras.forEach(c => {
						let index = findIndex(this.Areas, function (a) { return a['id'] == c['area'] });
						if (index > -1) {
							if (this.Areas[index]['carreras']) {
								this.Areas[index]['carreras'].push(c)
							} else {
								this.Areas[index]['carreras'] = []
								this.Areas[index]['carreras'].push(c)
							}
						}
					});
					this._mainService.updateAreas(this.Areas)
					resolve('Done')
				}, (error) => {
					window.alert('Parece que no hay carreras para las areas encontradas!')
				});
			}, (error) => {
				window.alert('Parece que no existen areas en el proyecto!')
			});
		})
	}

}
export function flatThat(main) { Object.keys(main).forEach(key => { if (main[key].length == 1) { main[key] = main[key][0]; } }); }
export function flatThatFile(all) {
	all.forEach(file => {
		Object.keys(file).forEach(key => {
			if (file[key].length == 1) { file[key] = file[key][0]; }
			if (key == '$') { file['id'] = file['$']['id']; delete file[key]; }
		});
	});
}
export function flatThatQuestions(all) {
	all.forEach(question => {
		Object.keys(question).forEach(key => {
			if (key === 'questions') {
				if (question[key]) {
					if (question[key].length > 0) {
						if (question[key][0]['question']) {
							question[key][0]['question'].forEach(q => {
								Object.keys(q).forEach(index => {
									if (q[index].length == 1) { q[index] = q[index][0]; }
									if (index === '$') { q['id'] = q[index]['id']; delete q[index]; }
								});
							});
							question[key] = question[key][0]['question'];
						}
					}
				}
			}
			if (question[key].length == 1) { question[key] = question[key][0]; }
			if (key === '$') { question['id'] = question[key]['id']; delete question[key]; }
		});
	});
}
