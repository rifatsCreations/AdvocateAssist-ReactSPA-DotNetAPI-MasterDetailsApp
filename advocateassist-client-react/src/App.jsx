import { useState } from 'react';
import ClientList from './components/ClientList';
import Home from './components/Home';
import ClientFormModal from './components/ClientFormModal';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [clientToEdit, setClientToEdit] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [refreshClientList, setRefreshClientList] = useState(false); //  Added

  const handleAddClientClick = () => {
    setClientToEdit(null);
    setShowClientModal(true);
  };

  const handleEditClient = (client) => {
    setClientToEdit(client);
    setShowClientModal(true);
  };

  const handleFormClose = () => {
    setClientToEdit(null);
    setShowClientModal(false);
    setRefreshClientList(prev => !prev); //  Toggle to trigger list reload
    setActiveView('clients');
  };

  return (
    <div className="app-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '←' : '→'}
        </div>
        <div className="sidebar-menu">
          <button
            className={`menu-item ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => setActiveView('home')}
          >
            <i className="bi bi-house-door-fill"></i>
            <span className="menu-text">Home</span>
          </button>
          <button
            className={`menu-item ${activeView === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveView('clients')}
          >
            <i className="bi bi-people-fill"></i>
            <span className="menu-text">Client List</span>
          </button>
          <button
            className={`menu-item`}
            onClick={handleAddClientClick}
          >
            <i className="bi bi-person-plus-fill"></i>
            <span className="menu-text">Add Client</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeView === 'home' && (
          <Home onViewClients={() => setActiveView('clients')} />
        )}
        {activeView === 'clients' && (
          <ClientList
            onEdit={handleEditClient}
            onAddClient={handleAddClientClick}
            refreshTrigger={refreshClientList} //  Pass toggle
          />
        )}
      </div>

      {/* Modal */}
      <ClientFormModal
        show={showClientModal}
        onHide={handleFormClose}
        client={clientToEdit}
      />
    </div>
  );
}

export default App;
