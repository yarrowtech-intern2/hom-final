import React, { useState } from "react";
import "./contact.css";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: ""
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
  e.preventDefault();

  const payload = { ...form, company: "" }; // keep honeypot empty on real users
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send");
    alert("Thanks! We’ve received your message.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <main className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="subtitle">Tell us a bit about your query.</p>

        <form className="contact-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={onChange} placeholder="Your Name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="you@gmail.com" required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={onChange} placeholder="+91 98765 43210" />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input name="subject" value={form.subject} onChange={onChange} placeholder="How can we help?" required />
          </div>

          <div className="form-group full">
            <label>Message</label>
            <textarea name="message" rows="5" value={form.message} onChange={onChange} placeholder="Write your message..." required />
          </div>

          <button className="btn" type="submit">Send Message</button>
        </form>
      </div>
    </main>
  );
}
