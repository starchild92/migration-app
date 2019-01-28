import { Activity } from './activity';
import { Topic } from './topic';

/**
 * De aca saldran la unidades y topics
 */
export class Section {

	private path: string;
	private id: string;
	private title: string;
	private summary: string;
	private fileReferences: Array<String>;

	private activities: Array<Activity>;
	private topics: Array<Topic>;

	// Para generar los units
	private index: number;
	private key: string;
	private keyCommunity: string;
	private name: string; // es lo mismo que title
	private preRequisite: boolean;
	private preUnits: Array<any>;
	private totalTopic: number;


	public set $path(v: string) { this.path = v; }
	public set $id(v: string) { this.id = v; }
	public set $title(v: string) { this.title = v; }
	public set $summary(v: string) { this.summary = v; }
	public set $fileReferences(v: string) {
		if (this.fileReferences) {
			this.fileReferences.push(v)
		} else {
			this.fileReferences = <Array<String>>[];
			this.fileReferences.push(v);
		}
	}
	public set $activities(v: Activity) {
		if (this.activities) {
			this.activities.push(v)
		} else {
			this.activities = <Array<Activity>>[];
			this.activities.push(v);
		}
	}
	public set $topics(v: Topic) {
		if (this.topics) {
			this.topics.push(v)
		} else {
			this.topics = <Array<Topic>>[];
			this.topics.push(v);
		}
	}
	public set $topicsArray(arr: Array<Topic>) {
		this.topics = arr;
	}

	public set $index(v: number) { this.index = v; }
	public set $key(v: string) { this.key = v; }
	public set $keyCommunity(v: string) { this.keyCommunity = v; }
	public set $name(v: string) { this.name = v; }
	public set $preRequisite(v: boolean) { this.preRequisite = v; }
	public set $preUnits(v: Array<any>) { this.preUnits = v; }
	public set $totalTopic(v: number) { this.totalTopic = v; }

	public get _path(): string { return this.path; }
	public get _id(): string { return this.id; }
	public get _title(): string { return this.title; }
	public get _summary(): string { return this.summary; }
	public get _fileReferences(): Array<String> { return this.fileReferences; }
	public get _activities(): Array<Activity> { return this.activities; }
	public get _topics(): Array<Topic> { return this.topics; }

	public get _index(): number { return this.index }
	public get _key(): string { return this.key }
	public get _keyCommunity(): string { return this.keyCommunity }
	public get _name(): string { return this.name }
	public get _preRequisite(): boolean { return this.preRequisite }
	public get _preUnits(): Array<any> { return this.preUnits }
	public get _totalTopic(): number {
		if (this.activities) {
			return this.activities.length
		} else {
			return 0
		}
	}

	constructor(object?: SectionInterface) {
		this.totalTopic = 0;

		if (object) {
			this.createWithInfo(object);
		}
	}

	toFirebaseObject(): any {
		return {
			index: this.index,
			key: this.key,
			keyCommunity: this.keyCommunity,
			name: this.title,
			preRequisite: this.preRequisite,
			preUnits: this.preUnits,
			totalTopic: this._totalTopic
		}
	}

	private loadData<T>(data: T, defaul?: T) {
		return data === undefined ? defaul !== undefined ? defaul : null : data;
	}

	createWithInfo(info: SectionInterface) {
		this.path = this.loadData(info.path);
		this.id = this.loadData(info.id);
		this.title = this.loadData(info.title);
		this.summary = this.loadData(info.summary);
		this.fileReferences = this.loadData(info.fileReferences);
		this.activities = this.loadData(info.activities);
		this.topics = this.loadData(info.topics);

		this.index = this.loadData(info.index);
		this.key = this.loadData(info.key);
		this.keyCommunity = this.loadData(info.keyCommunity);
		this.name = this.loadData(info.name);
		this.preRequisite = this.loadData(info.preRequisite);
		this.preUnits = this.loadData(info.preUnits);
		this.totalTopic = this.loadData(info.totalTopic);
	}
}

export class SectionInterface {
	path: string;
	id: string;
	title: string;
	summary: string;
	fileReferences?: Array<String>;
	activities?: Array<Activity>;
	topics?: Array<Topic>;

	index: number;
	key: string;
	keyCommunity: string;
	name: string; // es lo mismo que title
	preRequisite: boolean;
	preUnits?: Array<any>;
	totalTopic: number;
}
