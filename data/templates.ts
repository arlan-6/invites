export type TemplateType = {
	id: string;
	color: string;
	occasions: string[];
	translations: {
		'kk': {
			name: string;
			description: string;
		};
		'ru': {
			name: string;
			description: string;
		};
		'en':{
			name: string;
			description: string;
		}
	};
};

export const templates: TemplateType[] = [
	{
		id: "1",
		color: "from-blue-400 to-purple-600",
		occasions: ["birthday", "anniversary", "graduation"],
		translations: {
			'kk': {
				name: "Қарапайым",
				description: "Қарапайым ашықхат",
			},
			'ru': {
				name: "Простой",
				description: "Простая открытка",
			},
			'en':{
				name: "Simple",
				description: "A simple card",
			}
		},
	},
	{
		id: "2",
		color: "from-pink-400 to-purple-600",
		occasions: ["birthday", "anniversary"],
		translations: {
			'kk': {
				name: "Сәнді",
				description: "Сәнді ашықхат",
			},
			'ru': {
				name: "Элегантный",
				description: "Элегантная открытка",
			},
			'en':{
				name: "Elegant",
				description: "An elegant card",
			}
		},
	},
	{
		id: "3",
		color: "from-pink-400 to-purple-600",
		occasions: ["birthday", "anniversary", "graduation"],
		translations: {
			'kk': {
				name: "Заманауи",
				description: "Заманауи ашықхат",
			},
			'ru': {
				name: "Современный",
				description: "Современная открытка",
			},
			'en':{
				name: "Modern",
				description: "A modern card",
			}
		},
	},
];

const templatesById = new Map(templates.map((t) => [t.id, t]));
export const getTemplateById = (id: string) => templatesById.get(id);