import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';
import { Section } from '@classes/section';
import { orderBy, filter, find, remove } from 'lodash';
import { AngularFireDatabase } from 'angularfire2/database';
import { Resource } from '@classes/resource';
import { GRIKY_UID, BACKUP_SOURCE } from '@env/environment';

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
				let files = filter(this.files, function (f) { return f['contextid'] === topic._contextid })
				let ind: number = 0
				files.forEach(file => {
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

					ind = ind + 1

					topic.$resource = resource;
				});
			});
		});
	}

	addAsTopicImage(r: Resource) { }

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

}

export function updateIndexes(arr: Array<any>) {
	let ind: number = 0
	arr.forEach(e => {
		e.$index = ind
		ind = ind + 1;
	});
}
