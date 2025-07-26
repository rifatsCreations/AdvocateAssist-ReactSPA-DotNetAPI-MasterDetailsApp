import { Modal } from 'react-bootstrap';
import ClientForm from './ClientForm';

const ClientFormModal = ({ show, onHide, client }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static"  dialogClassName="client-form-modal"  >
      <Modal.Header closeButton>
        <Modal.Title>{client ? 'Edit Client' : 'Add New Client'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ClientForm client={client} onClose={onHide} />
      </Modal.Body>
    </Modal>
  );
};

export default ClientFormModal;
