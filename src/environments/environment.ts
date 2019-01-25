// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false
};

export const firebase = {
  apiKey: "AIzaSyAyZqegPQjvxm9fLyQ8w7nKI0D29VxtRSI",
  authDomain: "eleven-1-1.firebaseapp.com",
  databaseURL: "https://eleven-1-1.firebaseio.com",
  projectId: "eleven-1-1",
  storageBucket: "eleven-1-1.appspot.com",
  messagingSenderId: "589431464804"
};

export enum FILES_SEQUENCE {
	Files = 'Files',
	Courses = 'Courses', //Comunidades
	Units = 'Units', // Unidades,
	Themes = 'Themes', //Temas
	Resources = 'Resources' // Recursos
}

export const AREAS_CONOCIMIENTO = [
	{ name: 'Negocios', value: 'a0' },
	{ name: 'Humanidades', value: 'a1' },
	{ name: 'Ingeniería', value: 'a2' },
	{ name: 'Arquitectura y Diseño', value: 'a3' }
];

export const CARRERAS = [
	{ name: 'Administración de Empresas Turística', value: 'cr0' },
	{ name: 'Administración Gastronómica', value: 'cr1' },
	{ name: 'Contador Público Estretegico', value: 'cr2' },
	{ name: 'Economía', value: 'cr3' },
	{ name: 'Finanzas', value: 'cr4' },
	{ name: 'Mercadotecnia', value: 'cr5' }
]
