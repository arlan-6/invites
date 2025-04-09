export type AdvancedTemplateTranslationsType = {
	kk: {
		name: string;
		description: string;
		occasions: string[];
	};
	ru: {
		name: string;
		description: string;
		occasions: string[];
	};
	en: {
		name: string;
		description: string;
		occasions: string[];
	};
};
export type AdvancedTemplateInputsType = (
	| "name"
	| "age"
	| "dateTime"
	| "location"
	| "address"
	| "addressLink"
	| "message"
	| "image"
	| "themeOrMessage"
	| "dressCode"
	| "giftInfo"
	| "rsvpDeadline"
	| "contactInfo"
)[];

export type AdvancedTemplateType = {
	id: string;
	path: string;
	translations: AdvancedTemplateTranslationsType;
	// input: {
	//     name: string;
	//     age: number;
	//     dateTime: Date | string;
	//     location?: string;
	//     address: string;
	//     addressLink: string[] | string;
	//     message?: string;
	//     image?: string;
	// };
	inputs: AdvancedTemplateInputsType;
};

export const advancedTemplates: AdvancedTemplateType[] = [
	{
		id: "1",
		path: "birthday",
		translations: {
			kk: {
				name: "Туған күн",
				description: "Туған күнге арналған шаблон",
				occasions: ["туған күн", "мерейтой"],
			},
			ru: {
				name: "День рождения",
				description: "Шаблон для дня рождения",
				occasions: ["день рождения", "юбилей"],
			},
			en: {
				name: "Birthday",
				description: "Template for birthday",
				occasions: ["birthday", "anniversary"],
			},
		},
		inputs: [
			"name",
			"age",
			"dateTime",
			"location",
			"address",
			"addressLink",
			"message",
		],
	},
];

const advancedTemplatesById = new Map(advancedTemplates.map((t) => [t.id, t]));
export const getAdvancedTemplateById = (id: string) =>
	advancedTemplatesById.get(id);
