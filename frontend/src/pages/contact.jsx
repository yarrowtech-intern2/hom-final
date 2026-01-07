


// import React, { useState } from "react";
// // import Beams from "./gridBeams";               
// import FloatingLines from "../components/floatingLines";
// import "./contact.css";
// import API_BASE_URL from "../config";

// export default function ContactUs() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//     company: "", // honeypot
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
//     <main className="contact-page">
//       {/* === BACKGROUND (Beams + FloatingLines) === */}
//       <div className="contact-bg" aria-hidden>
        

       
//         <div
//           style={{
//             width: "100vw",
//             height: "100vh",
//             position: "absolute",
//             inset: 0,
//           }}
//         >
//           <FloatingLines
//             enabledWaves={["top", "middle", "bottom"]}
            
//             lineCount={[10, 15, 20]}
            
//             lineDistance={[8, 6, 4]}
//             bendRadius={1}
//             bendStrength={-2}
//             interactive={true}
//             parallax={true}
//           />
//         </div>
//       </div>

//       {/* === FOREGROUND CONTENT === */}
//       <div className="contact-container">
//         <header className="contact-header">
//           <h1>Contact Us</h1>

//           {/* <h1 class="text-5xl font-extrabold 
//     bg-gradient-to-r from-blue-400 via-violet-500 to-fuchsia-500 
//     bg-clip-text text-transparent 
//     drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]">
//             Contact Us
//           </h1> */}



//           <p className="subtitle">Tell us a bit about your query.</p>
//         </header>

//         <form className="contact-form" onSubmit={onSubmit}>
//           {/* Honeypot — bots fill this, humans won't */}
//           <input
//             type="text"
//             name="company"
//             autoComplete="off"
//             tabIndex="-1"
//             aria-hidden="true"
//             className="hp"
//             value={form.company}
//             onChange={onChange}
//           />

//           <div className="grid">
//             <div className="form-group">
//               <label htmlFor="name">Name</label>
//               <input
//                 id="name"
//                 name="name"
//                 value={form.name}
//                 onChange={onChange}
//                 placeholder="Your Name"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 id="email"
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={onChange}
//                 placeholder="you@gmail.com"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="phone">Phone</label>
//               <input
//                 id="phone"
//                 name="phone"
//                 value={form.phone}
//                 onChange={onChange}
//                 placeholder="+91 98765 43210"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="subject">Subject</label>
//               <input
//                 id="subject"
//                 name="subject"
//                 value={form.subject}
//                 onChange={onChange}
//                 placeholder="How can we help?"
//                 required
//               />
//             </div>

//             <div className="form-group full">
//               <label htmlFor="message">Message</label>
//               <textarea
//                 id="message"
//                 name="message"
//                 rows="5"
//                 value={form.message}
//                 onChange={onChange}
//                 placeholder="Write your message..."
//                 required
//               />
//             </div>
//           </div>

//           {/* <button className="btn" type="submit" disabled={loading}>
//             {loading ? "Sending..." : "Send Message"}
//           </button> */}

//             <div className="submit-row">
//           <button class="btn-send" type="submit" disabled={loading} >
//             {loading ? "Sending..." : "Send Message"}
//           </button>
//           </div>



//         </form>
//       </div>
//     </main>
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

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send");

      alert("Thanks! We’ve received your message.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        company: "",
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-modal-only">
      <div className="contact-container glass">
        <header className="contact-header">
          <h1>Contact Us</h1>
          <p className="subtitle">Tell us a bit about your query.</p>
        </header>

        <form className="contact-form" onSubmit={onSubmit}>
          {/* honeypot */}
          <input
            type="text"
            name="company"
            className="hp"
            tabIndex="-1"
            autoComplete="off"
            value={form.company}
            onChange={onChange}
          />

          <div className="grid">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your Name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="form-group full">
              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={onChange}
                placeholder="Write your message..."
                required
              />
            </div>
          </div>

          <div className="submit-row">
            <button className="btn-send" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
