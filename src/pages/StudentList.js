import React, { useEffect, useState } from 'react';
import studentService from '../services/studentService';
import StudentForm from '../components/StudentForm';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        setLoading(true);
        studentService.getAllStudents()
            .then((response) => {
                setStudents(response.data);
                setLoading(false);
                setError(null);
            })
            .catch((err) => {
                setError('Failed to fetch students. Make sure the backend is running.');
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            studentService.deleteStudent(id)
                .then(() => fetchStudents())
                .catch(() => alert('Failed to delete student.'));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <StudentForm onStudentAdded={fetchStudents} />

            <h2>Student List</h2>

            {loading && <p>Loading students...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.department}</td>
                                <td>{student.email}</td>
                                <td>
                                    <button onClick={() => handleDelete(student.id)} style={{ color: 'red' }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default StudentList;