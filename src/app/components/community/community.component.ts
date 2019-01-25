import { Component, OnInit } from '@angular/core';
import { Community } from '../../classes/community';
import { FILES_SEQUENCE, AREAS_CONOCIMIENTO, CARRERAS } from '../../../environments/environment';

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

	constructor() {
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

	getCourseFromXML(xmlObj: any): Community {

		xmlObj = xmlObj['course'];
		this.course.$name = xmlObj['fullname'][0];

		console.log(this.course)

		return this.course;
	}

	runScript() {
		this.getCourseFromXML(course_xml);
	}

}
