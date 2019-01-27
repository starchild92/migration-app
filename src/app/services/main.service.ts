import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Section } from '@classes/section';
import { Activity } from '@classes/activity';
import { Community } from '@classes/community';

@Injectable({
	providedIn: 'root'
})
export class MainService {

	// contiene los datos de los xml
	main_file: any
	file_schema: any
	questions: any

	// son las clases para manipular facilmente los datos del xml y subir a firestore
	community: Community;
	sections: Array<Section> = [];
	activities: Array<Activity> = [];

	private mainFileSource = new BehaviorSubject<any>(this.main_file);
	public currentFile = this.mainFileSource.asObservable();

	private mainFileSchema = new BehaviorSubject<any>(this.file_schema);
	public currentFileSchema = this.mainFileSchema.asObservable();

	private mainQuestions = new BehaviorSubject<any>(this.questions);
	public currentQuestions = this.mainQuestions.asObservable();

	private mainCommunitySource = new BehaviorSubject<Community>(this.community);
	public currentCommunity = this.mainCommunitySource.asObservable();

	private mainSectionSource = new BehaviorSubject<Array<Section>>(this.sections);
	public currentSections = this.mainSectionSource.asObservable();

	private mainActivitySource = new BehaviorSubject<Array<Activity>>(this.activities);
	public currentActivities = this.mainActivitySource.asObservable();

	constructor() {
		this.community = new Community();
		console.log('Main Service Constructor')
		this.mainFileSource.next({ contructor: true })
	}

	updateMain(source: any) {
		this.mainFileSource.next(source);
	}

	updateFile(source: any) {
		this.mainFileSchema.next(source);
	}

	updateQuestions(source: any) {
		this.mainQuestions.next(source);
	}

	updateCommunity(source: Community) {
		const actual = this.community;
		Object.assign(actual, source);
		this.mainCommunitySource.next(actual);
	}

	updateSections(source: Array<Section>) {
		this.mainSectionSource.next(source);
	}
	getSections(): Promise<Array<Section>> {
		return new Promise((resolve, reject) => {
			this.currentSections.subscribe(val => {
				resolve(val)
			})
		});
	}

	updateActivities(source: Array<Activity>) {
		this.mainActivitySource.next(source);
	}
}
