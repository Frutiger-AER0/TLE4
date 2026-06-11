// data/dummydata.js

/*
    TIJDELIJKE DUMMYDATA

    Later met backend/database:
    1. Verwijder deze dummydata.
    2. Haal protests, user_projects en protest_projects op via API/database.
    3. Zet de data om naar dezelfde structuur als hieronder.

    ERD KOPPELING VOOR LATER:

    protests:
    - id
    - name
    - description
    - location
    - predicted_members

    protest_details:
    - protest_id
    - link
    - start_time

    projects:
    - id
    - name
    - description

    protest_projects:
    - protest_id
    - project_id

    protest_project_details:
    - protest_project_id
    - steps

    user_projects:
    - protest_project_id
    - user_id
    - is_finished

    PSEUDOCODE VOOR LATER:

    async function fetchAgendaForUser(userId) {
        const response = await fetch(`/api/users/${userId}/agenda`);
        const data = await response.json();

        return data.map((item) => ({
            id: item.protest.id,
            title: item.protest.name,
            date: formatDate(item.protest_detail.start_time),
            timeStart: formatTime(item.protest_detail.start_time),
            location: item.protest.location,
            image: { uri: item.protest.image_url },
            isSaved: item.user_project !== null,
            isFinished: item.user_project?.is_finished ?? false,
        }));
    }
*/

export const helpOptions = [
    {
        id: 1,
        title: "Spandoeken",
        points: [
            "Lever een ontwerp aan. Wij regelen de rest.",
            "Help mee met een spandoek.",
        ],
    },
    {
        id: 2,
        title: "Stickers",
        points: [
            "Jouw ontwerp, onze productie.",
            "Verspreid de boodschap met stickers.",
        ],
    },
];

export const filterOptions = {
    topics: [
        "Klimaat",
        "Mensenrechten",
        "Wonen",
        "Onderwijs",
        "Vrede",
        "LHBTQI+",
        "Arbeid",
        "Dieren",
        "Palestina",
    ],
    assignments: ["Alle", "Spandoek", "Stickers"],
    moments: ["Alle", "Vandaag", "Deze week", "Dit weekend"],
};

export const protests = [
    {
        id: 1,
        title: "Nakba 1948 - 2026",
        subtitle: "Mars & Herdenking",
        description: "Samen herdenken en opkomen voor gerechtigheid.",
        location: "Schouwburgplein",
        city: "Rotterdam",
        participants: "1.000+",
        type: "Spandoek",
        date: "15 Mei 2026",
        timeStart: "18:30",
        timeEnd: "19:00",
        calendarDay: 15,
        calendarMonth: "Mei",
        calendarYear: 2026,
        image: require("../assets/demo1.jpeg"),
        topic: "Palestina",
        tags: ["Palestina", "Mensenrechten", "Spandoek"],
        why: "Waarom demonstreren we? Informatie over de demonstratie.",
        actionTitle: "Kom in actie voor de Mars!",
        actionDescription:
            "Een krachtig protest valt of staat met de boodschap. Wij zorgen voor de straat, zorg jij voor het beeld? Jouw creativiteit is precies wat we nu nodig hebben.",
        projectLabel: "High Impact - Low effort",
        isPlanned: true,
        isSaved: true,
    },
    {
        id: 2,
        title: "Nakba 1948 - 2026",
        subtitle: "Mars & Herdenking",
        description: "Samen herdenken en opkomen voor gerechtigheid.",
        location: "Schouwburgplein",
        city: "Rotterdam",
        participants: "1.000+",
        type: "Stickers",
        date: "14 Mei 2026",
        timeStart: "14:00",
        timeEnd: "15:00",
        calendarDay: 9,
        calendarMonth: "Mei",
        calendarYear: 2026,
        image: require("../assets/Palestinedemostration.webp"),
        topic: "Palestina",
        tags: ["Palestina", "Mensenrechten", "Stickers"],
        why: "Waarom demonstreren we? Informatie over de demonstratie.",
        actionTitle: "Kom in actie voor de Mars!",
        actionDescription:
            "Een krachtig protest valt of staat met de boodschap. Wij zorgen voor de straat, zorg jij voor het beeld? Jouw creativiteit is precies wat we nu nodig hebben.",
        projectLabel: "High Impact - Low effort",
        isPlanned: true,
        isSaved: true,
    },
    {
        id: 3,
        title: "Klimaat Actie Rotterdam",
        subtitle: "Actie voor de toekomst",
        description: "Een actie voor meer aandacht voor klimaat en leefomgeving.",
        location: "Binnenrotte",
        city: "Rotterdam",
        participants: "750+",
        type: "Spandoek",
        date: "3 Mei 2026",
        timeStart: "13:00",
        timeEnd: "14:00",
        calendarDay: 3,
        calendarMonth: "Mei",
        calendarYear: 2026,
        image: require("../assets/demo1.jpeg"),
        topic: "Klimaat",
        tags: ["Klimaat", "Spandoek"],
        why: "Samen aandacht vragen voor klimaat en de toekomst.",
        actionTitle: "Kom in actie voor klimaat!",
        actionDescription:
            "Help mee met een visuele boodschap die mensen direct begrijpen.",
        projectLabel: "Direct - High Impact",
        isPlanned: false,
        isSaved: true,
    },
];

export const savedActions = [
    {
        id: 1,
        title: "Petitie - Bescherm Groen",
        type: "Petitie",
        isSaved: true,
    },
    {
        id: 2,
        title: "Donatie - Mensenrechtenfonds",
        type: "Donatie",
        isSaved: true,
    },
];