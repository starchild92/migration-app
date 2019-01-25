import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';

var xml2js = require('xml2js');

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	main: any = {};

	constructor(
		private _mainService: MainService
	) { }

	ngOnInit() {
		this._mainService.currentFile.subscribe(val => {
			console.log('Subscribe Called', val)
			 this.main = val

		})
	}

	openfile(file: any) {
		let parser = new xml2js.Parser();
		let reader = new FileReader();
		let serv = this._mainService

		reader.onload = function (event) {
			let text = reader.result
			parser.parseString(text, function (err, resp) {
				serv.update(resp['moodle_backup']['information'][0]);
			});
		}
		reader.readAsText(file.target.files[0]);
	}

}
