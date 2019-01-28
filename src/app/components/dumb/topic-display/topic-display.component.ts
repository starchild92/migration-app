import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Topic } from '@classes/topic';
import { orderBy } from 'lodash';

@Component({
	selector: 'app-topic-display',
	templateUrl: './topic-display.component.html',
	styleUrls: ['./topic-display.component.scss']
})
export class TopicDisplayComponent implements OnChanges, OnInit {

	@Input() section: any
	topics: Array<Topic>

	constructor() {
		this.topics = []
	}

	ngOnChanges(changes: SimpleChanges) {
		const section: SimpleChange = changes.section;
		this.topics = section.currentValue.topics
	}

	ngOnInit() {
		this.topics = orderBy(this.topics, ['index'], ['asc'])
	}

}
