import { useEffect, useState } from 'react';
import { Alert, Spinner, Table } from 'react-bootstrap';
import paymentService from '../services/paymentService';


const PaymentList=()=>{
  const[payments,setPayments]=useState([]);
  const[loading,setLoading]=useState(true);
  const [error,setError]=useState(null);


  useEffect(()=>{
          fetchPayments();
  },[]);

  const fetchPayments=async()=>{
    try{
        setLoading(true);
        const data =await paymentService.getPayments();
        setPayments(data);
    }catch (err){
        setError('Failed to fetch payment.Please try again.');
        console.error(err);
    }finally{
        setLoading(false);
    }
  };

  if(loading){
    return(
         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
  }

  if(error){
    return <Alert variant="danger">{error}</Alert>
  }

  return(
     <div>
      <h2 className="mb-4">Payment List</h2>
      {payments.length ===0 ?(
         <Alert variant="info">No payment found.</Alert>
      ):(
         <Table striped bordered hover responsive>
           <thead>
            <tr>
                <th>Id</th>
                <th>Payment Head</th>
            </tr>
           </thead>

           <tbody>
            {payments.map((c)=>(
                <tr key={c.paymentId}>
                    <td>{c.paymentId}</td>
                    <td>{c.paymentHead}</td>

                </tr>
            ))}
           </tbody>
         </Table>
      )}
     </div>
  );
};

export default PaymentList;