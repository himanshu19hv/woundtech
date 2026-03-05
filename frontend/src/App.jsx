import React, { useState } from 'react';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import LoginPage from './features/auth/LoginPage';
import Layout from './components/common/Layout';
import CliniciansPage from './features/clinicians/CliniciansPage';
import PatientsPage from './features/patients/PatientsPage';
import VisitsPage from './features/visits/VisitsPage';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('visits');

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'visits' && <VisitsPage />}
        {activeTab === 'clinicians' && <CliniciansPage />}
        {activeTab === 'patients' && <PatientsPage />}
      </div>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
