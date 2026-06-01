import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import GlobalStyles from "./styles/GlobalStyles";
import { Cursor, GrainOverlay } from "./components/primitives";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import AddSkillModal from "./components/AddSkillModal";
import Marquee from "./components/Marquee";
import SessionsPage from "./pages/SessionsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDisputesPage from "./pages/AdminDisputesPage";
import NotificationsPage from "./pages/NotificationsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import MySkillsPage from "./pages/MySkillsPage";

import {
  HeroSection,
  HowItWorksSection,
  SkillsGridSection,
  CreditsSection,
  TestimonialsSection,
  CTASection,
  Footer,
} from "./components/sections";

function AppShell({ children }) {
  const [modal, setModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const { isAuth } = useAuth();

  return (
    <div style={{ background: "#07080f", minHeight: "100vh" }}>
      <GlobalStyles />
      <GrainOverlay />
      <Cursor />
      <AuthModal open={modal} onClose={() => setModal(false)} />
      <AddSkillModal
        open={skillModal}
        onClose={() => setSkillModal(false)}
        onCreated={() => window.location.reload()}
      />
      <Navbar
        onOpenModal={() => setModal(true)}
        onAddSkill={() => setSkillModal(true)}
      />
      {children}
    </div>
  );
}

function Home() {
  const [modal, setModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const { isAuth } = useAuth();

  return (
    <div style={{ background: "#07080f", minHeight: "100vh" }}>
      <GlobalStyles />
      <GrainOverlay />
      <Cursor />
      <AuthModal open={modal} onClose={() => setModal(false)} />
      <AddSkillModal
        open={skillModal}
        onClose={() => setSkillModal(false)}
        onCreated={() => window.location.reload()}
      />
      <Navbar
        onOpenModal={() => setModal(true)}
        onAddSkill={() => setSkillModal(true)}
      />

      <main>
        <HeroSection onOpenModal={() => setModal(true)} isAuth={isAuth} />
        <Marquee />
        <HowItWorksSection />
        <SkillsGridSection isAuth={isAuth} onOpenModal={() => setModal(true)} />
        <CreditsSection />
        <TestimonialsSection />
        <CTASection
          onOpenModal={() => setModal(true)}
          isAuth={isAuth}
          onAddSkill={() => setSkillModal(true)}
        />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/sessions"
            element={
              <AppShell>
                <SessionsPage />
              </AppShell>
            }
          />
          <Route
            path="/profile"
            element={
              <AppShell>
                <ProfilePage />
              </AppShell>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/disputes" element={<AdminDisputesPage />} />
          <Route
            path="/notifications"
            element={
              <AppShell>
                <NotificationsPage />
              </AppShell>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <AppShell>
                <LeaderboardPage />
              </AppShell>
            }
          />

          <Route
            path="/help"
            element={
              <AppShell>
                <HelpCenterPage />
              </AppShell>
            }
          />
          <Route
            path="/my-skills"
            element={
              <AppShell>
                <MySkillsPage />
              </AppShell>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
