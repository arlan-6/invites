export type TemplateType = {
	id: string;
	name: string;
	color: string;
	description: string;
	occasions: string[];
};

export const templates: TemplateType[] = [
	{
		id: "1",
		name: "Simple",
		color: "from-blue-400 to-purple-600",
		description: "A simple card",
		occasions: ["birthday", "anniversary", "graduation"],
	},
	{
		id: "2",
		name: "Elegant",
		description: "An elegant card",
		color: "from-pink-400 to-purple-600",
		occasions: ["birthday", "anniversary"],
	},
	{
		id: "3",
		name: "Modern",
		description: "A modern card",
		color: "from-pink-400 to-purple-600",
		occasions: ["birthday", "anniversary", "graduation"],
	},
];
const templatesById = new Map(templates.map((t) => [t.id, t]));
export const getTemplateById = (id: string) => templatesById.get(id);