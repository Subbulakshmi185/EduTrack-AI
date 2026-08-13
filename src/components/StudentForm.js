import React, { useState } from 'react';
import studentService from '../services/studentService';

function StudentForm({ onStudentAdded }) {

    const [formData, setFormData] = useState({
        name: '',
        department: '',
        email: '',
        attendance: '',
        marks: '',
        assignmentCompletion: '',
        participation: ''
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setSubmitting(true);
        setErrors({});

        try {

            const studentData = {
                name: formData.name,
                department: formData.department,
                email: formData.email,

                attendance:
                    formData.attendance === ''
                        ? null
                        : Number(formData.attendance),

                marks:
                    formData.marks === ''
                        ? null
                        : Number(formData.marks),

                assignmentCompletion:
                    formData.assignmentCompletion === ''
                        ? null
                        : Number(formData.assignmentCompletion),

                participation:
                    formData.participation === ''
                        ? null
                        : Number(formData.participation)
            };

            await studentService.createStudent(studentData);

            // Clear form after successful creation
            setFormData({
                name: '',
                department: '',
                email: '',
                attendance: '',
                marks: '',
                assignmentCompletion: '',
                participation: ''
            });

            setSubmitting(false);

            if (onStudentAdded) {
                onStudentAdded();
            }

        } catch (err) {

            console.error(
                'Failed to add student:',
                err
            );

            setSubmitting(false);

            if (
                err.response &&
                err.response.data
            ) {

                setErrors(err.response.data);

            } else {

                setErrors({
                    general:
                        'Failed to add student. Please try again.'
                });
            }
        }
    };


    return (

        <div
            style={{
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                maxWidth: '500px',
                marginBottom: '20px'
            }}
        >

            <h3>
                👨‍🎓 Add New Student
            </h3>

            <p
                style={{
                    color: '#666',
                    fontSize: '14px'
                }}
            >
                Enter student information and performance
                data for EduTrack Intelligence.
            </p>


            <form onSubmit={handleSubmit}>


                {/* NAME */}

                <div
                    style={{
                        marginBottom: '12px'
                    }}
                >

                    <label>
                        Name:
                    </label>

                    <br />

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter student name"
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />

                    {errors.name && (
                        <p
                            style={{
                                color: 'red',
                                margin: '4px 0'
                            }}
                        >
                            {errors.name}
                        </p>
                    )}

                </div>


                {/* DEPARTMENT */}

                <div
                    style={{
                        marginBottom: '12px'
                    }}
                >

                    <label>
                        Department:
                    </label>

                    <br />

                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Example: CSE"
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />

                    {errors.department && (
                        <p
                            style={{
                                color: 'red',
                                margin: '4px 0'
                            }}
                        >
                            {errors.department}
                        </p>
                    )}

                </div>


                {/* EMAIL */}

                <div
                    style={{
                        marginBottom: '12px'
                    }}
                >

                    <label>
                        Email:
                    </label>

                    <br />

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@example.com"
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />

                    {errors.email && (
                        <p
                            style={{
                                color: 'red',
                                margin: '4px 0'
                            }}
                        >
                            {errors.email}
                        </p>
                    )}

                </div>


                {/* ANALYTICS SECTION */}

                <div
                    style={{
                        marginTop: '20px',
                        marginBottom: '12px'
                    }}
                >

                    <h4>
                        🧠 Student Performance
                    </h4>

                    <p
                        style={{
                            fontSize: '13px',
                            color: '#666'
                        }}
                    >
                        Enter values from 0 to 100.
                        EduTrack will automatically calculate
                        the student's Success Score.
                    </p>

                </div>


                {/* ATTENDANCE */}

                <div
                    style={{
                        marginBottom: '12px'
                    }}
                >

                    <label>
                        📅 Attendance (%):
                    </label>

                    <br />

                    <input
                        type="number"
                        name="attendance"
                        value={formData.attendance}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Example: 92"
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />

                    {errors.attendance && (
                        <p
                            style={{
                                color: 'red',
                                margin: '4px 0'
                            }}
                        >
                            {errors.attendance}
                        </p>
                    )}

                </div>


                {/* MARKS */}

                <div
                    style={{
                        marginBottom: '12px'
                    }}
                >

                    <label>
                        📚 Academic Marks (%):
                    </label>

                    <br />

                    <input
                        type="number"
                        name="marks"
                        value={formData.marks}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Example: 85"
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />

                    {errors.marks && (
                        <p
                            style={{
                                color: 'red',
                                margin: '4px 0'
                            }}
                        >
                            {errors.marks}
                        </p>
                    )}

                </div>


                {/* ASSIGNMENT */}

                <div
                    style={{
                        marginBottom: '12px'
                    }}
                >

                    <label>
                        📝 Assignment Completion (%):
                    </label>

                    <br />

                    <input
                        type="number"
                        name="assignmentCompletion"
                        value={formData.assignmentCompletion}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Example: 90"
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />

                    {errors.assignmentCompletion && (
                        <p
                            style={{
                                color: 'red',
                                margin: '4px 0'
                            }}
                        >
                            {errors.assignmentCompletion}
                        </p>
                    )}

                </div>


                {/* PARTICIPATION */}

                <div
                    style={{
                        marginBottom: '15px'
                    }}
                >

                    <label>
                        🙋 Participation (%):
                    </label>

                    <br />

                    <input
                        type="number"
                        name="participation"
                        value={formData.participation}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Example: 80"
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                    />

                    {errors.participation && (
                        <p
                            style={{
                                color: 'red',
                                margin: '4px 0'
                            }}
                        >
                            {errors.participation}
                        </p>
                    )}

                </div>


                {/* GENERAL ERROR */}

                {errors.general && (

                    <p
                        style={{
                            color: 'red'
                        }}
                    >
                        {errors.general}
                    </p>

                )}


                {/* BUTTON */}

                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        padding: '10px 18px',
                        cursor: submitting
                            ? 'not-allowed'
                            : 'pointer'
                    }}
                >

                    {submitting
                        ? '🧠 Analyzing...'
                        : '🚀 Add Student'}

                </button>


            </form>

        </div>
    );
}

export default StudentForm;