import { Component, OnInit } from '@angular/core';
import { FILES_SEQUENCE, AREAS_CONOCIMIENTO, CARRERAS, PATHS } from '@env/environment';
import { Community } from '@classes/community';
import { AngularFirestore } from 'angularfire2/firestore';
import { MainService } from '@services/main.service';
import { Section } from '@classes/section';

import { find } from 'lodash';
import { Activity } from '@classes/activity';

@Component({
	selector: 'app-community',
	templateUrl: './community.component.html',
	styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

	main: any = {};
	course = new Community();
	finalArraySections: Array<Section> = [];

	FILES_SEQUENCE = FILES_SEQUENCE;
	Areas = AREAS_CONOCIMIENTO;
	Carreras = CARRERAS;

	areaS: boolean = false
	carreraS: boolean = false

	constructor(
		private _afs: AngularFirestore,
		private _mainService: MainService
	) {
	}

	ngOnInit() {
		this._mainService.currentFile.subscribe(val => {
			this.main = val;
			if(val['name']) { this.extractingSections() }
		});
		this._mainService.currentCommunity.subscribe(val => {
			this.course = val;
			this.course.$carrera = 'Elegir Carrera';
			this.course.$area = 'Elegir Area';
		});
	}

	chooseValue(value, choice) {
		switch (choice) {
			case 'area': this.course.$area = value; this.areaS = true; break;
			case 'carrera': this.course.$carrera = value; this.carreraS = true; break;
			default: break;
		}
	}

	extractingSections() {
		// path: contents / sections / [0] / section
		if(this.main['contents']['sections'][0]['section']) {
			let arrSections = this.main['contents']['sections'][0]['section'];
			arrSections.forEach(element => {
				flatThat(element)
				let section = new Section();
				section.$id = element['sectionid'];
				section.$path = element['directory'];
				section.$title = element['title'];
				this.finalArraySections.push(section);
			});
			this._mainService.updateSections(this.finalArraySections);
			this.extractingActivities();
		}
	}

	extractingActivities() {
		// path: contents / activities / [0] / activity
		if(this.main['contents']['activities'][0]['activity']) {

			let arrActivities = this.main['contents']['activities'][0]['activity'];
			let finalArrayActivities: Array<Activity> = [];

			arrActivities.forEach(element => {
				flatThat(element)

				let activity = new Activity();
				activity.$path = element['directory'];
				activity.$id = element['moduleid'];
				activity.$type = element['modulename'];
				activity.$sectionid = element['sectionid'];
				activity.$title = element['title'];
				finalArrayActivities.push(activity);
			});

			finalArrayActivities.forEach(activity => {
				let section = <Section>find(this.finalArraySections, function(s: Section){ return s._id === activity._sectionid })
				if(section) {
					section.$activities = activity
				}
			});

			this._mainService.updateActivities(finalArrayActivities);
			this._mainService.updateSections(this.finalArraySections);
		}
	}

	runScript() {
		this._afs.collection(PATHS.Community).doc(this.course._key).set(this.course.serialize()).then(() => {
			console.log('la comunidad fue insertada correctamente');
		}, error => {
			console.log('algo malo paso insertando la comunidad', error);
		})
	}

}
export function flatThat(main) { Object.keys(main).forEach(key => { if(main[key].length == 1) { main[key] = main[key][0]; } }); }
