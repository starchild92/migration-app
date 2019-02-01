import { Resource } from './resource';
import { findIndex } from 'lodash';

export class Topic {
	private type: string;

	private index: number;
	private key: string;
	private keyCommunity: string;
	private keyUnit: string;
	private name: string;
	private nameImage: string;
	private objective: string;
	private totalDocuments: number;
	private urlImage: string;

	private resources: Array<Resource>;
	private urls: Array<string>;

	public contextid: string;
	public moduleid: string;
	public modulename: string;

	public set $type(v: string) { this.type = v; }
	public set $moduleid(v: string) { this.moduleid = v; }
	public set $contextid(v: string) { this.contextid = v; }
	public set $modulename(v: string) { this.modulename = v; }


	public set $index(v: number) { this.index = v; }
	public set $key(v: string) { this.key = v; }
	public set $keyCommunity(v: string) { this.keyCommunity = v; }
	public set $keyUnit(v: string) { this.keyUnit = v; }
	public set $name(v: string) { this.name = v; }
	public set $nameImage(v: string) { this.nameImage = v; }
	public set $objective(v: string) { this.objective = v; }
	public set $totalDocuments(v: number) { this.totalDocuments = v; }
	public set $urlImage(v: string) { this.urlImage = v; }

	public set $resource(v: Resource) {
		if (this.resources) {
			let ind = findIndex(this.resources, (e) => { return (v._fileSize === e._fileSize && v._localPath === e._localPath) })
			if (ind < 0) {
				v.$index = this.resources.length
				this.resources.push(v)
			} else {
				console.warn('Ya existe entre los recursos un elemento del mismo peso')
			}
		} else {
			this.resources = <Array<Resource>>[];
			v.$index = 0
			this.resources.push(v);
		}
	}

	public set $url(v: string) {
		if (this.urls) {
			this.urls.push(v)
		} else {
			this.urls = <Array<string>>[];
			this.urls.push(v);
		}
	}

	public get _type(): string { return this.type; }
	public get _moduleid(): string { return this.moduleid; }
	public get _contextid(): string { return this.contextid; }
	public get _modulename(): string { return this.modulename; }

	public get _index(): number { return this.index; }
	public get _key(): string { return this.key; }
	public get _keyCommunity(): string { return this.keyCommunity; }
	public get _keyUnit(): string { return this.keyUnit; }
	public get _name(): string { return this.name; }
	public get _nameImage(): string { return this.nameImage; }
	public get _objective(): string { return this.objective; }
	public get _totalDocuments(): number {
		if (this.resources) {
			return this.resources.length
		} else {
			return 0
		}
	}
	public get _urlImage(): string { return this.urlImage; }
	public get _resources(): Array<Resource> { return this.resources; }
	public get _urls(): Array<string> { return this.urls; }

	constructor(object?: TopicInterface) {
		if (object) {
			this.createWithInfo(object)
		}
	}

	private loadData<T>(data: T, defaul?: T) {
		return data === undefined ? defaul !== undefined ? defaul : null : data;
	}

	createWithInfo(info: TopicInterface) {
		this.type = this.loadData(info.type);

		this.index = this.loadData(info.index);
		this.key = this.loadData(info.key);
		this.keyCommunity = this.loadData(info.keyCommunity);
		this.keyUnit = this.loadData(info.keyUnit);
		this.name = this.loadData(info.name);
		this.nameImage = this.loadData(info.nameImage);
		this.objective = this.loadData(info.objective);
		this.totalDocuments = this.loadData(info.totalDocuments);
		this.urlImage = this.loadData(info.urlImage);
	}

	toFirestoreObject(): any {
		let obj = {
			index: this._index,
			key: this._key,
			keyCommunity: this._keyCommunity,
			keyUnit: this._keyUnit,
			name: this._name,
			nameImage: this._nameImage,
			objective: this._objective,
			totalDocuments: this._totalDocuments,
			urlImage: this._urlImage
		}
		Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
		return obj;
	}
}

export class TopicInterface {
	type: string;
	contextid: string;
	moduleid: string;
	modulename: string;

	index: number;
	key: string;
	keyCommunity: string;
	keyUnit: string;
	name: string;
	nameImage: string;
	objective: string;
	totalDocuments: number;
	urlImage: string;
}
