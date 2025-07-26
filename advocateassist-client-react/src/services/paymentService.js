import axios from 'axios';
const API_BASE_URL = 'http://localhost:5268/api/Payments'; 
const paymentService = {
    getPayments: async () => {
        try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
        
        } catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
        }
    },
    };
export default paymentService;