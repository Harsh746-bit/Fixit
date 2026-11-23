import React, { useState } from 'react';

export default function ReportForm({ onAddIssue, nextId }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    priority: '',
    location: '',
    contact: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const indianMobileRegex = /^[6-9]\d{9}$/;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your campus email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. student@campus.edu).';
    }

    if (!formData.category) {
      newErrors.category = 'Please select an issue category.';
    }

    if (!formData.priority) {
      newErrors.priority = 'Please select an issue priority level.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please specify the campus location or room number.';
    }

    if (formData.contact.trim() && !indianMobileRegex.test(formData.contact.trim())) {
      newErrors.contact = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the problem.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = `Description must contain at least 10 characters (currently ${formData.description.trim().length}).`;
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error dynamically as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const validationErrors = validate();
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      category: true,
      priority: true,
      location: true,
      contact: true,
      description: true
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const newIssue = {
      id: nextId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      category: formData.category,
      priority: formData.priority,
      location: formData.location.trim(),
      contact: formData.contact.trim(),
      description: formData.description.trim(),
      status: 'Pending',
      date: todayDate
    };

    onAddIssue(newIssue);

    // Reset form
    setFormData({
      name: '',
      email: '',
      category: '',
      priority: '',
      location: '',
      contact: '',
      description: ''
    });
    setErrors({});
    setTouched({});
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      category: '',
      priority: '',
      location: '',
      contact: '',
      description: ''
    });
    setErrors({});
    setTouched({});
  };

  return (
    <div className="card border rounded-2 p-4 bg-white shadow-sm sticky-lg-top" style={{ top: '90px', zIndex: 10 }}>
      <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
        <h2 className="h5 fw-bold text-charcoal mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-file-earmark-plus-fill text-safety-orange"></i>
          Report Campus Issue
        </h2>
        <span className="badge bg-charcoal text-white font-monospace">Next ID: {nextId}</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Student Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-semibold text-charcoal small">
            Student / Staff Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && <div className="invalid-feedback small d-block">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold text-charcoal small">
            Campus Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            placeholder="student@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <div className="invalid-feedback small d-block">{errors.email}</div>}
        </div>

        {/* Category & Priority */}
        <div className="row g-2 mb-3">
          <div className="col-sm-6">
            <label htmlFor="category" className="form-label fw-semibold text-charcoal small">
              Category <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${touched.category && errors.category ? 'is-invalid' : ''}`}
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="" disabled>Select...</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Internet">Internet &amp; Wi-Fi</option>
              <option value="Furniture">Furniture</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Equipment">Equipment</option>
            </select>
            {errors.category && <div className="invalid-feedback small d-block">{errors.category}</div>}
          </div>

          <div className="col-sm-6">
            <label htmlFor="priority" className="form-label fw-semibold text-charcoal small">
              Priority <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${touched.priority && errors.priority ? 'is-invalid' : ''}`}
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="" disabled>Select...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            {errors.priority && <div className="invalid-feedback small d-block">{errors.priority}</div>}
          </div>
        </div>

        {/* Location */}
        <div className="mb-3">
          <label htmlFor="location" className="form-label fw-semibold text-charcoal small">
            Campus Location / Room <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${touched.location && errors.location ? 'is-invalid' : ''}`}
            id="location"
            name="location"
            placeholder="e.g. Block A - Room 204"
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.location && <div className="invalid-feedback small d-block">{errors.location}</div>}
        </div>

        {/* Contact */}
        <div className="mb-3">
          <label htmlFor="contact" className="form-label fw-semibold text-charcoal small">
            Contact Number <span className="text-secondary fw-normal">(Optional, 10-digit mobile)</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-slate small">+91</span>
            <input
              type="tel"
              className={`form-control border-start-0 ${touched.contact && errors.contact ? 'is-invalid' : ''}`}
              id="contact"
              name="contact"
              placeholder="9876543210"
              value={formData.contact}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.contact && <div className="invalid-feedback small d-block">{errors.contact}</div>}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-semibold text-charcoal small">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
            id="description"
            name="description"
            rows="3"
            placeholder="Detailed description (min 10 characters)..."
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
          ></textarea>
          {errors.description && <div className="invalid-feedback small d-block">{errors.description}</div>}
        </div>

        {/* Actions */}
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-safety-orange text-white fw-bold py-2">
            <i className="bi bi-plus-circle me-1"></i>Add Issue to React State
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleReset}>
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
