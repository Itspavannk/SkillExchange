import { http } from "./client";

// ── Credits ─────────────────────────────────────
export const transferCredits = (body) => http.post("/credits/transfer", body);

// ── Reviews ─────────────────────────────────────
export const createReview = (body) => http.post("/reviews", body);
export const getUserReviews = (id) => http.get(`/reviews/user/${id}`);

// ── Disputes ────────────────────────────────────
export const createDispute = (body) => http.post("/disputes", body);
export const getBookingDispute = (id) => http.get(`/disputes/booking/${id}`);

// ── Admin ──────────────────────
export const adminGrantCredits = (body) =>
  http.post("/admin/grant-credits", body);
export const adminResolveDispute = (id, refund) =>
  http.post(`/admin/disputes/${id}/resolve`, { refund });
