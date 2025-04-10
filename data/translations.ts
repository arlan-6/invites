export const translations = {
	en: {
		"hero.heading": "Create Beautiful Digital Invitations",
		"hero.subheading":
			"Design, share, and manage digital invitations for all your special occasions with our easy-to-use platform.",
		"hero.cta": "Get Started",
		"hero.secondary": "View Templates",
		"navigation.home": "Home",
		"navigation.templates": "Templates",
		"navigation.contact": "Contact",
		"navigation.about": "About",
		"navigation.signup": "Sign Up",
		"navigation.logout": "Log out",
		"navigation.dashboard": "Dashboard",
		"templates.occasions": "Occasions",
		"inviteEditor.clear": "Clear",
		"inviteEditor.share": "Share",
		"inviteEditor.needSignUp": "Log in first to share!",
		"inviteEditor.dialogCloseText":
			"After closing dialog you will redirected to Dasboard",
		"inviteEditor.dialogLinkText": "Link to the invitation",
		"inviteEditor.title": "Title",
		"inviteEditor.event-title": "Event title",
		"inviteEditor.event-title-placeholder": "Birthday party",
		"inviteEditor.eventDate": "Event date",
		"inviteEditor.event-date-placeholder": "2022-12-31 | December 31, 2022",
		"inviteEditor.eventTime": "Event time",
		"inviteEditor.event-time-placeholder": "12:00 PM | 18:00",
		"inviteEditor.eventLocation": "Event location",
		"inviteEditor.event-location-placeholder": "Almaty, Abai 123",
		"inviteEditor.event-timer": "Add timer",
		"inviteEditor.eventMessage": "Event message",
		"inviteEditor.event-message-max": "max 50 characters",
		"inviteEditor.event-message-placeholder":
			"Join us for a night of fun and celebration!",
		"dashboard.notLoggedIn": "You are not logged in!",
		"dashboard.accountBanned": "Account Banned",
		"dashboard.banReason":
			"Your account has been banned for the following reason:",
		"dashboard.noReasonProvided": "No reason provided",
		"dashboard.banExpires": "Ban expires on",
		"dashboard.welcome": "Welcome",
		"dashboard.role": "Role",
		"dashboard.defaultRole": "User",
		"dashboard.overview": "Dashboard Overview",
		"dashboard.overviewDescription":
			"Here you can manage your account, view your activity, and explore more features.",
		"dashboard.accountDetails": "Account Details",
		"dashboard.accountCreated": "Account Created",
		"dashboard.lastUpdated": "Last Updated",
		"dashboard.emailVerified": "Email Verified",
		"dashboard.yes": "Yes",
		"dashboard.no": "No",
		"dashboard.quickActions": "Quick Actions",
		"dashboard.editProfile": "Edit Profile",
		"dashboard.accountSettings": "Account Settings",
		"dashboard.logout": "Logout",

		"advanced-template-editor.title": "Edit Invitation",
		"advanced-template-editor.toggleButton.open": "Open Editor",
		"advanced-template-editor.toggleButton.close": "Close Editor",
		"advanced-template-editor.clearButton": "Clear",
		"advanced-template-editor.refreshButton": "Try Refreshing",
		"advanced-template-editor.emptyState.message": "Template not loaded or has no fields.",
		"advanced-template-editor.accordion.required": "Required Details",
		"advanced-template-editor.accordion.optional": "Optional Details",
		"advanced-template-editor.fileInput.selected": "Selected: {fileName}",
		"advanced-template-editor.label.name": "Name",
		"advanced-template-editor.placeholder.name": "E.g., John Doe",
		"advanced-template-editor.label.age": "Age",
		"advanced-template-editor.placeholder.age": "E.g., 30",
		"advanced-template-editor.label.dateTime": "Date and Time",
		"advanced-template-editor.placeholder.dateTime": " ", // datetime-local inputs often don't show placeholders well
		"advanced-template-editor.label.location": "Location Name",
		"advanced-template-editor.placeholder.location": "E.g., Grand Hall",
		"advanced-template-editor.label.address": "Full Address",
		"advanced-template-editor.placeholder.address": "E.g., 123 Main St, Anytown",
		"advanced-template-editor.label.addressLink": "Address Map Link",
		"advanced-template-editor.placeholder.addressLink": "E.g., https://maps.app.goo.gl/...",
		"advanced-template-editor.label.contactInfo": "Contact Information",
		"advanced-template-editor.placeholder.contactInfo": "E.g., Jane Doe (555-1234)",
		"advanced-template-editor.label.message": "Invitation Message",
		"advanced-template-editor.placeholder.message": "E.g., Join us for a celebration!",
		"advanced-template-editor.label.image": "Upload Image",
		"advanced-template-editor.placeholder.image": "Select an image", // Placeholder for file input doesn't visually appear but is good for context
		"advanced-template-editor.label.themeOrMessage": "Theme or Short Message",
		"advanced-template-editor.placeholder.themeOrMessage": "E.g., Tropical Paradise",
		"advanced-template-editor.label.dressCode": "Dress Code",
		"advanced-template-editor.placeholder.dressCode": "E.g., Casual, Formal",
		"advanced-template-editor.label.giftInfo": "Gift Information",
		"advanced-template-editor.placeholder.giftInfo": "E.g., Registry link or 'No gifts please'",
		"advanced-template-editor.label.rsvpDeadline": "RSVP Deadline",
		"advanced-template-editor.placeholder.rsvpDeadline": "", // datetime-local inputs often don't show placeholders well

		"birthday.defaultName": "Guest", // Fallback if inviteData.name is missing
		"birthday.youAreInvited": "You're Invited", // Main title
		"birthday.dateTBC": "Date TBC", // Fallback for date
		"birthday.timeTBC": "Time TBC", // Fallback for time
		"birthday.defaultLocation": "Location TBC", // Fallback for location
		"birthday.defaultThemeMessage": "Join us for a celebration!", // Fallback for theme/message
		"birthday.defaultDressCode": "Dress code: Casual or as you like!", // Example fallback for dress code
		"birthday.defaultGiftInfo": "Your presence is the only gift required!", // Example fallback for gift info
		"birthday.defaultRSVPDeadline": "ASAP", // Fallback for RSVP deadline (using "ASAP" as a less specific fallback than TBC)
		"birthday.defaultContactInfo": "Reach out if you have questions.", // Fallback for contact info

		"birthday.yearsOld": "Years Old", // Appears after the age number
		"birthday.birthdayParty": "Birthday Party", // Appears after the name

		"birthday.viewMapDirections": "View Map / Directions", // Text for the map link
		"birthday.attire": "Attire", // Heading for the dress code section
		"birthday.gifts": "Gifts", // Heading for the gift info section

		"birthday.willYouCelebrateWithUs": "Will you celebrate with us?", // Heading for the RSVP section
		"birthday.yourNamePlaceholder": "Your Full Name", // Placeholder for the guest name input
		"birthday.attendanceYes": "Yes, I'll be there!", // Radio button label for attending
		"birthday.attendanceNo": "Sorry, I can't make it.", // Radio button label for not attending
		"birthday.sendRSVP": "Send RSVP", // Text for the submit button
		"birthday.sendRSVPLoading": "Sending",

		"birthday.pleaseRSVPBy": "Please RSVP by:", // Text appearing before the deadline date

		"birthday.questionsContact": "Questions? Contact:", // Text appearing before the contact info

		"birthday.footerMessage": "An invitation for {name}'s {age}th Birthday.", // Footer text (uses interpolation)

		// Toast / User Feedback Messages
		"birthday.missingInviteID":
			"Error: Invite ID is missing. Cannot submit RSVP.", // Error if ID prop is missing
		"birthday.rsvpSubmissionFailed":
			"Oh no! Something went wrong trying to submit your RSVP. Please try again or contact the host.", // Error on failed API call
		"birthday.rsvpSubmissionSuccess":
			"Got it, {name}! Your RSVP has been recorded. Thanks!", // Success message (uses interpolation for name)
		"birthday.rsvpFormIncomplete":
			"Please enter your name and select attendance.", // Error if form isn't filled out
	},
	kk: {
		"hero.heading": "Әдемі сандық шақыруларды жасаңыз",
		"hero.subheading":
			"Біздің оңай қолданылатын платформамызбен барлық ерекше оқиғаларыңызға арналған сандық шақыруларды жасаңыз, бөлісіңіз және басқарыңыз.",
		"hero.cta": "Бастау",
		"hero.secondary": "Үлгілерді қарау",
		"navigation.home": "Басты бет",
		"navigation.templates": "Үлгілер",
		"navigation.contact": "Байланыс",
		"navigation.about": "Біз туралы",
		"navigation.signup": "Тіркелу",
		"navigation.logout": "Шығу",
		"navigation.dashboard": "Басқару тақтасы",
		"templates.occasions": "Оқиғалар",
		"inviteEditor.clear": "Тазалау",
		"inviteEditor.share": "Бөлісу",
		"inviteEditor.needSignUp": "Алдымен тіркелу қажет!",
		"inviteEditor.title": "Атауы",
		"inviteEditor.event-title": "Іс-шара атауы",
		"inviteEditor.event-title-placeholder": "Туған күн кеші",
		"inviteEditor.eventDate": "Іс-шара күні",
		"inviteEditor.event-date-placeholder":
			"2022-12-31 | 2022 жылғы 31 желтоқсан",
		"inviteEditor.eventTime": "Іс-шара уақыты",
		"inviteEditor.event-time-placeholder": "12:00 | 18:00",
		"inviteEditor.eventLocation": "Іс-шара орны",
		"inviteEditor.event-location-placeholder": "Алматы, Абай 123",
		"inviteEditor.event-timer": "Таймер қосу",
		"inviteEditor.eventMessage": "Іс-шара хабарламасы",
		"inviteEditor.event-message-max": "максималды 50 таңба",
		"inviteEditor.event-message-placeholder": "Көңілді кешке қосылыңыз!",
		"dashboard.notLoggedIn": "Сіз жүйеге кірмегенсіз!",
		"dashboard.accountBanned": "Есептік жазба бұғатталған",
		"dashboard.banReason":
			"Сіздің есептік жазбаңыз келесі себеппен бұғатталды:",
		"dashboard.noReasonProvided": "Себеп көрсетілмеген",
		"dashboard.banExpires": "Бұғаттау мерзімі аяқталады",
		"dashboard.welcome": "Қош келдіңіз",
		"dashboard.role": "Рөл",
		"dashboard.defaultRole": "Пайдаланушы",
		"dashboard.overview": "Басқару тақтасының шолуы",
		"dashboard.overviewDescription":
			"Мұнда сіз өзіңіздің есептік жазбаңызды басқара аласыз, әрекеттеріңізді көре аласыз және басқа мүмкіндіктерді зерттей аласыз.",
		"dashboard.accountDetails": "Есептік жазба мәліметтері",
		"dashboard.accountCreated": "Есептік жазба жасалды",
		"dashboard.lastUpdated": "Соңғы жаңартылған",
		"dashboard.emailVerified": "Электрондық пошта расталды",
		"dashboard.yes": "Иә",
		"dashboard.no": "Жоқ",
		"dashboard.quickActions": "Жылдам әрекеттер",
		"dashboard.editProfile": "Профильді өңдеу",
		"dashboard.accountSettings": "Есептік жазба параметрлері",
		"dashboard.logout": "Шығу",
		"advanced-template-editor.title": "Шақыруды өңдеу",
  "advanced-template-editor.toggleButton.open": "Редакторды ашу",
  "advanced-template-editor.toggleButton.close": "Редакторды жабу",
  "advanced-template-editor.clearButton": "Тазарту",
  "advanced-template-editor.refreshButton": "Жаңартып көріңіз",
  "advanced-template-editor.emptyState.message": "Үлгі жүктелмеген немесе өрістері жоқ.",
  "advanced-template-editor.accordion.required": "Міндетті мәліметтер",
  "advanced-template-editor.accordion.optional": "Қосымша мәліметтер",
  "advanced-template-editor.fileInput.selected": "Таңдалды: {fileName}",
  "advanced-template-editor.label.name": "Аты",
  "advanced-template-editor.placeholder.name": "Мыс., Әлихан Бектаев",
  "advanced-template-editor.label.age": "Жасы",
  "advanced-template-editor.placeholder.age": "Мыс., 30",
  "advanced-template-editor.label.dateTime": "Күні мен уақыты",
  "advanced-template-editor.placeholder.dateTime": "",
  "advanced-template-editor.label.location": "Орынның атауы",
  "advanced-template-editor.placeholder.location": "Мыс., Үлкен Зал",
  "advanced-template-editor.label.address": "Толық мекенжайы",
  "advanced-template-editor.placeholder.address": "Мыс., Басты көше, 123, Қайсар қаласы",
  "advanced-template-editor.label.addressLink": "Картаға сілтеме",
  "advanced-template-editor.placeholder.addressLink": "Мыс., https://maps.google.com/...",
  "advanced-template-editor.label.contactInfo": "Байланыс ақпараты",
  "advanced-template-editor.placeholder.contactInfo": "Мыс., Айгүл Серікова (555-1234)",
  "advanced-template-editor.label.message": "Шақыру мәтіні",
  "advanced-template-editor.placeholder.message": "Мыс., Мерекеге шақырамыз!",
  "advanced-template-editor.label.image": "Суретті жүктеу",
  "advanced-template-editor.placeholder.image": "Суретті таңдаңыз",
  "advanced-template-editor.label.themeOrMessage": "Тақырыбы немесе қысқа хабарлама",
  "advanced-template-editor.placeholder.themeOrMessage": "Мыс., Тропикалық жұмақ",
  "advanced-template-editor.label.dressCode": "Дресс-код",
  "advanced-template-editor.placeholder.dressCode": "Мыс., Күнделікті, Кешкі",
  "advanced-template-editor.label.giftInfo": "Сыйлық туралы ақпарат",
  "advanced-template-editor.placeholder.giftInfo": "Мыс., Тізімге сілтеме немесе 'Сыйлық қажет емес'",
  "advanced-template-editor.label.rsvpDeadline": "Жауап беру мерзімі",
  "advanced-template-editor.placeholder.rsvpDeadline": "",
		"birthday.defaultName": "Қонақ",
		"birthday.youAreInvited": "Сізді шақырамыз",
		"birthday.dateTBC": "Күні Нақтыланады",
		"birthday.timeTBC": "Уақыты Нақтыланады",
		"birthday.defaultLocation": "Орны Нақтыланады",
		"birthday.defaultThemeMessage": "Мерекелік кешке қосылыңыз!",
		"birthday.defaultDressCode": "Киім үлгісі: Күнделікті немесе қалауыңызша!",
		"birthday.defaultGiftInfo": "Сіздің келгеніңіз - ең басты сыйлық!",
		"birthday.defaultRSVPDeadline": "Мүмкіндігінше тезірек",
		"birthday.defaultContactInfo": "Сұрақтарыңыз болса, хабарласыңыз.",
		"birthday.yearsOld": "жас", // "жас" = age/year. Context implies "{age} years old".
		"birthday.birthdayParty": "Туған Күн Кеші",
		"birthday.viewMapDirections": "Картаны / Бағытты көру",
		"birthday.attire": "Киім үлгісі",
		"birthday.gifts": "Сыйлықтар",
		"birthday.willYouCelebrateWithUs": "Бізбен бірге тойлайсыз ба?",
		"birthday.yourNamePlaceholder": "Сіздің Есіміңіз және Тегіңіз", // Placeholder for the guest name input
		"birthday.attendanceYes": "Иә, мен барамын!",
		"birthday.attendanceNo": "Өкінішке орай, бара алмаймын.",
		"birthday.sendRSVP": "Жауапты Жіберу",
		"birthday.sendRSVPLoading": "Жіберілуде",
		"birthday.pleaseRSVPBy": "Өтінеміз, осы күнге дейін жауап беріңіз:",
		"birthday.questionsContact": "Сұрақтар? Хабарласыңыз:",
		"birthday.footerMessage":
			"{name} есімдінің {age} жасқа толуына арналған шақыру.", // Handles Genitive case implication for {name}.
		"birthday.missingInviteID":
			"Қате: Шақыру идентификаторы жоқ. Жауап жіберу мүмкін емес.",
		"birthday.rsvpSubmissionFailed":
			"Ой! Жауап жіберу кезінде қате пайда болды. Қайталап көріңіз немесе ұйымдастырушымен хабарласыңыз.",
		"birthday.rsvpSubmissionSuccess":
			"Қабылданды, {name}! Сіздің жауабыңыз сақталды. Рахмет!",
		"birthday.rsvpFormIncomplete":
			"Есіміңізді енгізіп, келетініңізді/келмейтініңізді таңдаңыз.",
	},
	ru: {
		"hero.heading": "Создавайте красивые цифровые приглашения",
		"hero.subheading":
			"Создавайте, делитесь и управляйте цифровыми приглашениями для всех ваших особых случаев с помощью нашей удобной платформы.",
		"hero.cta": "Начать",
		"hero.secondary": "Просмотреть шаблоны",
		"navigation.home": "Главная",
		"navigation.templates": "Шаблоны",
		"navigation.contact": "Контакты",
		"navigation.about": "О нас",
		"navigation.signup": "Регистрация",
		"navigation.logout": "Выйти",
		"navigation.dashboard": "Панель управления",
		"templates.occasions": "События",
		"inviteEditor.clear": "Очистить",
		"inviteEditor.share": "Поделиться",
		"inviteEditor.needSignUp": "Сначала нужно войти!",
		"inviteEditor.title": "Название",
		"inviteEditor.event-title": "Название события",
		"inviteEditor.event-title-placeholder": "День рождения",
		"inviteEditor.eventDate": "Дата события",
		"inviteEditor.event-date-placeholder": "2022-12-31 | 31 декабря 2022",
		"inviteEditor.eventTime": "Время события",
		"inviteEditor.event-time-placeholder": "12:00 | 18:00",
		"inviteEditor.eventLocation": "Место события",
		"inviteEditor.event-location-placeholder": "Алматы, Абая 123",
		"inviteEditor.event-timer": "Добавить таймер",
		"inviteEditor.eventMessage": "Сообщение события",
		"inviteEditor.event-message-max": "максимум 50 символов",
		"inviteEditor.event-message-placeholder":
			"Присоединяйтесь к нам на вечер веселья и празднования!",
		"dashboard.notLoggedIn": "Вы не вошли в систему!",
		"dashboard.accountBanned": "Аккаунт заблокирован",
		"dashboard.banReason": "Ваш аккаунт был заблокирован по следующей причине:",
		"dashboard.noReasonProvided": "Причина не указана",
		"dashboard.banExpires": "Блокировка истекает",
		"dashboard.welcome": "Добро пожаловать",
		"dashboard.role": "Роль",
		"dashboard.defaultRole": "Пользователь",
		"dashboard.overview": "Обзор панели управления",
		"dashboard.overviewDescription":
			"Здесь вы можете управлять своим аккаунтом, просматривать свою активность и изучать другие функции.",
		"dashboard.accountDetails": "Детали аккаунта",
		"dashboard.accountCreated": "Аккаунт создан",
		"dashboard.lastUpdated": "Последнее обновление",
		"dashboard.emailVerified": "Электронная почта подтверждена",
		"dashboard.yes": "Да",
		"dashboard.no": "Нет",
		"dashboard.quickActions": "Быстрые действия",
		"dashboard.editProfile": "Редактировать профиль",
		"dashboard.accountSettings": "Настройки аккаунта",
		"dashboard.logout": "Выйти",
		"advanced-template-editor.title": "Редактировать приглашение",
  "advanced-template-editor.toggleButton.open": "Открыть редактор",
  "advanced-template-editor.toggleButton.close": "Закрыть редактор",
  "advanced-template-editor.clearButton": "Очистить",
  "advanced-template-editor.refreshButton": "Попробовать обновить",
  "advanced-template-editor.emptyState.message": "Шаблон не загружен или не содержит полей.",
  "advanced-template-editor.accordion.required": "Обязательные данные",
  "advanced-template-editor.accordion.optional": "Дополнительные данные",
  "advanced-template-editor.fileInput.selected": "Выбрано: {fileName}",
  "advanced-template-editor.label.name": "Имя",
  "advanced-template-editor.placeholder.name": "Напр., Иван Иванов",
  "advanced-template-editor.label.age": "Возраст",
  "advanced-template-editor.placeholder.age": "Напр., 30",
  "advanced-template-editor.label.dateTime": "Дата и время",
  "advanced-template-editor.placeholder.dateTime": " ",
  "advanced-template-editor.label.location": "Название места",
  "advanced-template-editor.placeholder.location": "Напр., Большой Зал",
  "advanced-template-editor.label.address": "Полный адрес",
  "advanced-template-editor.placeholder.address": "Напр., ул. Главная, 123, г. Любойгород",
  "advanced-template-editor.label.addressLink": "Ссылка на карту",
  "advanced-template-editor.placeholder.addressLink": "Напр., https://maps.google.com/...",
  "advanced-template-editor.label.contactInfo": "Контактная информация",
  "advanced-template-editor.placeholder.contactInfo": "Напр., Мария Смирнова (555-1234)",
  "advanced-template-editor.label.message": "Текст приглашения",
  "advanced-template-editor.placeholder.message": "Напр., Приглашаем вас на праздник!",
  "advanced-template-editor.label.image": "Загрузить изображение",
  "advanced-template-editor.placeholder.image": "Выберите изображение",
  "advanced-template-editor.label.themeOrMessage": "Тема или краткое сообщение",
  "advanced-template-editor.placeholder.themeOrMessage": "Напр., Тропический рай",
  "advanced-template-editor.label.dressCode": "Дресс-код",
  "advanced-template-editor.placeholder.dressCode": "Напр., Повседневный, Вечерний",
  "advanced-template-editor.label.giftInfo": "Информация о подарках",
  "advanced-template-editor.placeholder.giftInfo": "Напр., Ссылка на реестр или 'Подарки не нужны'",
  "advanced-template-editor.label.rsvpDeadline": "Ответить до",
  "advanced-template-editor.placeholder.rsvpDeadline": "",
		"birthday.defaultName": "Гость",
		"birthday.youAreInvited": "Приглашаем Вас",
		"birthday.dateTBC": "Дата Уточняется",
		"birthday.timeTBC": "Время Уточняется",
		"birthday.defaultLocation": "Место Уточняется",
		"birthday.defaultThemeMessage": "Присоединяйтесь к празднованию!",
		"birthday.defaultDressCode": "Дресс-код: Повседневный или как Вам удобно!",
		"birthday.defaultGiftInfo": "Ваше присутствие - лучший подарок!",
		"birthday.defaultRSVPDeadline": "Как можно скорее",
		"birthday.defaultContactInfo": "Если есть вопросы, обращайтесь.",
		"birthday.yearsOld": "лет", // Note: Russian uses год/года/лет depending on number; "лет" is a common simplification but may not be perfectly grammatical for all ages.
		"birthday.birthdayParty": "Вечеринка в честь Дня Рождения",
		"birthday.viewMapDirections": "Посмотреть карту / Маршрут",
		"birthday.attire": "Дресс-код",
		"birthday.gifts": "Подарки",
		"birthday.willYouCelebrateWithUs": "Отпразднуете с нами?",
		"birthday.yourNamePlaceholder": "Ваше Имя и Фамилия", // Placeholder for the guest name input
		"birthday.attendanceYes": "Да, я буду!",
		"birthday.attendanceNo": "К сожалению, не смогу.",
		"birthday.sendRSVP": "Отправить ответ",
		"birthday.sendRSVPLoading": "Отправляется",
		"birthday.pleaseRSVPBy": "Пожалуйста, ответьте до:",
		"birthday.questionsContact": "Вопросы? Обращайтесь:",
		"birthday.footerMessage": "Приглашение на {age}-летие {name}.", // Assumes {name} is provided in the Genitive case or system handles it.
		"birthday.missingInviteID":
			"Ошибка: Отсутствует ID приглашения. Невозможно отправить ответ.",
		"birthday.rsvpSubmissionFailed":
			"Ой! Что-то пошло не так при отправке ответа. Пожалуйста, попробуйте еще раз или свяжитесь с организатором.",
		"birthday.rsvpSubmissionSuccess":
			"Принято, {name}! Ваш ответ записан. Спасибо!",
		"birthday.rsvpFormIncomplete":
			"Пожалуйста, введите Ваше имя и выберите, придете ли Вы.",
	},
};
