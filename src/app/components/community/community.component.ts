import { Component, OnInit } from '@angular/core';
import { AREAS_CONOCIMIENTO, CARRERAS } from '@env/environment';
import { Community } from '@classes/community';
import { MainService } from '@services/main.service';
import { Section } from '@classes/section';

import { find, findIndex, filter } from 'lodash';
import { Activity } from '@classes/activity';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
	selector: 'app-community',
	templateUrl: './community.component.html',
	styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

	main: any = {};
	course = new Community();
	finalArraySections: Array<Section> = [];

	Areas: Array<any>[] = [];
	Carreras: Array<any>[] = [];
	CarrerasFiltered: Array<any>[] = [];

	areaS: boolean = false
	carreraS: boolean = false

	constructor(
		private _mainService: MainService,
		private _db: AngularFireDatabase
	) {
		this.getAreasCarreras()
	}

	ngOnInit() {
		this._mainService.currentFile.subscribe(val => {
			this.main = val;
			if (val['name']) { this.extractingSections() }
		});
		this._mainService.currentCommunity.subscribe(val => {
			this.course = val;
			this.course.$carrera = 'Elegir Carrera';
			this.course.$area = 'Elegir Area';
		});
	}

	getAreasCarreras() {
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

				console.log(this.Areas)

			});
		});
	}

	chooseValue(value, choice) {
		switch (choice) {
			case 'area':
				this.carreraS = false;
				this.course.$area = value; this.areaS = true;
				this.CarrerasFiltered = filter(this.Carreras, function (c) { return value == c['area'] })
				break;
			case 'carrera': this.course.$carrera = value; this.carreraS = true; break;
			default: break;
		}
	}

	extractingSections() {
		// path: contents / sections / [0] / section
		if (this.main['contents']['sections'][0]['section']) {
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
		if (this.main['contents']['activities'][0]['activity']) {

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
				let section = <Section>find(this.finalArraySections, function (s: Section) { return s._id === activity._sectionid })
				if (section) {
					section.$activities = activity
				}
			});

			this._mainService.updateActivities(finalArrayActivities);
			this._mainService.updateSections(this.finalArraySections);
		}
	}
}
export function flatThat(main) { Object.keys(main).forEach(key => { if (main[key].length == 1) { main[key] = main[key][0]; } }); }
