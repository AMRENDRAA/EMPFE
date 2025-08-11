import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const EmployeeCrud = () => {

    const [employees, setEmployees] = useState([]);
    const [employeeForm, setEmployeeForm] = useState({
        id: null,
        name: '',
        email: '',
        position: ''
    });
    const [editing, setEditing] = useState(false);

    const API_URL = "https://emp-be-sw1q.onrender.com/api/employee";


    useEffect(() => {
        fetchEmployees();
    }, [])

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log(response);
            setEmployees(response.data.data);
        } catch (err) {
            console.log(err.response?.data?.err || err.message);
            toast.error("Failed to fetch employees");
        }
    }

    const editEmployee = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            console.log(response);
            setEmployeeForm({
                id: response.data.data.id,
                name: response.data.data.name,
                email: response.data.data.email,
                position: response.data.data.position
            });
            setEditing(true);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch employee details");
        }
    }

    // FIXED: Correct variable reference
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeForm({ ...employeeForm, [name]: value });
    }

    // FIXED: All issues corrected
    const handleAddAndUpdate = async () => {
        try {
            if (editing) {
                await axios.put(`${API_URL}/${employeeForm.id}`, {
                    name: employeeForm.name,
                    email: employeeForm.email,
                    position: employeeForm.position
                });
                toast.success("Employee updated successfully");
            } else {
                await axios.post(API_URL, { // FIXED: Added missing await
                    name: employeeForm.name,
                    email: employeeForm.email,
                    position: employeeForm.position
                });
                toast.success("Employee added successfully"); // FIXED: Correct message
            }

            fetchEmployees();
            setEditing(false);

            // FIXED: Correct function name and null value
            setEmployeeForm({
                id: null,
                name: '',
                email: '',
                position: ''
            });

            // Close modal
            const modal = document.getElementById('employeeModal');
            const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }

        } catch (err) {
            console.log(err);
            const errorMessage = err.response?.data?.error || "Operation failed";
            toast.error(errorMessage);
        }
    }

    const deleteEmployee = async (id) => {
        if (window.confirm("Are you sure to delete this record?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                toast.success("Employee deleted successfully");
                fetchEmployees();
            } catch (err) {
                const errorMessage = err.response?.data?.error || "Something went wrong";
                toast.error(errorMessage);
            }
        }
    }

    // FIXED: Function to properly reset form
    const handleAddNew = () => {
        console.log("Editing", editing);
        setEditing(false);
        setEmployeeForm({
            id: null,
            name: '',
            email: '',
            position: ''
        });
    }

    return (
        <div className="container mt-5">
            <ToastContainer position="top-right" autoClose={3000} />

            <h1>Employee Management</h1>

            <button
                className="btn btn-primary mb-3"
                data-bs-toggle="modal"
                data-bs-target="#employeeModal"
                onClick={handleAddNew}
            >
                Add New Employee
            </button>

            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Position</th> {/* FIXED: Spelling */}
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {/* FIXED: Correct variable name */}
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.position}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#employeeModal"
                                    onClick={() => editEmployee(emp.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteEmployee(emp.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            <div className='modal fade' id='employeeModal' tabIndex="-1" aria-labelledby='employeeModalLabel' aria-hidden="true">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id="employeeModalLabel">
                                {editing ? "Edit Employee" : "Add Employee"}
                            </h5>
                            <button type="button" className='btn-close' data-bs-dismiss="modal" aria-label="close"></button>
                        </div>

                        <div className='modal-body'>
                            <div className='mb-3'>
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder='Enter name'
                                    className='form-control'
                                    value={employeeForm.name} // FIXED: Correct variable
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder='Enter Email'
                                    className='form-control'
                                    value={employeeForm.email} // FIXED: Correct variable
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="position" className="form-label">Position</label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    placeholder='Enter Position'
                                    className='form-control'
                                    value={employeeForm.position} // FIXED: Correct variable
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className='modal-footer'>
                            <button type="button" className='btn btn-secondary' data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="button" className='btn btn-primary' onClick={handleAddAndUpdate}>
                                {editing ? "Update Employee" : "Add Employee"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCrud;