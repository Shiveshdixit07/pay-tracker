import axios from "axios";

const API = axios.create({ baseURL: "https://pay-tracker-backend.onrender.com/api" });

export const login = (credentials) => API.post("/auth/login", credentials);
export const signup = (userData) => API.post("/auth/signup", userData);
