import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FILES_SEQUENCE, AREAS_CONOCIMIENTO, CARRERAS, PATHS, GRIKY_UID } from '@env/environment';
import { Community } from '@classes/community';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

var xml2js = require('xml2js');
var course_xml: any;

@Component({
	selector: 'app-community',
	templateUrl: './community.component.html',
	styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

	course = new Community();

	FILES_SEQUENCE = FILES_SEQUENCE;
	Areas = AREAS_CONOCIMIENTO;
	Carreras = CARRERAS;

	constructor(
		private _afs: AngularFirestore,
		private _db: AngularFireDatabase
	) {
		this.course.$area = 'Area';
		this.course.$carrera = 'Carrera'
	}

	ngOnInit() {
	}

	openfile(file: any) {
		let parser = new xml2js.Parser();
		let reader = new FileReader();
		let onload = function (event) {
			let text = reader.result
			parser.parseString(text, function (err, resp) {
				course_xml = resp;
			})
		}
		reader.onload = onload
		reader.readAsText(file.target.files[0])
	}

	chooseValue(value, choice) {
		switch (choice) {
			case 'area': this.course.$area = value; break;
			case 'carrera': this.course.$carrera = value; break;

			default: break;
		}
	}

	getCourseFromXML(xmlObj: any): Promise<boolean> {
		return new Promise((resolve, reject) => {
			xmlObj = xmlObj['course'];
			console.log(xmlObj);

			this.course.$name = xmlObj['fullname'][0];
			this.course.$shortname = xmlObj['shortname'][0];

			resolve(true)
		});
	}

	runScript() {
		this.getCourseFromXML(course_xml).then(execute => {
			if (execute) {
				var newRef = this._db.database.app.database().ref().push();
				this.course.$key = newRef.key;
				this.course.$uid = GRIKY_UID;

				console.log(this.course)

				this._afs.collection(PATHS.Community).doc(this.course._key).set(this.course.serialize()).then(
					resp => {
						console.log('la comunidad fue insertada correctamente');
					},
					error => {
						console.log('algo malo paso insertando la comunidad', error);
					})
			}
		})
	}

}
