import { Component } from '@angular/core';

var xml2js = require('xml2js');

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';

	openfile(file) {
		console.log(file)
		let parser = new xml2js.Parser();
		let reader = new FileReader()
		let onload = function (event) {

			console.log(event)

			let text = reader.result
			parser.parseString(text, function (err, resp) {
				console.dir(resp)
				console.log('Done')
			})
		}
		reader.onload = onload
		reader.readAsText(file.target.files[0])
	}
}
