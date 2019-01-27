import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';
import { Section } from '@classes/section';
import { HttpClient } from '@angular/common/http';
import { BACKUP_SOURCE } from '@env/environment';
import { AngularFireDatabase } from 'angularfire2/database';
import { Community } from '@classes/community';

var xml2js = require('xml2js');

@Component({
	selector: 'app-units',
	templateUrl: './units.component.html',
	styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

	filesXML: any;
	questionsXML: any;

	community: Community
	sections: Array<Section> = []
	continue: boolean = false

	constructor(
		private _mainService: MainService,
		private http: HttpClient,
		private _db: AngularFireDatabase
	) { }

	ngOnInit() {
		this._mainService.currentFileSchema.subscribe(files => {
			this.filesXML = files;
			console.log('Archivos Cargados');
			this._mainService.currentQuestions.subscribe(questions => {
				this.questionsXML = questions;
				console.log('Preguntas Cargadas');
				this._mainService.currentCommunity.subscribe(comm => {
					this.community = comm;
					console.log('Cominidad Cargada');
					this._mainService.getSections().then(sections => {
						this.sections = sections
						this.processSections()
					})
				});
			});
		});
	}

	processSections() {
		let parser = new xml2js.Parser();
		const http = this.http;
		const comm = this.community;

		// Procesando cada sección para obtener su informacion
		this.sections.forEach(section => {
			const newRef = this._db.database.app.database().ref().push();

			this.http.get(`${BACKUP_SOURCE}/${section._path}/section.xml`, { responseType: 'text' }).subscribe(data => {
				parser.parseString(data, function (err, resp) {
					let sec = resp['section'];
					flatThat(sec)

					section.$key = newRef.key
					section.$keyCommunity = comm._key
					section.$index = sec['number']
					section.$name = sec['name']
					section.$summary = sec['summary']
					section.$preUnits = sec['sequence'].split(',')
					section.$preRequisite = Boolean(sec['visible'])
					section.$totalTopic = section._activities.length

					http.get(`${BACKUP_SOURCE}/${section._path}/inforef.xml`, { responseType: 'text' }).subscribe(inforef => {
						parser.parseString(inforef, function (err, resp) {
							let references = resp['inforef']['fileref']
							if (references) {
								references = references[0]
								if (references) {
									references = references['file']
									flatThat(references)
									references.forEach(rf => {
										section.$fileReferences = rf['id'][0]
									});
								}
							}
						});
					});

				});
			});
		});
		console.log(this.sections)
		this._mainService.updateSections(this.sections)
		this.continue = true
	}
}
export function flatThat(main) {
	Object.keys(main).forEach(key => {
		if (main[key].length == 1) { main[key] = main[key][0]; }
		if (key == '$') { main['id'] = main[key]['id']; delete main[key]; }
	});
}
