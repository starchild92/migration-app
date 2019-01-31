import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';

import { MainService } from '@services/main.service';
import { Community } from '@classes/community';
import { Section } from '@classes/section';
import { Topic } from '@classes/topic';
import { BACKUP_SOURCE, GRIKY_UID } from '@env/environment';
import { Resource } from '@classes/resource';

var xml2js = require('xml2js');

@Component({
	selector: 'app-topics',
	templateUrl: './topics.component.html',
	styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

	filesXML: any;
	questionsXML: any;

	community: Community;
	sections: Array<Section>;

	continue: boolean = false

	constructor(
		private _mainService: MainService,
		private _db: AngularFireDatabase,
		private http: HttpClient
	) {
		this.sections = [];
	}

	ngOnInit() {
		this.sections = [];
		this._mainService.currentFileSchema.subscribe(files => {
			this.filesXML = files;
			this._mainService.currentQuestions.subscribe(questions => {
				this.questionsXML = questions;
				this._mainService.currentCommunity.subscribe(comm => {
					this.community = comm;
					this._mainService.getSections().then(sections => {
						this.sections = sections
						this.processTopics()
					});
				});
			});
		});
	}

	processTopics(): any {
		let parser = new xml2js.Parser();

		this.sections.forEach(section => {
			let ind: number = 0
			if (section._activities) {
				section._activities.forEach(activity => {

					const newRef = this._db.database.app.database().ref().push();
					let topic = new Topic()

					topic.$index = ind
					topic.$key = newRef.key
					topic.$keyCommunity = this.community._key
					topic.$keyUnit = section._key
					topic.$name = activity._title
					topic.$type = activity._type

					/** Para no procesar los paquetes SCORM */
					if (activity._type !== 'scorm' && activity._type !== 'assign') {

						// index del topic
						ind = ind + 1;

						this.http.get(`${BACKUP_SOURCE}/${activity._path}/${activity._type}.xml`, { responseType: 'text' }).subscribe(data => {
							parser.parseString(data, (err, resp) => {
								let act = resp['activity']
								flatThat(act, activity._type)

								if (act[activity._type]['content']) { topic.$objective = act[activity._type]['content']; } else {
									if (act[activity._type]['intro']) { topic.$objective = act[activity._type]['intro']; }
								}

								topic.$contextid = act['contextid']
								topic.$moduleid = act['moduleid']
								topic.$modulename = act['modulename']

								if (topic._type === 'url') {

									const newRef = this._db.database.app.database().ref().push();
									let resource = new Resource()

									resource.$index = 0
									resource.$key = newRef.key
									resource.$keyCommunity = this.community._key
									resource.$keyUnit = section._key
									resource.$keyTopic = topic._key
									resource.$keyUser = GRIKY_UID
									resource.$name = 'Enlace'
									resource.$typeFile = activity._type
									resource.$urlFile = act[topic._type]['externalurl']

									topic.$resource = resource;
								}

								section.$topics = topic
							});
						});
					}
				});
			}

		});

		console.log(this.sections)

		this._mainService.updateSections(this.sections)
		this.continue = true
	}

}
export function flatThat(obj: any, type: string) {
	Object.keys(obj).forEach(key => {
		if (key === type) {
			if (obj[key].length == 1) { obj[key] = obj[key][0]; }
			Object.keys(obj[key]).forEach(sub => {
				if (obj[key][sub].length == 1) { obj[key][sub] = obj[key][sub][0]; }
				if (sub == '$') { obj['id'] = obj[key][sub]['id']; delete obj[key][sub]; }
			});
		}
		if (key == '$') {
			obj['id'] = obj[key]['id'];
			obj['contextid'] = obj[key]['contextid'];
			obj['moduleid'] = obj[key]['moduleid'];
			obj['modulename'] = obj[key]['modulename'];
			delete obj[key];
		}
	});
}
