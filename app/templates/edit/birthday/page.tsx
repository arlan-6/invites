"use client";
import React, { FC, useEffect } from "react";
import { cn } from "@/lib/utils";
import useTemplateStore from "@/store/advancedTemplate";
import { AdvancedTemplateType } from "@/data/advanced-templates";
import useAdvancedInviteStore from "@/store/advancedInviteEdit";
import { Birthday } from "@/components/advanced-templates/birthday";

interface pageProps {
}

const Template: AdvancedTemplateType = {
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
    "themeOrMessage",
    "dressCode",
    "giftInfo",
    "rsvpDeadline",
    "contactInfo",
	],
};

const Page: FC<pageProps> = ({  }) => {
	const setInputs = useTemplateStore.getState().setInputs;
  const setId = useTemplateStore.getState().setId;
  const setPath = useTemplateStore.getState().setPath;
	useEffect(() => {
		setInputs(Template.inputs);
    setId(Template.id);
    setPath(Template.path);
	}, [setInputs, setId, setPath]);

	const advancedInviteData = useAdvancedInviteStore().inviteData;
  
	return <div className={cn("")}>

<Birthday inviteData={advancedInviteData}/>
  </div>;
};
export default Page;
