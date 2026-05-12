import { useState, useEffect, useRef, useCallback } from "react";
import { getAllSkills, getMySkills, createSkill } from "../api/skills";
import {
  getLearnerBookings,
  createBooking,
  confirmBooking,
  completeBooking,
  cancelBooking,
} from "../api/bookings";
import { transferCredits, createReview, createDispute } from "../api/index";
import { useAuth } from "../context/AuthContext";
export { default as useResponsive } from "./useResponsive";



export function useScrolled(threshold = 70) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const fn = () => setV(window.scrollY > threshold);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return v;
}

export function useReveal(delay = 0) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [delay]);
  return [ref, visible];
}

export function useMouseParallax(containerRef) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const handler = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const b = containerRef.current.getBoundingClientRect();
      setPos({
        x: ((e.clientX - b.left) / b.width) * 100,
        y: ((e.clientY - b.top) / b.height) * 100,
      });
    },
    [containerRef],
  );
  return [pos, handler];
}

export function useCounter(target) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let n = 0;
          const go = () => {
            n += Math.ceil((target - n) / 12);
            setValue(n >= target ? target : n);
            if (n < target) requestAnimationFrame(go);
          };
          go();
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return [ref, value];
}



function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchFn());
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
    
  }, deps);
  useEffect(() => {
    run();
  }, [run]);
  return { data, loading, error, refetch: run, setData };
}

export function usePublicSkills() {
  return useFetch(getAllSkills);
}

export function useMySkills() {
  const { user, isAuth } = useAuth();
  const result = useFetch(
    isAuth && user ? () => getMySkills(user.id) : () => Promise.resolve([]),
    [isAuth, user?.id],
  );
  const add = useCallback(
    async (payload) => {
      const created = await createSkill({ ...payload, ownerId: user?.id });
      result.setData((prev) => [...(prev || []), created]);
      return created;
    },
    [result, user?.id],
  );
  return { ...result, add };
}

export function useBookings() {
  const { user, isAuth, refreshUser } = useAuth();
  const result = useFetch(
    isAuth && user
      ? () => getLearnerBookings(user.id)
      : () => Promise.resolve([]),
    [isAuth, user?.id],
  );
  const book = useCallback(
    async (skillId, teacherId) => {
      const b = await createBooking({
        learnerId: user.id,
        teacherId,
        skillId,
        status: "pending",
      });
      result.setData((prev) => [...(prev || []), b]);
      await refreshUser();
      return b;
    },
    [result, user?.id, refreshUser],
  );
  const confirm = useCallback(
    async (id) => {
      const u = await confirmBooking(id);
      result.setData((prev) => prev.map((b) => (b.id === id ? u : b)));
      await refreshUser();
      return u;
    },
    [result, refreshUser],
  );
  const complete = useCallback(
    async (id) => {
      const u = await completeBooking(id);
      result.setData((prev) => prev.map((b) => (b.id === id ? u : b)));
      return u;
    },
    [result],
  );
  const cancel = useCallback(
    async (id) => {
      const u = await cancelBooking(id);
      result.setData((prev) => prev.map((b) => (b.id === id ? u : b)));
      await refreshUser();
      return u;
    },
    [result, refreshUser],
  );
  return { ...result, book, confirm, complete, cancel };
}

export function useTransferCredits() {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const transfer = useCallback(
    async (receiverEmail, amount) => {
      setLoading(true);
      setError(null);
      try {
        const r = await transferCredits({ receiverEmail, amount });
        await refreshUser();
        return r;
      } catch (e) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [refreshUser],
  );
  return { transfer, loading, error };
}

export function useSubmitReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const submit = useCallback(async (bookingId, rating, comment) => {
    setLoading(true);
    setError(null);
    try {
      return await createReview({ bookingId, rating, comment });
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { submit, loading, error };
}

export function useRaiseDispute() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const raise = useCallback(async (bookingId, reason) => {
    setLoading(true);
    setError(null);
    try {
      return await createDispute({ bookingId, reason });
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { raise, loading, error };
}
