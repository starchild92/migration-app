import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';
import { Section } from '@classes/section';
import { HttpClient } from '@angular/common/http';
import { BACKUP_SOURCE, GRIKY_UID } from '@env/environment';
import { AngularFireDatabase } from 'angularfire2/database';
import { Community } from '@classes/community';

var xml2js = require('xml2js');
import { filter, remove } from 'lodash';
import { Resource } from '@classes/resource';
import { Topic } from '@classes/topic';

@Component({
	selector: 'app-units',
	templateUrl: './units.component.html',
	styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

	filesXML: any;

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
			this._mainService.currentCommunity.subscribe(comm => {
				this.community = comm;
				this._mainService.getSections().then(sections => {
					this.sections = sections
					this.processSections()
				});
			});
		});
	}

	processSections() {
		let parser = new xml2js.Parser();
		const http = this.http;
		const comm = this.community;
		const filesXML = this.filesXML;

		// Procesando cada sección para obtener su informacion
		this.sections.forEach(section => {
			const newRef = this._db.database.app.database().ref().push();

			http.get(`${BACKUP_SOURCE}/${section._path}/section.xml`, { responseType: 'text' }).subscribe(data => {
				parser.parseString(data, (err, resp) => {
					let sec = resp['section'];

					flatThat(sec)

					if (sec['name']) {
						sec['name'] = String(sec['name']).trim()
						if (sec['name'] == '$@NULL@$') { sec['name'] = `Unidad ${sec['number']}`; console.warn(`Se renombro la sección...`); }
						if (sec['name'] == ' ') { sec['name'] = `Unidad ${sec['number']}`; console.warn(`Se renombro la sección...`); }
						if (sec['name'] == '') { sec['name'] = `Unidad ${sec['number']}`; console.warn(`Se renombro la sección...`); }
					} else {
						sec['name'] = `Unidad ${sec['number']}`
					}

					section.$key = newRef.key
					section.$keyCommunity = comm._key
					section.$index = sec['number']
					section.$name = sec['name']
					section.$summary = sec['summary']
					section.$preUnits = sec['sequence'].split(',');
					// visible
					section.$preRequisite = (sec['visible'] == '1') ? true : false;

					// if (section._activities) {
					// 	section.$totalTopic = section._activities.length
					// } else { section.$totalTopic = 0; }

					// Para obtener la referencias de los archivos
					http.get(`${BACKUP_SOURCE}/${section._path}/inforef.xml`, { responseType: 'text' }).subscribe(inforef => {
						parser.parseString(inforef, (err, resp) => {
							let references = resp['inforef']['fileref']
							if (references) {
								references = references[0]
								if (references) {
									references = references['file']
									flatThat(references)

									let initialTopic = new Topic()
									const newRefe = this._db.database.app.database().ref().push();

									initialTopic.$key = newRefe.key
									initialTopic.$index = 0
									initialTopic.$keyCommunity = section._keyCommunity
									initialTopic.$keyUnit = section._key
									initialTopic.$name = 'Contenido General'
									initialTopic.$objective = 'Topico inicial, examinar los recursos de este topico, pues contienen el tema general de esta unidad.';
									if(section._summary != "") { initialTopic.$objective = section._summary; }

									references.forEach(rf => {
										section.$fileReferences = rf['id'][0]

										// Loading files
										let files = remove(filesXML, function (f) { return f['id'] === rf['id'][0] });

										if (files.length > 0) {

											let ind: number = 0
											files.forEach(file => {

												const newReff = this._db.database.app.database().ref().push();
												let resource = new Resource()

												// resource.$index = initialTopic._resources ? initialTopic._resources.length : 0;
												resource.$key = newReff.key
												resource.$keyCommunity = initialTopic._keyCommunity
												resource.$keyUnit = initialTopic._keyUnit
												resource.$keyTopic = initialTopic._key
												resource.$keyUser = GRIKY_UID
												resource.$name = file['filename']
												resource.$typeFile = file['mimetype']
												resource.$fileSize = file['filesize']

												resource.$localPath = `${BACKUP_SOURCE}/files/${file['contenthash']}`;

												ind = ind + 1

												initialTopic.$resource = resource;
												section.$files = resource;
											});


										} else {
											// console.warn('Esta sección/unidad no tiene archivos dispersos asociados, no se creará un Topic inicial general para ella.')
										}
									});

									section.$topics = initialTopic;

								}
							}
						});
					});

				});
			});
		});
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
