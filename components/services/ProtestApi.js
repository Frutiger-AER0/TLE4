// services/protestApi.js

const API_BASE_URL = "http://145.24.237.86:8000";

const API_PATHS = {
    protests: "/protests",
    userProjects: "/user-projects",
    saveUserProject: "/user-projects",
    deleteUserProject: (id) => `/user-projects/${id}`,
};

const fallbackImage = require("../../assets/demo1.jpeg");

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
    }

    return response.json();
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Datum onbekend";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Datum onbekend";
    }

    return date.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatTime(dateValue) {
    if (!dateValue) {
        return "Tijd onbekend";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Tijd onbekend";
    }

    return date.toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getCalendarDay(dateValue) {
    if (!dateValue) {
        return null;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.getDate();
}

function getCalendarMonthIndex(dateValue) {
    if (!dateValue) {
        return null;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.getMonth();
}

function getCalendarYear(dateValue) {
    if (!dateValue) {
        return null;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.getFullYear();
}

function getImageSource(cardImg) {
    if (!cardImg || typeof cardImg !== "string") {
        return fallbackImage;
    }

    if (cardImg.startsWith("http")) {
        return { uri: cardImg };
    }

    if (cardImg.startsWith("/")) {
        return { uri: `${API_BASE_URL}${cardImg}` };
    }

    return { uri: `${API_BASE_URL}/${cardImg}` };
}

function getFirstItem(value) {
    if (Array.isArray(value)) {
        return value[0] || null;
    }

    return value || null;
}

export function normalizeProtest(record) {
    /*
        ERD mapping:

        protests:
        - id
        - name
        - description
        - location
        - predicted_members
        - card_img

        protest_details:
        - id
        - protest_id
        - link
        - start_time

        projects:
        - id
        - name
        - description

        protest_projects:
        - id
        - protest_id
        - project_id

        protest_project_details:
        - id
        - protest_project_id
        - steps

        user_projects:
        - id
        - protest_project_id
        - user_id
        - is_finished
    */

    const protest = record?.protest || record;

    const protestDetail = getFirstItem(
        record?.protest_details ||
        record?.protest_detail ||
        protest?.protest_details ||
        protest?.protest_detail
    );

    const protestProject = getFirstItem(
        record?.protest_projects ||
        record?.protest_project ||
        protest?.protest_projects ||
        protest?.protest_project
    );

    const project =
        record?.project ||
        protestProject?.project ||
        getFirstItem(record?.projects || protest?.projects) ||
        null;

    const protestProjectDetail = getFirstItem(
        record?.protest_project_details ||
        record?.protest_project_detail ||
        protestProject?.protest_project_details ||
        protestProject?.protest_project_detail
    );

    const userProject =
        record?.user_project ||
        record?.userProject ||
        record?.pivot ||
        null;

    const startTime =
        protestDetail?.start_time ||
        record?.start_time ||
        protest?.start_time ||
        null;

    const cardImg =
        protest?.card_img ||
        record?.card_img ||
        null;

    const predictedMembers =
        protest?.predicted_members ||
        record?.predicted_members ||
        null;

    return {
        id: protest?.id,

        protestProjectId:
            protestProject?.id ||
            record?.protest_project_id ||
            userProject?.protest_project_id ||
            null,

        userProjectId:
            userProject?.id ||
            record?.user_project_id ||
            null,

        title:
            protest?.name ||
            record?.name ||
            "Naam demonstratie",

        subtitle:
            project?.name ||
            "Demonstratie",

        description:
            protest?.description ||
            "Geen beschrijving beschikbaar.",

        location:
            protest?.location ||
            "Locatie onbekend",

        city: "Rotterdam",

        participants:
            predictedMembers
                ? `${predictedMembers}+`
                : "Onbekend",

        type:
            project?.name ||
            "Project",

        date: formatDate(startTime),
        timeStart: formatTime(startTime),
        timeEnd: "Niet bekend",

        startTimeRaw: startTime,

        calendarDay: getCalendarDay(startTime),
        calendarMonthIndex: getCalendarMonthIndex(startTime),
        calendarYear: getCalendarYear(startTime),

        image: getImageSource(cardImg),

        topic:
            record?.topic?.name ||
            protest?.topic?.name ||
            record?.topic ||
            protest?.topic ||
            "Algemeen",

        tags:
            record?.tags ||
            protest?.tags ||
            [],

        link:
            protestDetail?.link ||
            null,

        why:
            protest?.description ||
            "Informatie over deze demonstratie.",

        actionTitle:
            project?.name
                ? `Kom in actie met ${project.name}!`
                : "Kom in actie!",

        actionDescription:
            protestProjectDetail?.steps ||
            project?.description ||
            "Kies een actie en draag bij aan deze demonstratie.",

        projectLabel:
            project?.name
                ? `${project.name} - Low effort`
                : "High Impact - Low effort",

        isPlanned:
            userProject?.is_finished === false ||
            record?.is_finished === false ||
            Boolean(userProject),

        isSaved:
            Boolean(userProject) ||
            Boolean(record?.is_saved),
    };
}

export async function fetchProtests() {
    const data = await request(API_PATHS.protests);

    const items = Array.isArray(data)
        ? data
        : data.data || data.protests || [];

    return items.map(normalizeProtest);
}

export async function fetchUserProjects() {
    try {
        const data = await request(API_PATHS.userProjects);

        const items = Array.isArray(data)
            ? data
            : data.data || data.user_projects || data.userProjects || [];

        return items.map(normalizeProtest);
    } catch (error) {
        console.log("fetchUserProjects fallback:", error.message);

        /*
            Tijdelijke fallback:
            Als /user-projects nog niet bestaat of faalt,
            crasht de agenda niet.
        */

        const protests = await fetchProtests();

        return protests.map((item) => ({
            ...item,
            isPlanned: false,
            isSaved: false,
        }));
    }
}

export async function saveUserProject(protestProjectId, userId = null) {
    return request(API_PATHS.saveUserProject, {
        method: "POST",
        body: JSON.stringify({
            user_id: userId,
            protest_project_id: protestProjectId,
            is_finished: false,
        }),
    });
}

export async function deleteUserProject(userProjectId) {
    return request(API_PATHS.deleteUserProject(userProjectId), {
        method: "DELETE",
    });
}