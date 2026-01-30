import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import SkillsPage from '../pages/SkillsPage';
import LanguagesPage from '../pages/LanguagesPage';;
import CertificatesPage from '../pages/CertificatesPage';
import ExperiencesPage from '../pages/ExperiencesPage';
import NotFoundPage from '../pages/NotFoundPage';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      <Route path="/login" element={
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      } />
      
      <Route path="/register" element={
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      } />
      
      <Route path="/dashboard" element={
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      } />
      
      <Route path="/profile" element={
        <MainLayout>
          <ProfilePage />
        </MainLayout>
      } />
      
      <Route path="/skills" element={
        <MainLayout>
          <SkillsPage />
        </MainLayout>
      } />
      
      <Route path="/languages" element={
        <MainLayout>
          <LanguagesPage />
        </MainLayout>
      } />

      <Route path="/certificates" element={
        <MainLayout>
          <CertificatesPage />
        </MainLayout>
      } />
      
      <Route path="/experiences" element={
        <MainLayout>
          <ExperiencesPage />
        </MainLayout>
      } />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;