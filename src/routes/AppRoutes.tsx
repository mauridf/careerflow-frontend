import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
// import ResumePage from '../pages/ResumePage';
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
      
      {/* <Route path="/resume" element={
        <MainLayout>
          <ResumePage />
        </MainLayout>
      } /> */}
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;