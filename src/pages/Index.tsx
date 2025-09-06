import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PatientDashboard } from "@/components/patient/PatientDashboard";
import { DoctorDashboard } from "@/components/doctor/DoctorDashboard";

const Index = () => {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userType: 'patient' | 'doctor', userData: any) => {
    setUser({ ...userData, type: userType });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.type === 'patient') {
    return <PatientDashboard user={user} onLogout={handleLogout} />;
  }

  return <DoctorDashboard user={user} onLogout={handleLogout} />;
};

export default Index;
