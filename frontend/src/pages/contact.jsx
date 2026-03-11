import React, { useState } from "react";
import API_BASE_URL from "../config";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.submit) {
      setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
    }
  };

  const validateForm = () => {
    const next = {};

    if (!form.name.trim()) next.name = "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!emailRegex.test(form.email.trim())) {
      next.email = "Please enter a valid email";
    }

    if (form.phone.trim() && !/^[\d\s+()-]+$/.test(form.phone.trim())) {
      next.phone = "Please enter a valid phone number";
    }

    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.message.trim()) next.message = "Message is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (form.company) return;
    if (!validateForm()) return;

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send message");

      setSuccess(true);
      setErrors({});
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        company: "",
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.message || "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-sheet">
      <div className="contact-card">
        <header className="contact-card-header">
          <h1 id="contact-modal-title">Get in touch</h1>
          <p>Have a question or want to work together? We'd love to hear from you.</p>
        </header>

        <form className="contact-card-form" onSubmit={onSubmit} noValidate>
          <input
            type="text"
            name="company"
            className="contact-honeypot"
            tabIndex="-1"
            autoComplete="off"
            value={form.company}
            onChange={onChange}
            aria-hidden="true"
          />

          {success && (
            <div className="contact-alert contact-alert-success" role="alert">
              Message sent successfully.
            </div>
          )}
          {errors.submit && (
            <div className="contact-alert contact-alert-error" role="alert">
              {errors.submit}
            </div>
          )}

          <div className="contact-field">
            <label htmlFor="contact-name">Name:</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className={errors.name ? "has-error" : ""}
              required
            />
            {errors.name && <span className="contact-error">{errors.name}</span>}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-email">Email:</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className={errors.email ? "has-error" : ""}
              required
            />
            {errors.email && <span className="contact-error">{errors.email}</span>}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-phone">Phone No.</label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              className={errors.phone ? "has-error" : ""}
            />
            {errors.phone && <span className="contact-error">{errors.phone}</span>}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              value={form.subject}
              onChange={onChange}
              className={errors.subject ? "has-error" : ""}
              required
            />
            {errors.subject && <span className="contact-error">{errors.subject}</span>}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">Message:</label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              value={form.message}
              onChange={onChange}
              className={errors.message ? "has-error" : ""}
              required
            />
            {errors.message && <span className="contact-error">{errors.message}</span>}
          </div>

          <div className="contact-submit-wrap">
            <button className="contact-submit" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
