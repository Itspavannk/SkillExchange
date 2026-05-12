import { http } from "./client";

export const raiseDispute = (bookingId, reason) =>
  http.post(`/disputes/${bookingId}`, { reason });

export const createBooking = (body) => http.post("/bookings", body);

export const getBooking = (id) => http.get(`/bookings/${id}`);

export const getLearnerBookings = () => http.get(`/bookings/me/learner`);

export const getTeacherBookings = () => http.get(`/bookings/me/teacher`);
export const confirmBooking = (id) => http.post(`/bookings/${id}/confirm`);

export const completeBooking = (id) => http.post(`/bookings/${id}/complete`);

export const cancelBooking = (id) => http.post(`/bookings/${id}/cancel`);
