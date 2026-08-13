import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/students';

const studentService = {
    getAllStudents: () => axios.get(API_BASE_URL),
    getStudentById: (id) => axios.get(`${API_BASE_URL}/${id}`),
    createStudent: (student) => axios.post(API_BASE_URL, student),
    updateStudent: (id, student) => axios.put(`${API_BASE_URL}/${id}`, student),
    deleteStudent: (id) => axios.delete(`${API_BASE_URL}/${id}`),
    searchByName: (name) => axios.get(`${API_BASE_URL}/search/name?name=${name}`),
};

export default studentService;