import React, { useEffect, useState } from 'react';
import studentService from '../services/studentService';
import StudentForm from '../components/StudentForm';

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // ============================================================
    // LOAD STUDENTS
    // ============================================================

    const loadStudents = async () => {
        try {
            const response = await studentService.getAllStudents();

            const studentList = response.data || [];

            setStudents(studentList);
            setLoading(false);

            loadAnalytics(studentList);
        } catch (error) {
            console.error('Failed to load students:', error);
            setLoading(false);
        }
    };

    // ============================================================
    // LOAD ANALYTICS
    // ============================================================

    const loadAnalytics = async (studentList) => {
        setAnalyticsLoading(true);

        try {
            const analyticsResults = await Promise.all(
                studentList.map(async (student) => {
                    try {
                        const response = await fetch(
                            `http://localhost:8080/students/${student.id}/analytics`
                        );

                        if (!response.ok) {
                            throw new Error(
                                `Analytics failed for student ${student.id}`
                            );
                        }

                        const data = await response.json();

                        return {
                            id: student.id,
                            data: data
                        };
                    } catch (error) {
                        console.error(
                            `Analytics error for student ${student.id}:`,
                            error
                        );

                        return {
                            id: student.id,
                            data: null
                        };
                    }
                })
            );

            const analyticsMap = {};

            analyticsResults.forEach((result) => {
                analyticsMap[result.id] = result.data;
            });

            setAnalytics(analyticsMap);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        loadStudents();
    }, []);

    // ============================================================
    // REFRESH AFTER ADDING STUDENT
    // ============================================================

    const handleStudentAdded = () => {
        loadStudents();
    };

    // ============================================================
    // BASIC STATISTICS
    // ============================================================

    const totalStudents = students.length;

    const departments = new Set(
        students
            .map((student) => student.department)
            .filter(Boolean)
    ).size;

    // ============================================================
    // AVERAGE ATTENDANCE
    // ============================================================

    const studentsWithAttendance = students.filter(
        (student) =>
            student.attendance !== null &&
            student.attendance !== undefined
    );

    const averageAttendance =
        studentsWithAttendance.length > 0
            ? (
                  studentsWithAttendance.reduce(
                      (sum, student) =>
                          sum + Number(student.attendance),
                      0
                  ) / studentsWithAttendance.length
              ).toFixed(1)
            : 0;

    // ============================================================
    // AT RISK STUDENTS
    // ============================================================

    const atRiskStudents = Object.values(analytics).filter(
        (item) =>
            item &&
            item.riskLevel === 'HIGH'
    ).length;

    // ============================================================
    // AVERAGE SUCCESS SCORE
    // ============================================================

    const studentsWithScores = Object.values(analytics).filter(
        (item) =>
            item &&
            item.successScore !== null &&
            item.successScore !== undefined
    );

    const averageSuccessScore =
        studentsWithScores.length > 0
            ? (
                  studentsWithScores.reduce(
                      (sum, item) =>
                          sum + Number(item.successScore),
                      0
                  ) / studentsWithScores.length
              ).toFixed(1)
            : 0;

    // ============================================================
    // RISK COLOR
    // ============================================================

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'LOW':
                return '#16a34a';

            case 'MEDIUM':
                return '#f59e0b';

            case 'HIGH':
                return '#dc2626';

            default:
                return '#6b7280';
        }
    };

    // ============================================================
    // RISK ICON
    // ============================================================

    const getRiskIcon = (risk) => {
        switch (risk) {
            case 'LOW':
                return '🟢';

            case 'MEDIUM':
                return '🟡';

            case 'HIGH':
                return '🔴';

            default:
                return '⚪';
        }
    };

    // ============================================================
    // STATUS ICON
    // ============================================================

    const getStatusIcon = (status) => {
        switch (status) {
            case 'EXCELLENT':
                return '🏆';

            case 'GOOD':
                return '👍';

            case 'NEEDS_ATTENTION':
                return '⚠️';

            case 'AT_RISK':
                return '🚨';

            default:
                return '📊';
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading EduTrack Intelligence...
            </div>
        );
    }

    return (
        <div className="dashboard">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="dashboard-header">
                <div>
                    <h1>EduTrack AI</h1>

                    <p>
                        Student Success Intelligence Platform
                    </p>
                </div>

                <div className="admin-profile">
                    👤 Admin
                </div>
            </div>

            {/* ==================================================
                WELCOME
            ================================================== */}

            <div className="welcome-section">
                <h2>
                    Welcome back, Admin 👋
                </h2>

                <p>
                    Here's an overview of your student
                    success ecosystem.
                </p>
            </div>

            {/* ==================================================
                ADD STUDENT
            ================================================== */}

            <StudentForm
                onStudentAdded={handleStudentAdded}
            />

            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="stats-grid">

                {/* TOTAL STUDENTS */}

                <div className="stat-card">
                    <div className="stat-icon">
                        👨‍🎓
                    </div>

                    <div>
                        <h3>
                            {totalStudents}
                        </h3>

                        <p>
                            Total Students
                        </p>
                    </div>
                </div>

                {/* DEPARTMENTS */}

                <div className="stat-card">
                    <div className="stat-icon">
                        📚
                    </div>

                    <div>
                        <h3>
                            {departments}
                        </h3>

                        <p>
                            Departments
                        </p>
                    </div>
                </div>

                {/* ATTENDANCE */}

                <div className="stat-card">
                    <div className="stat-icon">
                        📅
                    </div>

                    <div>
                        <h3>
                            {averageAttendance}%
                        </h3>

                        <p>
                            Avg. Attendance
                        </p>
                    </div>
                </div>

                {/* AT RISK */}

                <div className="stat-card danger-card">
                    <div className="stat-icon">
                        ⚠️
                    </div>

                    <div>
                        <h3>
                            {atRiskStudents}
                        </h3>

                        <p>
                            Students At Risk
                        </p>
                    </div>
                </div>

            </div>

            {/* ==================================================
                AI SUMMARY
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: '20px',
                    padding: '25px'
                }}
            >

                <div className="card-header">

                    <div>
                        <h2>
                            🧠 EduTrack Intelligence
                        </h2>

                        <p>
                            Real-time student success analysis
                        </p>
                    </div>

                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '20px',
                        marginTop: '20px'
                    }}
                >

                    {/* SUCCESS SCORE */}

                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '12px',
                            background: '#eef2ff'
                        }}
                    >

                        <div style={{ fontSize: '28px' }}>
                            🎯
                        </div>

                        <h3>
                            {averageSuccessScore}%
                        </h3>

                        <p>
                            Average Success Score
                        </p>

                    </div>

                    {/* AT RISK */}

                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '12px',
                            background: '#fef2f2'
                        }}
                    >

                        <div style={{ fontSize: '28px' }}>
                            🚨
                        </div>

                        <h3>
                            {atRiskStudents}
                        </h3>

                        <p>
                            Students Requiring Attention
                        </p>

                    </div>

                    {/* ENGINE */}

                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '12px',
                            background: '#f0fdf4'
                        }}
                    >

                        <div style={{ fontSize: '28px' }}>
                            🤖
                        </div>

                        <h3>
                            {analyticsLoading
                                ? 'Analyzing...'
                                : 'Ready'}
                        </h3>

                        <p>
                            Intelligence Engine
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================================
                PERFORMANCE OVERVIEW
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: '20px'
                }}
            >

                <div className="card-header">

                    <div>
                        <h2>
                            📈 Student Success Overview
                        </h2>

                        <p>
                            Live success scores from your students
                        </p>
                    </div>

                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '20px',
                        minHeight: '220px',
                        padding: '30px 20px 10px',
                        overflowX: 'auto'
                    }}
                >

                    {students.slice(0, 8).map((student) => {

                        const data =
                            analytics[student.id];

                        const score =
                            data &&
                            data.successScore !== null &&
                            data.successScore !== undefined
                                ? Number(data.successScore)
                                : 0;

                        return (
                            <div
                                key={student.id}
                                style={{
                                    minWidth: '80px',
                                    textAlign: 'center'
                                }}
                            >

                                <div
                                    style={{
                                        height: '150px',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center'
                                    }}
                                >

                                    <div
                                        title={`${student.name}: ${score}%`}
                                        style={{
                                            width: '45px',
                                            height: `${Math.max(
                                                score * 1.5,
                                                5
                                            )}px`,
                                            borderRadius:
                                                '8px 8px 0 0',
                                            background:
                                                getRiskColor(
                                                    data?.riskLevel
                                                ),
                                            transition:
                                                'height 0.5s ease'
                                        }}
                                    />

                                </div>

                                <strong>
                                    {score.toFixed(0)}%
                                </strong>

                                <div
                                    style={{
                                        fontSize: '12px',
                                        marginTop: '5px'
                                    }}
                                >
                                    {student.name}
                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

            {/* ==================================================
                INSIGHT
            ================================================== */}

            <div
                className="dashboard-card insight-card"
                style={{
                    marginTop: '20px'
                }}
            >

                <div className="insight-icon">
                    🧠
                </div>

                <h2>
                    EduTrack Insight
                </h2>

                <p>
                    EduTrack is continuously analyzing
                    attendance, academic performance,
                    assignment completion and student
                    participation.
                </p>

                <div className="insight-status">
                    ✨ Intelligence Engine Active
                </div>

            </div>

            {/* ==================================================
                STUDENT INTELLIGENCE TABLE
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: '20px'
                }}
            >

                <div className="card-header">

                    <div>
                        <h2>
                            👨‍🎓 Student Intelligence
                        </h2>

                        <p>
                            Real-time student success analysis
                        </p>
                    </div>

                </div>

                {students.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            🎓
                        </div>

                        <p>
                            No students available
                        </p>

                    </div>

                ) : (

                    <div className="student-table-wrapper">

                        <table className="student-table">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Success Score
                                    </th>

                                    <th>
                                        Risk
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Intelligence
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {students
                                    .slice(0, 5)
                                    .map((student) => {

                                        const data =
                                            analytics[
                                                student.id
                                            ];

                                        return (

                                            <tr
                                                key={student.id}
                                            >

                                                {/* ID */}

                                                <td>
                                                    #{student.id}
                                                </td>

                                                {/* STUDENT */}

                                                <td>

                                                    <div
                                                        className="student-name"
                                                    >

                                                        <div
                                                            className="avatar"
                                                        >
                                                            {student.name
                                                                ? student.name
                                                                    .charAt(0)
                                                                    .toUpperCase()
                                                                : '?'}
                                                        </div>

                                                        <span>
                                                            {student.name}
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* DEPARTMENT */}

                                                <td>
                                                    {student.department}
                                                </td>

                                                {/* SUCCESS SCORE */}

                                                <td>

                                                    {data ? (

                                                        <strong>
                                                            {Number(
                                                                data.successScore
                                                            ).toFixed(0)}
                                                            %
                                                        </strong>

                                                    ) : (

                                                        <span>
                                                            Analyzing...
                                                        </span>

                                                    )}

                                                </td>

                                                {/* RISK */}

                                                <td>

                                                    {data ? (

                                                        <span
                                                            style={{
                                                                color:
                                                                    getRiskColor(
                                                                        data.riskLevel
                                                                    ),
                                                                fontWeight:
                                                                    'bold'
                                                            }}
                                                        >

                                                            {getRiskIcon(
                                                                data.riskLevel
                                                            )}

                                                            {' '}

                                                            {data.riskLevel}

                                                        </span>

                                                    ) : (

                                                        <span>
                                                            ⏳
                                                        </span>

                                                    )}

                                                </td>

                                                {/* STATUS */}

                                                <td>

                                                    {data ? (

                                                        <span
                                                            className="status-badge"
                                                            style={{
                                                                color:
                                                                    getRiskColor(
                                                                        data.riskLevel
                                                                    )
                                                            }}
                                                        >

                                                            {getStatusIcon(
                                                                data.status
                                                            )}

                                                            {' '}

                                                            {data.status
                                                                .replace(
                                                                    /_/g,
                                                                    ' '
                                                                )}

                                                        </span>

                                                    ) : (

                                                        <span>
                                                            Analyzing...
                                                        </span>

                                                    )}

                                                </td>

                                                {/* INTELLIGENCE BUTTON */}

                                                <td>

                                                    <button
                                                        onClick={() =>
                                                            setSelectedStudent(
                                                                student
                                                            )
                                                        }
                                                        style={{
                                                            padding:
                                                                '6px 12px',
                                                            border:
                                                                'none',
                                                            borderRadius:
                                                                '6px',
                                                            cursor:
                                                                'pointer',
                                                            background:
                                                                '#4f46e5',
                                                            color:
                                                                'white'
                                                        }}
                                                    >
                                                        🧠 View
                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* ==================================================
                STUDENT INTELLIGENCE PROFILE
            ================================================== */}

            {selectedStudent && (

                <div
                    className="dashboard-card"
                    style={{
                        marginTop: '20px',
                        padding: '30px'
                    }}
                >

                    {(() => {

                        const data =
                            analytics[
                                selectedStudent.id
                            ];

                        if (!data) {

                            return (

                                <div>

                                    <h2>
                                        🧠 Student Intelligence
                                    </h2>

                                    <p>
                                        Analytics are still being
                                        calculated...
                                    </p>

                                    <button
                                        onClick={() =>
                                            setSelectedStudent(null)
                                        }
                                    >
                                        Close
                                    </button>

                                </div>

                            );
                        }

                        const metrics = [

                            {
                                name: 'Attendance',
                                value: data.attendance,
                                icon: '📅'
                            },

                            {
                                name: 'Academic Marks',
                                value: data.marks,
                                icon: '📚'
                            },

                            {
                                name: 'Assignments',
                                value:
                                    data.assignmentCompletion,
                                icon: '📝'
                            },

                            {
                                name: 'Participation',
                                value: data.participation,
                                icon: '🙋'
                            }

                        ];

                        const availableMetrics =
                            metrics.filter(
                                (metric) =>
                                    metric.value !== null &&
                                    metric.value !== undefined
                            );

                        const weakestMetric =
                            availableMetrics.length > 0
                                ? [...availableMetrics].sort(
                                      (a, b) =>
                                          Number(a.value) -
                                          Number(b.value)
                                  )[0]
                                : null;

                        return (

                            <>

                                {/* HEADER */}

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                        alignItems: 'center'
                                    }}
                                >

                                    <div>

                                        <h2>
                                            🧠{' '}
                                            {
                                                selectedStudent.name
                                            }
                                        </h2>

                                        <p>
                                            {
                                                selectedStudent.department
                                            }
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setSelectedStudent(
                                                null
                                            )
                                        }
                                        style={{
                                            padding:
                                                '8px 14px',
                                            cursor:
                                                'pointer'
                                        }}
                                    >
                                        ✕ Close
                                    </button>

                                </div>

                                {/* SCORE */}

                                <div
                                    style={{
                                        textAlign: 'center',
                                        margin: '25px 0'
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize: '48px',
                                            fontWeight: 'bold'
                                        }}
                                    >

                                        {data.dataComplete
                                            ? `${Number(
                                                  data.successScore
                                              ).toFixed(0)}%`
                                            : '—'}

                                    </div>

                                    <p>
                                        🎯 Success Score
                                    </p>

                                </div>

                                {/* RISK + STATUS */}

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            'center',
                                        gap: '15px',
                                        flexWrap: 'wrap',
                                        marginBottom: '25px'
                                    }}
                                >

                                    <div
                                        style={{
                                            padding:
                                                '10px 16px',
                                            borderRadius:
                                                '20px',
                                            background:
                                                '#f0fdf4'
                                        }}
                                    >

                                        {getRiskIcon(
                                            data.riskLevel
                                        )}

                                        {' '}

                                        {data.riskLevel}

                                    </div>

                                    <div
                                        style={{
                                            padding:
                                                '10px 16px',
                                            borderRadius:
                                                '20px',
                                            background:
                                                '#eff6ff'
                                        }}
                                    >

                                        {getStatusIcon(
                                            data.status
                                        )}

                                        {' '}

                                        {data.status.replace(
                                            /_/g,
                                            ' '
                                        )}

                                    </div>

                                </div>

                                {/* METRICS */}

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns:
                                            'repeat(auto-fit, minmax(180px, 1fr))',
                                        gap: '15px'
                                    }}
                                >

                                    {metrics.map(
                                        (metric) => (

                                            <div
                                                key={
                                                    metric.name
                                                }
                                                style={{
                                                    padding:
                                                        '18px',
                                                    borderRadius:
                                                        '12px',
                                                    border:
                                                        '1px solid #ddd'
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        fontSize:
                                                            '24px'
                                                    }}
                                                >
                                                    {
                                                        metric.icon
                                                    }
                                                </div>

                                                <strong>
                                                    {
                                                        metric.name
                                                    }
                                                </strong>

                                                <div
                                                    style={{
                                                        fontSize:
                                                            '24px',
                                                        marginTop:
                                                            '8px'
                                                    }}
                                                >

                                                    {metric.value !==
                                                        null &&
                                                    metric.value !==
                                                        undefined
                                                        ? `${metric.value}%`
                                                        : '—'}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                                {/* INSIGHT */}

                                <div
                                    style={{
                                        marginTop:
                                            '25px',
                                        padding:
                                            '20px',
                                        borderRadius:
                                            '12px',
                                        background:
                                            '#f8fafc'
                                    }}
                                >

                                    <h3>
                                        💡 EduTrack Insight
                                    </h3>

                                    <p>
                                        {data.message ||
                                            'EduTrack has analyzed this student successfully.'}
                                    </p>

                                    {data.dataComplete &&
                                        weakestMetric && (

                                            <p>

                                                <strong>
                                                    📌 Focus Area:
                                                </strong>

                                                {' '}

                                                {
                                                    weakestMetric.name
                                                }

                                                {' '}
                                                is currently
                                                the
                                                lowest-performing
                                                metric at{' '}

                                                {
                                                    weakestMetric.value
                                                }%.

                                            </p>

                                        )}

                                </div>

                            </>

                        );

                    })()}

                </div>

            )}

            {/* ==================================================
                SMART FEATURES
            ================================================== */}

            <div className="features-section">

                <h2>
                    🚀 Smart Features
                </h2>

                <div className="features-grid">

                    <div className="feature-card">

                        <div>
                            🎯
                        </div>

                        <h3>
                            Success Score
                        </h3>

                        <p>
                            Automatically calculate student
                            success using academic and
                            engagement metrics.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div>
                            ⚠️
                        </div>

                        <h3>
                            Early Warning
                        </h3>

                        <p>
                            Detect students who may require
                            academic intervention.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div>
                            📊
                        </div>

                        <h3>
                            Analytics
                        </h3>

                        <p>
                            Analyze attendance, academic
                            performance and engagement.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div>
                            🏆
                        </div>

                        <h3>
                            Achievements
                        </h3>

                        <p>
                            Encourage students through
                            achievements and performance
                            milestones.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;