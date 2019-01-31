import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';
import { Section } from '@classes/section';
import { orderBy, filter, find, remove } from 'lodash';
import { AngularFireDatabase } from 'angularfire2/database';
import { Resource } from '@classes/resource';
import { GRIKY_UID, BACKUP_SOURCE } from '@env/environment';
import { Topic } from '@classes/topic';

@Component({
	selector: 'app-resources',
	templateUrl: './resources.component.html',
	styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

	sections: Array<Section>
	files: Array<any>

	continue: boolean = false

	constructor(
		private _mainService: MainService,
		private _db: AngularFireDatabase
	) {
		this.sections = []
		this.files = []
	}

	ngOnInit() {
		this._mainService.getSections().then(sections => {

			this.sections = sections

			console.log(this.sections)

			// organizando los topics
			this.sections.forEach(element => {
				let topics = element._topics
				topics = orderBy(topics, ['index'], ['asc']);
				element.$topicsArray = topics
			});

			this._mainService.updateSections(this.sections)

			this._mainService.currentFileSchema.subscribe(result => {
				this.files = result;
				this.associateResources();
				this.continue = true
			});
		});
	}

	associateResources(): any {
		this.sections.forEach(element => {
			let topics = element._topics
			topics.forEach(topic => {
				let ind: number = 0
				let files = filter(this.files, function (f) { return f['contextid'] === topic._contextid })

				if (topic._type != 'url') {
					files.forEach(file => {

						// verifico que el archivo no este en la lista
						let lista: Array<Resource> = topic._resources;
						if (!find(lista, (e: Resource) => { return e._localPath === `${BACKUP_SOURCE}/files/${file['contenthash']}` })) {
							const newRef = this._db.database.app.database().ref().push();
							let resource = new Resource()

							resource.$index = ind
							resource.$key = newRef.key
							resource.$keyCommunity = element._keyCommunity
							resource.$keyUnit = element._key
							resource.$keyTopic = topic._key
							resource.$keyUser = GRIKY_UID
							resource.$name = file['filename']
							resource.$typeFile = file['mimetype']

							// unbicació de los recursos que se están cargando
							resource.$localPath = `${BACKUP_SOURCE}/files/${file['contenthash']}`;
							resource.$fileSize = file['filesize']

							ind = ind + 1

							topic.$resource = resource;
						} else {
							console.log('Se encontró un archivo igual en la lista.')
						}
					});
				}
			});
		});
	}

	deleteFromResources(r: Resource) {
		let section = find(this.sections, function (s) { return s._key == r._keyUnit });
		if (section) {
			let topic = find(section._topics, function (t) { return t._key == r._keyTopic });
			if (topic) {
				remove(topic._resources, function (e) { return r._key == e._key })
				updateIndexes(topic._resources)
			}
		}
	}

	removeSection(s: Section) {
		remove(this.sections, function (e) { return s._key == e._key })
		updateIndexes(this.sections)
	}

	deleteTopic(t: Topic) {
		let s: Section = find(this.sections, (s) => { return t._keyUnit == s._key })
		remove(s._topics, (tp) => { return t._key === tp._key })
		updateIndexes(s._topics)

		console.log(this.sections)
	}

}

export function updateIndexes(arr: Array<any>) {
	let ind: number = 0
	arr.forEach(e => {
		e.$index = ind
		ind = ind + 1;
	});
}
