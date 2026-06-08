// data/dummydata.js

/*
    TIJDELIJKE DUMMYDATA

    Later met backend/database:
    1. Verwijder deze dummydata import uit HomeScreen.js.
    2. Haal protesten op via API of database.
    3. Zet de opgehaalde data om naar dezelfde structuur als hieronder.
    4. Dan blijven HomeScreen, PreviewModal en DetailScreen bijna hetzelfde werken.

    PSEUDOCODE VOOR LATER:

    async function fetchProtests() {
        const response = await fetch("JOUW_API_URL/protests");
        const data = await response.json();

        return data.map((protest) => ({
            id: protest.id,
            title: protest.name,
            subtitle: protest.category,
            description: protest.description,
            location: protest.location,
            participants: protest.predicted_members,
            type: protest.project_type,
            date: formatDate(protest.start_time),
            timeStart: formatStartTime(protest.start_time),
            timeEnd: formatEndTime(protest.end_time),
            image: { uri: protest.image_url },
            topic: protest.topic_name,
            tags: protest.tags,
            why: protest.why_text,
            actionTitle: protest.action_title,
            actionDescription: protest.action_description,
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
        image: require("../assets/demo1.jpeg"),
        topic: "Palestina",
        tags: ["Palestina", "Mensenrechten", "Spandoek"],
        why: "Waarom demonstreren we? Informatie over de demonstratie.",
        actionTitle: "Kom in actie voor de Mars!",
        actionDescription:
            "Een krachtig protest valt of staat met de boodschap. Wij zorgen voor de straat, zorg jij voor het beeld? Jouw creativiteit is precies wat we nu nodig hebben.",
        projectLabel: "High Impact - Low effort",
    },
    {
        id: 2,
        title: "Naam Demonstratie",
        subtitle: "Beschrijving Demonstratie",
        description: "Een actie waarbij jongeren kunnen helpen met zichtbaarheid.",
        location: "Binnenrotte",
        city: "Rotterdam",
        participants: "1.000+",
        type: "Stickers",
        date: "18 Mei 2026",
        timeStart: "14:00",
        timeEnd: "15:00",
        image: require("../assets/demo1.jpeg"),
        topic: "Klimaat",
        tags: ["Klimaat", "Stickers"],
        why: "Meer aandacht vragen voor het onderwerp door jongeren actief te betrekken.",
        actionTitle: "Help mee met de actie!",
        actionDescription:
            "Met jouw bijdrage kan de boodschap sterker verspreid worden. Kies een kleine opdracht en help de demonstratie meer bereik te geven.",
        projectLabel: "Direct - Low effort",
    },
];