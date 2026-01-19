

// import React, { useState } from "react";
// import "./contact.css";
// import API_BASE_URL from "../config";

// export default function ContactUs() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//     company: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const onChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/contact`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Failed to send");

//       alert("Thanks! We’ve received your message.");
//       setForm({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "",
//         message: "",
//         company: "",
//       });
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="contact-modal-only">
//       <div className="contact-container glass">
//         <header className="contact-header">
//           <h1>Contact Us</h1>
//           <p className="subtitle">Tell us a bit about your query.</p>
//         </header>

//         <form className="contact-form" onSubmit={onSubmit}>
//           {/* honeypot */}
//           <input
//             type="text"
//             name="company"
//             className="hp"
//             tabIndex="-1"
//             autoComplete="off"
//             value={form.company}
//             onChange={onChange}
//           />

//           <div className="grid">
//             <div className="form-group">
//               <label>Name</label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={onChange}
//                 placeholder="Your Name"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={onChange}
//                 placeholder="you@gmail.com"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Phone</label>
//               <input
//                 name="phone"
//                 value={form.phone}
//                 onChange={onChange}
//                 placeholder="+91 98765 43210"
//               />
//             </div>

//             <div className="form-group">
//               <label>Subject</label>
//               <input
//                 name="subject"
//                 value={form.subject}
//                 onChange={onChange}
//                 placeholder="How can we help?"
//                 required
//               />
//             </div>

//             <div className="form-group full">
//               <label>Message</label>
//               <textarea
//                 name="message"
//                 rows="5"
//                 value={form.message}
//                 onChange={onChange}
//                 placeholder="Write your message..."
//                 required
//               />
//             </div>
//           </div>

//           <div className="submit-row">
//             <button className="btn-send" type="submit" disabled={loading}>
//               {loading ? "Sending..." : "Send Message"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


















































import React, { useState } from "react";
import "./contact.css";
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
    setForm({ ...form, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (form.phone && !/^[\d\s+()-]+$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Honeypot check
    if (form.company) {
      console.warn("Bot detected");
      return;
    }

    if (!validateForm()) {
      return;
    }

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
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        company: "",
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        <header className="contact-header">
          <h1 id="contact-modal-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </header>

        {success && (
          <div className="alert alert-success" role="alert">
            <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Success!</strong> We've received your message and will get back to you soon.
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="alert alert-error" role="alert">
            <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>{errors.submit}</div>
          </div>
        )}

        <form className="contact-form" onSubmit={onSubmit} noValidate>
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="company"
            className="honeypot"
            tabIndex="-1"
            autoComplete="off"
            value={form.company}
            onChange={onChange}
            aria-hidden="true"
          />

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                className={`form-input ${errors.name ? "error" : ""}`}
                value={form.name}
                onChange={onChange}
                placeholder="your name"
                required
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" className="error-message" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                value={form.email}
                onChange={onChange}
                placeholder="you@gmail.com"
                required
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="error-message" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact-phone" className="form-label">
                Phone <span className="optional">(optional)</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                className={`form-input ${errors.phone ? "error" : ""}`}
                value={form.phone}
                onChange={onChange}
                placeholder="+91 987654321"
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <span id="phone-error" className="error-message" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject" className="form-label">
                Subject <span className="required">*</span>
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                className={`form-input ${errors.subject ? "error" : ""}`}
                value={form.subject}
                onChange={onChange}
                placeholder="How can we help?"
                required
                aria-invalid={errors.subject ? "true" : "false"}
                aria-describedby={errors.subject ? "subject-error" : undefined}
              />
              {errors.subject && (
                <span id="subject-error" className="error-message" role="alert">
                  {errors.subject}
                </span>
              )}
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="contact-message" className="form-label">
                Message <span className="required">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                className={`form-input form-textarea ${errors.message ? "error" : ""}`}
                value={form.message}
                onChange={onChange}
                placeholder="Tell us more about your inquiry..."
                required
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <span id="message-error" className="error-message" role="alert">
                  {errors.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-footer">
            <button 
              className="btn-submit" 
              type="submit" 
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}