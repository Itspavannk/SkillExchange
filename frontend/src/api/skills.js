import { http } from "./client";

export const getAllSkills = () => http.get("/skills");

export const getMySkills = (ownerId) => http.get(`/skills/me/${ownerId}`);


export const createSkill = (body) => http.post("/skills", body);
