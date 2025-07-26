import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import clientService from '../services/clientService.js';
import paymentService from '../services/paymentService.js';


const ClientForm = ({ client, onClose =()=>{}}) => {          
  const [formData, setFormData] = useState({
    clientFname: '',
    clientLname:'',
    dateOfBirth: '',
    email:'',
    phoneNumber: '',
    referredBy:'',
    picture: '', // Existing picture URL from API
    pictureFile: null, // New file selected for upload
    nidNumber:'',
    division:'',
    district:'',
    city:'',

    clientPayments: [], // Will store { paymentId, PaymentHead, amount,receiptNumber,transactionNumber,remarks, candidateSkillId? }
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [allPayments, setAllPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all available payments when the component mounts
  useEffect(() => {
  // Fetch all available payments on component mount
  fetchPayments();
}, []);

useEffect(() => {
  if (client) {
    console.log('🟢 Full client object:', client);

    setFormData({
      clientFname: client.clientFname || '',
      clientLname: client.clientLname || '',
      dateOfBirth: client.dateOfBirth ? formatDateToInput(client.dateOfBirth) : '',
      email: client.email || '',
      phoneNumber: client.phoneNumber || '',
      referredBy: client.referredBy || '',
      picture: client.picture || '',
      pictureFile: null,
      nidNumber: client.nidNumber || '',
      division: client.division || '',
      district: client.district || '',
      city: client.city || '',

      clientPayments: Array.isArray(client.clientPayments)
        ? client.clientPayments.map(pay => ({
            clientPaymentId: pay.clientPaymentId,
            paymentId: pay.paymentId,
            paymentHead: pay.paymentHead,
            amount: pay.amount,
            paymentDate: pay.paymentDate ? formatDateToInput(pay.paymentDate) : '',
            receiptNumber: pay.receiptNumber,
            transactionNo: pay.transactionNo,
            remarks: pay.remarks,
          }))
        : [],
    });

    setImagePreviewUrl(
      client.picture ? `http://localhost:5268/images/${client.picture}` : null
    );
  } else {
    // Reset to empty state when creating new
    setFormData({
      clientFname: '',
      clientLname: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
      referredBy: '',
      picture: '',
      pictureFile: null,
      nidNumber: '',
      division: '',
      district: '',
      city: '',
      clientPayments: [],
    });

    setImagePreviewUrl(null);
  }

  // Cleanup image preview URL if component unmounts or client changes
  return () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
  };
}, [client]);


const fetchPayments = async () => {
  try {
    setLoadingPayments(true);
    const data = await paymentService.getPayments();
    setAllPayments(data);
  } catch (err) {
    setError('Failed to fetch payment. Please try again.');
    console.error(err);
  } finally {
    setLoadingPayments(false);
  }
};


  // General change handler for form inputs
  const handleChange = (e) => {
  const { name, value, type, files } = e.target;

  if (type === 'file') {
    const file = files[0];
    setFormData((prev) => ({
      ...prev,
      pictureFile: file,
    }));

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setImagePreviewUrl(fileUrl);
    } else {
      setImagePreviewUrl(null);
    }
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};




 function formatDateToInput(date) {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }





   // Handler for changes within client payments array
  const handlePaymentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPayments = [...formData.clientPayments];

    if (name === "paymentId") {
      // When paymentId changes, also update paymentHead for the selected payment
      const selectedPayment = allPayments.find(s => s.paymentId === parseInt(value));
      updatedPayments[index] = {
        ...updatedPayments[index],
        paymentId: parseInt(value),
        paymentHead: selectedPayment ? selectedPayment.paymentHead : '', // Update paymentHead
      };
    } else {
      updatedPayments[index] = {
        ...updatedPayments[index],
        [name]: name === "paymentDate" ? value : parseInt(value) || value,
      };
    }

    setFormData((prev) => ({
      ...prev,
      clientPayments: updatedPayments,
    }));
  };

  // Adds a new empty payment entry to the form
  const addPayment = () => {
    setFormData((prev) => ({
      ...prev,
      // Initialize with empty values, including paymentHead for consistency
      clientPayments: [...prev.clientPayments, { paymentId: '', paymentHead: '', amount: '',paymentDate:'',
      receiptNumber:'',
      transactionNo:'',
      remarks:''
       }],
    }));
  };

  // Removes a payment entry from the form
  const removePayment = (index) => {
    setFormData((prev) => ({
      ...prev,
      clientPayments: prev.clientPayments.filter((_, i) => i !== index),
    }));
  };


  // Handles form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoadingSubmit(true);

    // Prepare clients payments for submission, ENSURING PASCALCASE for API
    const paymentsToSend = formData.clientPayments.map(payment => {
      return {
          // Send ClientPaymentId only if it exists (for updates).
          // Providing || 0 for new payment if your API's model requires it as int,
          // otherwise it can be omitted or set to null if the API supports nullable int.
          ClientPaymentId: payment.clientPaymentId || 0,
          PaymentId: payment.paymentId,
          PaymentHead: payment.paymentHead,
          Amount: payment.amount,
          PaymentDate: payment.paymentDate,
          ReceiptNumber:payment.receiptNumber,
          TransactionNo:payment.transactionNo,
          remarks:payment.remarks
      };
    });

   const dataToSubmit = {
    ...formData,
    ClientPaymentsJson: JSON.stringify(paymentsToSend), 
  };

    // --- Image Handling Logic for Submission ---
    // If no new pictureFile is selected, and the 'picture' field is empty, remove 'picture' from payload
    // This prevents sending an empty string for 'picture' if no image ever existed or was explicitly removed
    if (!formData.pictureFile && dataToSubmit.picture === '') {
        delete dataToSubmit.picture;
    }
    // If a new pictureFile is present, the API will handle the file upload.
    // In this case, we remove the old 'picture' string from the payload
    // as it will be replaced by the new file.
    if (formData.pictureFile) {
        delete dataToSubmit.picture;
    }
    // Always ensure pictureFile is only sent if it's an actual File object,
    // otherwise delete it from the payload to avoid sending 'null' or 'undefined'
    if (!(dataToSubmit.pictureFile instanceof File)) {
        delete dataToSubmit.pictureFile;
    }
    // --- End Image Handling Logic ---

    try {
      if (client) {
        // Update existing client
        await clientService.updateClient(client.clientId, dataToSubmit);
        setSuccess('Client updated successfully!');
      } else {
        // Create new client
        await clientService.createClient(dataToSubmit);
        setSuccess('Client created successfully!');
        // Reset form and preview after successful creation for next entry
        setFormData({
        clientFname: '',
        clientLname:'',
        dateOfBirth: '',
        email:'',
        phoneNumber: '',
        referredBy:'',
        picture: '', 
        pictureFile: null, 
        nidNumber:'',
        division:'',
        district:'',
        city:'',
        clientPayments: [],
        });
        setImagePreviewUrl(null);
        // Manually clear file input element (important as state reset doesn't clear file inputs)
        e.target.elements.pictureFile.value = '';
      }
      onClose(); // Go back to the list view after success
    } catch (err) {
      const errorMessage = err.response && err.response.data
        ? JSON.stringify(err.response.data) // Stringify complex validation errors for display
        : err.message;
      setError(`Operation failed: ${errorMessage}`);
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Display loading spinner while payments are being fetched
  if (loadingPayments) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading payments...</span>
        </Spinner>
      </div>
    );
  }

  // Main form rendering
  return (



<Card className="p-3 border-0 shadow-sm rounded bg-light">
  <Card.Body>
    {error && <Alert variant="danger">{error}</Alert>}
    {success && <Alert variant="success">{success}</Alert>}

    <Form onSubmit={handleSubmit}>
      {/* Client Name & DOB */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formClientFname">
          <Form.Label className="form-label-sm">First Name</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            name="clientFname"
            placeholder="Enter first name"
            value={formData.clientFname}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formClientLname">
          <Form.Label className="form-label-sm">Last Name</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            name="clientLname"
            placeholder="Enter last name"
            value={formData.clientLname}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formDateOfBirth">
          <Form.Label className="form-label-sm">Date of Birth</Form.Label>
          <Form.Control
            size="sm"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      {/* Contact & NID */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formEmail">
          <Form.Label className="form-label-sm">Email</Form.Label>
          <Form.Control
            size="sm"
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formPhoneNumber">
          <Form.Label className="form-label-sm">Phone Number</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            name="phoneNumber"
            placeholder="01XXXXXXXXX"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            maxLength={11}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formNidNumber">
          <Form.Label className="form-label-sm">NID Number</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            name="nidNumber"
            placeholder="Enter NID number"
            value={formData.nidNumber}
            onChange={handleChange}
            required
            maxLength={16}
          />
        </Form.Group>
      </Row>

      {/* Reference & Address */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formReferredBy">
          <Form.Label className="form-label-sm">Referred By</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            name="referredBy"
            placeholder="Reference name"
            value={formData.referredBy}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formDivision">
          <Form.Label className="form-label-sm">Division</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            name="division"
            placeholder="Enter division"
            value={formData.division}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formDistrict">
          <Form.Label className="form-label-sm">District</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            name="district"
            placeholder="Enter district"
            value={formData.district}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formCity">
          <Form.Label className="form-label-sm">City</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
          />
        </Form.Group>
      </Row>

      {/* Picture Upload */}
      <Row className="mb-4">
        <Form.Group as={Col} controlId="formPictureFile">
          <Form.Label className="form-label-sm">Picture</Form.Label>
          <Form.Control
            size="sm"
            type="file"
            name="pictureFile"
            accept="image/*"
            onChange={handleChange}
          />
          {(imagePreviewUrl || formData.picture) && (
            <div className="mt-2">
              <p className="mb-1">Image Preview:</p>
              <img
                src={imagePreviewUrl || formData.picture}
                alt="Preview"
                style={{
                  maxWidth: '100px',
                  height: 'auto',
                  border: '1px solid #ccc',
                  padding: '2px',
                }}
                className="img-thumbnail"
              />
            </div>
          )}
        </Form.Group>
      </Row>

      {/* Payments */}
      <h6 className="mt-4 mb-3">Client Payments</h6>
      {formData.clientPayments.map((payment, index) => (
        <Card key={index} className="mb-3 p-3 bg-light border-0 rounded">
          <Row>
            <Col md={4}>
              <Form.Group controlId={`paymentSelect-${index}`}>
                <Form.Label className="form-label-sm">Payment Type</Form.Label>
                <Form.Select
                  size="sm"
                  name="paymentId"
                  value={payment.paymentId}
                  onChange={(e) => handlePaymentChange(index, e)}
                  required
                >
                  <option value="">Select Payment</option>
                  {allPayments.map((p) => (
                    <option key={p.paymentId} value={p.paymentId}>
                      {p.paymentHead}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group controlId={`amount-${index}`}>
                <Form.Label className="form-label-sm">Amount</Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={payment.amount}
                  onChange={(e) => handlePaymentChange(index, e)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId={`paymentDate-${index}`}>
                <Form.Label className="form-label-sm">Payment Date</Form.Label>
                <Form.Control
                  size="sm"
                  type="date"
                  name="paymentDate"
                  value={payment.paymentDate}
                  onChange={(e) => handlePaymentChange(index, e)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={4}>
              <Form.Group controlId={`receiptNumber-${index}`}>
                <Form.Label className="form-label-sm">Receipt</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="receiptNumber"
                  placeholder="Receipt number"
                  value={payment.receiptNumber}
                  onChange={(e) => handlePaymentChange(index, e)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId={`transactionNo-${index}`}>
                <Form.Label className="form-label-sm">Transaction</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="transactionNo"
                  placeholder="Transaction number"
                  value={payment.transactionNo}
                  onChange={(e) => handlePaymentChange(index, e)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId={`remarks-${index}`}>
                <Form.Label className="form-label-sm">Remarks</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="remarks"
                  placeholder="Any remarks"
                  value={payment.remarks}
                  onChange={(e) => handlePaymentChange(index, e)}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
                <Button
                 onClick={() => removePayment(index)}
                className="mt-4 w-100"
                style={{
                backgroundColor: '#fdfdfdff',
                color: 'maroon',
                fontWeight: '600',
                padding: '6px 16px',
                borderRadius: '14px',
                border: 'none',
                fontSize: '0.9rem',
                boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
                 onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6e1b30';
                e.currentTarget.style.color = '#ffffff'; //  make text white on hover
              }}
                 onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffffff';
                e.currentTarget.style.color = 'maroon'; //  reset to maroon on mouse leave
              }}
            >
              Remove
            </Button>

            </Col>
          </Row>
        </Card>
      ))}

      <Button onClick={addPayment} className="mb-4 custom-btn">
        + Add Payment
      </Button>

      {/* Final Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button onClick={onClose} className="btn-cancel">
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={loadingSubmit}
          className="btn-submit"
        >
          {loadingSubmit ? (
            <>
              <Spinner as="span" animation="border" size="sm" />
              Saving...
            </>
          ) : client ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </Form>
  </Card.Body>
</Card>



  );
};



export default ClientForm;
