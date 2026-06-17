// components/services/ProtestApi.js

const API_BASE_URL = "http://145.24.237.86:8000";

const API_PATHS = {
    protests: "/protests",

    protestDetails: [
        "/protest_details",
        "/protest-details",
    ],

    protestProjects: [
        "/protest_projects",
        "/protest-projects",
    ],

    projects: "/projects",

    protestProjectDetails: [
        "/protest_project_details",
        "/protest-project-details",
    ],

    userProjects: [
        "/user_projects",
        "/user-projects",
    ],

    saveUserProject: "/user_projects",

    deleteUserProject: (id) => `/user_projects/${id}`,
};

/*
    Dit bestand staat in:
    components/services/ProtestApi.js

    Daarom is dit pad correct.
*/
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

    const contentType = response.headers.get("content-type") || "";

    let data = null;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.detail ||
            data?.error ||
            data ||
            `API error ${response.status}`;

        throw new Error(message.toString());
    }

    return data;
}

async function requestOptional(pathOrPaths) {
    const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];

    for (const path of paths) {
        try {
            const data = await request(path);
            return normalizeApiList(data);
        } catch (error) {
            console.log(`Optional endpoint failed: ${path}`, error.message);
        }
    }

    return [];
}

function normalizeApiList(data) {
    if (Array.isArray(data)) {
        return data;
    }

    return (
        data?.data ||
        data?.items ||
        data?.results ||
        data?.protests ||
        data?.projects ||
        data?.protest_details ||
        data?.protestDetails ||
        data?.protest_projects ||
        data?.protestProjects ||
        data?.protest_project_details ||
        data?.protestProjectDetails ||
        data?.user_projects ||
        data?.userProjects ||
        []
    );
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

function findById(items, id) {
    if (!id) {
        return null;
    }

    return (
        items.find((item) => {
            return item.id === id || item.id === Number(id);
        }) || null
    );
}

function findByForeignKey(items, key, id) {
    if (!id) {
        return [];
    }

    return items.filter((item) => {
        return item[key] === id || item[key] === Number(id);
    });
}

function enrichProtestRecord(
    protest,
    protestDetails,
    protestProjects,
    projects,
    protestProjectDetails,
    userProjects
) {
    const detail =
        getFirstItem(findByForeignKey(protestDetails, "protest_id", protest.id)) ||
        null;

    const linkedProtestProjects =
        findByForeignKey(protestProjects, "protest_id", protest.id) || [];

    const firstProtestProject = getFirstItem(linkedProtestProjects);

    const project =
        firstProtestProject
            ? findById(projects, firstProtestProject.project_id)
            : null;

    const projectDetail =
        firstProtestProject
            ? getFirstItem(
                findByForeignKey(
                    protestProjectDetails,
                    "protest_project_id",
                    firstProtestProject.id
                )
            )
            : null;

    const userProject =
        firstProtestProject
            ? getFirstItem(
                findByForeignKey(
                    userProjects,
                    "protest_project_id",
                    firstProtestProject.id
                )
            )
            : null;

    return {
        ...protest,

        protest_details: detail ? [detail] : [],

        protest_projects: firstProtestProject
            ? [
                {
                    ...firstProtestProject,
                    project: project || null,
                    protest_project_details: projectDetail ? [projectDetail] : [],
                },
            ]
            : [],

        user_project: userProject || null,
    };
}

export function normalizeProtest(record) {
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

    const projectName =
        project?.name ||
        record?.project_name ||
        record?.type ||
        "Project";

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
            projectName === "Project"
                ? "Demonstratie"
                : projectName,

        description:
            protest?.description ||
            record?.description ||
            "Geen beschrijving beschikbaar.",

        location:
            protest?.location ||
            record?.location ||
            "Locatie onbekend",

        latitude: parseFloat(
            protest?.latitude ||
            record?.latitude ||
            51.9225
        ),

        longitude: parseFloat(
            protest?.longitude ||
            record?.longitude ||
            4.4791
        ),

        city: "Rotterdam",

        participants:
            predictedMembers
                ? `${predictedMembers}+`
                : "Onbekend",

        type: projectName,

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
            record?.link ||
            null,

        why:
            protest?.description ||
            record?.description ||
            "Informatie over deze demonstratie.",

        actionTitle:
            projectName && projectName !== "Project"
                ? `Kom in actie met ${projectName}!`
                : "Kom in actie!",

        actionDescription:
            protestProjectDetail?.steps ||
            project?.description ||
            "Kies een actie en draag bij aan deze demonstratie.",

        projectLabel:
            projectName && projectName !== "Project"
                ? `${projectName} - Low effort`
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
    const [
        protests,
        protestDetails,
        protestProjects,
        projects,
        protestProjectDetails,
        userProjects,
    ] = await Promise.all([
        requestOptional(API_PATHS.protests),
        requestOptional(API_PATHS.protestDetails),
        requestOptional(API_PATHS.protestProjects),
        requestOptional(API_PATHS.projects),
        requestOptional(API_PATHS.protestProjectDetails),
        requestOptional(API_PATHS.userProjects),
    ]);

    const enriched = protests.map((protest) => {
        return enrichProtestRecord(
            protest,
            protestDetails,
            protestProjects,
            projects,
            protestProjectDetails,
            userProjects
        );
    });

    return enriched.map(normalizeProtest);
}

export async function fetchUserProjects() {
    try {
        const [
            userProjects,
            protests,
            protestDetails,
            protestProjects,
            projects,
            protestProjectDetails,
        ] = await Promise.all([
            requestOptional(API_PATHS.userProjects),
            requestOptional(API_PATHS.protests),
            requestOptional(API_PATHS.protestDetails),
            requestOptional(API_PATHS.protestProjects),
            requestOptional(API_PATHS.projects),
            requestOptional(API_PATHS.protestProjectDetails),
        ]);

        if (!userProjects.length) {
            return [];
        }

        const enrichedUserProjects = userProjects
            .map((userProject) => {
                const protestProject = findById(
                    protestProjects,
                    userProject.protest_project_id
                );

                if (!protestProject) {
                    return null;
                }

                const protest = findById(protests, protestProject.protest_id);

                if (!protest) {
                    return null;
                }

                const detail =
                    getFirstItem(
                        findByForeignKey(protestDetails, "protest_id", protest.id)
                    ) || null;

                const project = findById(projects, protestProject.project_id);

                const projectDetail =
                    getFirstItem(
                        findByForeignKey(
                            protestProjectDetails,
                            "protest_project_id",
                            protestProject.id
                        )
                    ) || null;

                return {
                    ...protest,

                    protest_details: detail ? [detail] : [],

                    protest_projects: [
                        {
                            ...protestProject,
                            project: project || null,
                            protest_project_details: projectDetail
                                ? [projectDetail]
                                : [],
                        },
                    ],

                    user_project: userProject,
                };
            })
            .filter(Boolean);

        return enrichedUserProjects.map(normalizeProtest);
    } catch (error) {
        console.log("fetchUserProjects fallback:", error.message);
        return [];
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