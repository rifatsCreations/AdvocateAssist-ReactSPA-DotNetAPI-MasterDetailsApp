import axios from 'axios';

const API_BASE_URL = 'http://localhost:5268/api/Clients';

const clientService = {

    // 🔹 Get all Cilent
    getClients: async () => {
        try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
        } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
        }
    },

     // 🔹 Get Client by ID
    getClient: async (id) => {
        try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
        } catch (error) {
        console.error(`Error fetching Client with ID ${id}:`, error);
        throw error;
        }
    },


    // 🔹 Create Client
    createClient: async (data) => {
        try {
        const formData = clientService.buildClientFormData(data);

        const response = await axios.post(API_BASE_URL, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
        } catch (error) {
        console.error('Error creating Client:', error.response?.data || error.message);
        throw error;
        }
    },


     // 🔹 Update Client
    updateClient: async (id, data) => {
        try {
        const formData = clientService.buildClientFormData(data);

        const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
        } catch (error) {
        console.error(`Error updating client with ID ${id}:`, error.response?.data || error.message);
        throw error;
        }
    },

     // 🔹 Delete Client
    deleteClient: async (id) => {
        try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.data;
        } catch (error) {
        console.error(`Error deleting client with ID ${id}:`, error);
        throw error;
        }
    },

    // 🔹 Build FormData for POST/PUT
    buildClientFormData: (data) => {
        const formData = new FormData();

        for (const key in data) {
        if (data[key] === null || data[key] === undefined) continue;

        //Special handling for pictureFile
        if (key === 'pictureFile' && data[key] instanceof File) {
            formData.append('pictureFile', data.pictureFile);
        }

        //Special handling for picture string (old picture)
        else if (key === 'picture' && !data.pictureFile) {
            if (data[key] !== '') {
            formData.append('picture', data.picture);
            }
        }

        //Special handling for legalAssistantCasesJson (already a JSON string)
        else if (key === 'clientPaymentsJson') {
            formData.append(key, data[key]); // assumed stringified already
        }

        //Everything else
        else {
            formData.append(key, data[key]);
        }
        }

        return formData;
    },

};

export default clientService;
