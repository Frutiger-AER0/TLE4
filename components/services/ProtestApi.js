// components/services/ProtestApi.js

const API_BASE_URL = "http://145.24.237.86:8000";

const API_PATHS = {
    protests: "/protests",

    protestById: (id) => `/protests/${id}`,

    protestDetails: [
        "/protest_details",
        "/protest-details",
    ],

    protestDetailByProtestId: (id) => [
        `/protest_details/${id}`,
        `/protest-details/${id}`,
        `/protests/${id}/details`,
        `/protests/${id}/detail`,
    ],

    protestProjects: [
        "/protest_projects",
        "/protest-projects",
    ],

    protestProjectByProtestId: (id) => [
        `/protest_projects/${id}`,
        `/protest-projects/${id}`,
        `/protests/${id}/projects`,
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

async function requestOptionalObject(pathOrPaths) {
    const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];

    for (const path of paths) {
        try {
            return await request(path);
        } catch (error) {
            console.log(`Optional detail endpoint failed: ${path}`, error.message);
        }
    }

    return null;
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

function normalizeApiObject(data) {
    if (!data) {
        return null;
    }

    if (Array.isArray(data)) {
        return data[0] || null;
    }

    return (
        data?.data ||
        data?.item ||
        data?.result ||
        data?.protest ||
        data
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

    /*
        Jouw backend geeft bij card_img nu een lange hash/bestandsnaam terug.
        Als jouw backend images via /uploads serveert, is dit correct.
        Als images via een andere map worden geserveerd, moet alleen deze regel worden aangepast.
    */
    return { uri: `${API_BASE_URL}/uploads/${cardImg}` };
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

function mergeProtestWithDetail(protest, detailData) {
    const detail = normalizeApiObject(detailData);

    if (!detail) {
        return protest;
    }

    return {
        ...protest,
        ...detail,

        id: protest.id || detail.id,

        name:
            detail.name ||
            protest.name,

        subtitle:
            detail.subtitle ||
            protest.subtitle,

        description:
            detail.description ||
            protest.description,

        location:
            detail.location ||
            protest.location,

        predicted_members:
            detail.predicted_members ??
            protest.predicted_members,

        card_img:
            detail.card_img ||
            protest.card_img,

        latitude:
            detail.latitude ||
            protest.latitude,

        longitude:
            detail.longitude ||
            protest.longitude,

        created_at:
            protest.created_at ||
            detail.created_at,

        updated_at:
            detail.updated_at ||
            protest.updated_at,

        protest_details:
            detail.protest_details ||
            detail.protest_detail ||
            protest.protest_details ||
            protest.protest_detail,

        protest_projects:
            detail.protest_projects ||
            detail.protest_project ||
            protest.protest_projects ||
            protest.protest_project,

        projects:
            detail.projects ||
            protest.projects,

        topic:
            detail.topic ||
            protest.topic,

        tags:
            detail.tags ||
            protest.tags,
    };
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
        getFirstItem(protest.protest_details) ||
        protest.protest_detail ||
        null;

    const linkedProtestProjects =
        findByForeignKey(protestProjects, "protest_id", protest.id);

    const fallbackProtestProjects = Array.isArray(protest.protest_projects)
        ? protest.protest_projects
        : protest.protest_project
            ? [protest.protest_project]
            : [];

    const allLinkedProtestProjects =
        linkedProtestProjects.length > 0
            ? linkedProtestProjects
            : fallbackProtestProjects;

    const firstProtestProject = getFirstItem(allLinkedProtestProjects);

    const project =
        firstProtestProject
            ? (
                firstProtestProject.project ||
                findById(projects, firstProtestProject.project_id)
            )
            : (
                protest.project ||
                getFirstItem(protest.projects) ||
                null
            );

    const projectDetail =
        firstProtestProject
            ? (
                getFirstItem(firstProtestProject.protest_project_details) ||
                firstProtestProject.protest_project_detail ||
                getFirstItem(
                    findByForeignKey(
                        protestProjectDetails,
                        "protest_project_id",
                        firstProtestProject.id
                    )
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

function inferTopic(record, protest) {
    return (
        record?.topic?.name ||
        protest?.topic?.name ||
        record?.topic ||
        protest?.topic ||
        getFirstItem(record?.topics)?.name ||
        getFirstItem(protest?.topics)?.name ||
        "Algemeen"
    );
}

function inferProjectName(project, record, protest) {
    const value =
        project?.name ||
        record?.project_name ||
        record?.projectName ||
        record?.type ||
        record?.assignment_type ||
        protest?.project_name ||
        protest?.type ||
        null;

    if (!value) {
        return "Algemeen";
    }

    return value;
}

function inferStartTime(protestDetail, record, protest) {
    return (
        protestDetail?.start_time ||
        protestDetail?.startTime ||
        record?.start_time ||
        record?.startTime ||
        protest?.start_time ||
        protest?.startTime ||
        null
    );
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

    const startTime = inferStartTime(protestDetail, record, protest);

    const cardImg =
        protest?.card_img ||
        record?.card_img ||
        null;

    const predictedMembers =
        protest?.predicted_members ??
        record?.predicted_members ??
        null;

    const projectName = inferProjectName(project, record, protest);

    const title =
        protest?.name ||
        record?.name ||
        "Naam demonstratie";

    const subtitle =
        protest?.subtitle ||
        record?.subtitle ||
        (projectName !== "Algemeen" ? projectName : "Demonstratie");

    const description =
        protest?.description ||
        record?.description ||
        protest?.subtitle ||
        record?.subtitle ||
        "Geen beschrijving beschikbaar.";

    return {
        id: protest?.id,

        raw: record,

        protestProjectId:
            protestProject?.id ||
            record?.protest_project_id ||
            userProject?.protest_project_id ||
            null,

        userProjectId:
            userProject?.id ||
            record?.user_project_id ||
            null,

        title,

        subtitle,

        description,

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

        topic: inferTopic(record, protest),

        tags:
            record?.tags ||
            protest?.tags ||
            [],

        link:
            protestDetail?.link ||
            record?.link ||
            protest?.link ||
            null,

        why:
            protest?.description ||
            record?.description ||
            protest?.subtitle ||
            record?.subtitle ||
            "Informatie over deze demonstratie.",

        actionTitle:
            projectName && projectName !== "Algemeen"
                ? `Kom in actie met ${projectName}!`
                : "Kom in actie!",

        actionDescription:
            protestProjectDetail?.steps ||
            project?.description ||
            description ||
            "Kies een actie en draag bij aan deze demonstratie.",

        projectLabel:
            projectName && projectName !== "Algemeen"
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

async function fetchDetailedProtest(protest) {
    const detailData = await requestOptionalObject(
        API_PATHS.protestById(protest.id)
    );

    return mergeProtestWithDetail(protest, detailData);
}

export async function fetchProtests() {
    const protests = await requestOptional(API_PATHS.protests);

    const [
        protestDetails,
        protestProjects,
        projects,
        protestProjectDetails,
        userProjects,
    ] = await Promise.all([
        requestOptional(API_PATHS.protestDetails),
        requestOptional(API_PATHS.protestProjects),
        requestOptional(API_PATHS.projects),
        requestOptional(API_PATHS.protestProjectDetails),
        requestOptional(API_PATHS.userProjects),
    ]);

    const protestsWithDetails = await Promise.all(
        protests.map(async (protest) => {
            return fetchDetailedProtest(protest);
        })
    );

    const enriched = protestsWithDetails.map((protest) => {
        return enrichProtestRecord(
            protest,
            protestDetails,
            protestProjects,
            projects,
            protestProjectDetails,
            userProjects
        );
    });

    const normalized = enriched.map(normalizeProtest);

    console.log("fetchProtests count:", normalized.length);
    console.log(
        "fetchProtests normalized:",
        normalized.map((item) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            type: item.type,
            topic: item.topic,
            date: item.date,
            startTimeRaw: item.startTimeRaw,
        }))
    );

    return normalized;
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