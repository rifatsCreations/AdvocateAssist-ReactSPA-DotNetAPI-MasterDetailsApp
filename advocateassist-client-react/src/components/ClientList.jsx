import { useEffect, useState } from 'react';
import { Alert, Button, Spinner, Collapse } from 'react-bootstrap';
import clientService from '../services/clientService';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const imageBaseUrl = 'http://localhost:5268/images/';

const ClientList = ({ onEdit, onAddClient, refreshTrigger }) => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [openPayments, setOpenPayments] = useState({});

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data || []);
    } catch (err) {
      setError('Failed to fetch Clients. Please try again.');
      console.error(err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        await clientService.deleteClient(clientToDelete.clientId);
        fetchClients();
        setShowDeleteModal(false);
        setClientToDelete(null);
      } catch (err) {
        setError(`Failed to delete client: ${err.message}`);
        console.error(err);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  const togglePayments = (clientId) => {
    setOpenPayments((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.clientFname} ${client.clientLname}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="fw-bold" style={{ color: 'rgba(15, 15, 15, 0.7)', fontSize: '1.4rem' }}>Client List</h2>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div style={{ width: '180px' }}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.9rem', boxShadow: 'none',
                outline: 'none', }}
              />
            </div>
          </div>

          <Button
            onClick={onAddClient}
            style={{
              backgroundColor: '#fdfdfdff',
              color: '#000000ff',
              fontWeight: '600',
              padding: '6px 16px',
              borderRadius: '30px',
              border: 'none',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ffffffff'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffffff'}
          >
            <i className="bi bi-plus-circle me-2"></i> Add Client
          </Button>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <Alert variant="warning" className="text-center">
          No clients match your search.
        </Alert>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {filteredClients.map((client) => (
            <div key={client.clientId} className="col">
              <div className="card h-100 border-0 custom-card-shadow">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {client.picture ? (
                      <img
                        src={imageBaseUrl + client.picture}
                        alt={`${client.clientFname} ${client.clientLname}`}
                        className="rounded-circle shadow"
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white"
                        style={{ width: 60, height: 60 }}
                      >
                        N/A
                      </div>
                    )}
                    <div>
                      <h5 className="mb-0 text-teal fw-semibold">
                        {client.clientFname} {client.clientLname}
                      </h5>
                      <small className="text-muted">{new Date(client.dateOfBirth).toLocaleDateString()}</small>
                    </div>
                  </div>

                  <p className="mb-1"><strong>Email:</strong> {client.email}</p>
                  <p className="mb-1"><strong>Phone:</strong> {client.phoneNumber}</p>
                  <p className="mb-1"><strong>Referred By:</strong> {client.referredBy || 'N/A'}</p>
                  <p className="mb-1"><strong>NID:</strong> {client.nidNumber || 'N/A'}</p>

                  <p className="mb-1">
                    <strong>Address:</strong> {client.division}, {client.district}, {client.city}
                  </p>

                  {client.clientPayments && client.clientPayments.length > 0 ? (
                    <>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => togglePayments(client.clientId)}
                        aria-controls={`payments-collapse-${client.clientId}`}
                        aria-expanded={!!openPayments[client.clientId]}
                        className="mb-2"
                      >
                        {openPayments[client.clientId] ? 'Hide Payments' : `Show Payments (${client.clientPayments.length})`}
                      </Button>

                      <Collapse in={!!openPayments[client.clientId]}>
                        <ul
                          id={`payments-collapse-${client.clientId}`}
                          className="list-group list-group-flush small"
                          style={{ maxHeight: '120px', overflowY: 'auto' }}
                        >
                          {client.clientPayments.map((payment, idx) => (
                            <li key={idx} className="list-group-item px-0 py-1">
                              <span className="text-primary fw-semibold">{payment.paymentHead}</span> — {payment.amount} Taka |{' '}
                              {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                {payment.receiptNumber && <>Receipt: {payment.receiptNumber}</>}
                                {payment.transactionNo && <> | Txn: {payment.transactionNo}</>}
                                {payment.remarks && <> | {payment.remarks}</>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    </>
                  ) : (
                    <p className="text-muted mt-3 mb-0">No Payments</p>
                  )}
                </div>

                <div className="card-footer bg-transparent border-0 d-flex justify-content-end gap-2">
                  <Button className='EditButton' size="sm" onClick={() => onEdit(client)}>
                    Edit
                  </Button>
                  <Button className='DeleteButton' size="sm" onClick={() => handleDeleteClick(client)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleConfirm={confirmDelete}
        itemName={`${clientToDelete?.clientFname} ${clientToDelete?.clientLname}`}
      />
    </div>
  );
};

export default ClientList;
