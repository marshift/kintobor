// small Master Server API (https://mb.srb2.org/MS/tools/api/v1/) wrapper

const API_BASE_URL = "https://mb.srb2.org/MS/0";
const ERROR_CODES = [400, 403, 404];

export async function api(endpoint, options) {
    const res = await fetch(API_BASE_URL + endpoint, options);
    const body = await res.text();

    if (!res.ok) throw new Error(ERROR_CODES.includes(res.status) ? body : "MS request returned non-ok response");
    return body;
};

export const register = async (roomId, port, title, version) =>
    api(`/rooms/${roomId}/register`, {
        method: "POST",
        body: new URLSearchParams({ port, title, version }),
    });

export const update = async (serverId, title) =>
    api(`/servers/${serverId}/update`, {
        method: "POST",
        body: new URLSearchParams({ title }),
    });

export const unlist = async (serverId) => api(`/servers/${serverId}/unlist`, { method: "POST" });
