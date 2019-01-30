import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';
import { Section } from '@classes/section';
import { HttpClient } from '@angular/common/http';
import { BACKUP_SOURCE } from '@env/environment';
import { AngularFireDatabase } from 'angularfire2/database';
import { Community } from '@classes/community';

var xml2js = require('xml2js');
import { filter, remove } from 'lodash';
import { Resource } from '@classes/resource';

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
					if (section._activities) {
						section.$totalTopic = section._activities.length
					} else { section.$totalTopic = 0; }

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

										// Loading files
										let files = remove(filesXML, function (f) { return f['id'] === rf['id'][0] });

										let ind: number = 0
										files.forEach(file => {

											// const newRef = this._db.database.app.database().ref().push();
											let resource = new Resource()

											resource.$index = ind
											// resource.$key = newRef.key
											// resource.$keyCommunity = element._keyCommunity
											// resource.$keyUnit = element._key
											// resource.$keyTopic = topic._key
											// resource.$keyUser = GRIKY_UID
											resource.$name = file['filename']
											resource.$typeFile = file['mimetype']

											resource.$localPath = `${BACKUP_SOURCE}/files/${file['contenthash']}`;

											ind = ind + 1

											section.$files = resource;
										});

									});
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
