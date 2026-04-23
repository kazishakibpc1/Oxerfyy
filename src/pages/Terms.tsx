import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-base text-cream p-6 pt-24 md:p-10 md:pt-32">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-mint hover:underline mb-8 block">&larr; Back to Home</Link>
        <div className="prose prose-invert prose-mint max-w-none">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Terms & Conditions</h1>
          <p className="text-cream/60 text-sm md:text-base">Effective Date: April 23, 2026 · Oxerfy · oxerfy.com</p>
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">⚠ Please Read Carefully</h2>
          <p className="text-sm md:text-base">By using any Oxerfy service, you confirm that you have read, understood, and agree to be fully bound by these Terms. If you do not agree, please do not proceed with any engagement.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">01 About Oxerfy</h2>
          <p className="text-sm md:text-base">Oxerfy is a fully remote, online-based digital agency operating from Dhaka, Bangladesh, with no physical client-facing office. All services, communications, project management, deliverables, and support are conducted exclusively through digital and online platforms. By engaging with us, you acknowledge and accept this fully online delivery model.</p>
          <p className="text-sm md:text-base">Oxerfy is founded and led by Kazi Shakib. Our mission is to bridge the gap between complex technology and beautiful design, building digital products that look stunning and perform flawlessly.</p>
          <h3 className="text-lg md:text-xl font-bold mt-4 mb-2">🏢 Trade License</h3>
          <p className="text-sm md:text-base">Oxerfy is a legally registered business entity. Trade License No: TRAD/DNCC/045292/2025 — issued by Dhaka North City Corporation (DNCC), Bangladesh.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">02 Services We Provide</h2>
          <p className="text-sm md:text-base">Oxerfy offers the following digital services, each of which may be engaged as a complete package or as a standalone option:</p>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>WordPress Web Development</li>
            <li>AI Automation Engineering</li>
            <li>Meta Marketing & Growth</li>
            <li>Social Media Management</li>
            <li>SME Digitalize Transformation</li>
            <li>Post & Creative Design</li>
          </ul>
          <p className="text-sm md:text-base">All services are delivered entirely online. Remote collaboration tools, messaging platforms, and digital project management systems are used throughout every engagement.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">03 Payment Policy — 50% Advance Required</h2>
          <p className="text-sm md:text-base">Oxerfy operates on a strict 50% upfront payment policy. No project, task, or service will be initiated, planned, or worked on until 50% of the agreed total project fee has been received and confirmed.</p>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>All quotes and pricing are agreed upon in writing before any payment is requested.</li>
            <li>The remaining 50% balance is due upon project completion and before final delivery of files or assets.</li>
            <li>Payments are non-refundable once work has begun on the active phase.</li>
            <li>Payment methods and transfer details will be communicated directly by Oxerfy.</li>
            <li>Oxerfy reserves the right to pause or suspend work if the outstanding balance is not settled as agreed.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">04 Project Start & 7-Day Inactivity Policy</h2>
          <h3 className="text-lg md:text-xl font-bold mt-4 mb-2">⚠ Important — Client Action Required After Payment</h3>
          <p className="text-sm md:text-base">Paying the advance fee alone does not automatically start a project. You must actively provide your project brief, instructions, or direction to officially begin.</p>
          <p className="text-sm md:text-base">The following policy applies to all clients who have completed the advance payment:</p>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>After making the advance payment, the client must provide clear project instructions, a brief, or a start directive within 7 (seven) calendar days.</li>
            <li>If Oxerfy does not receive any instruction or communication initiating the project within 7 days of the payment date, the project will be considered automatically cancelled.</li>
            <li>No refund will be issued in the event of cancellation under this policy. The advance payment will be forfeited in full.</li>
            <li>If you are unavailable or need an extension, you must notify Oxerfy in writing before the 7-day window expires. Extensions are granted solely at Oxerfy's discretion.</li>
            <li>This policy exists to ensure timely project planning and fair allocation of Oxerfy's team resources.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">05 Project Execution & Communication</h2>
          <p className="text-sm md:text-base">All project work is carried out remotely. Clients are responsible for providing timely feedback, required assets, and approvals. Delays caused by the client may affect the agreed delivery timeline. Oxerfy is not liable for deadline extensions resulting from client-side delays.</p>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>Scope changes requested after project initiation may incur additional charges.</li>
            <li>Revisions are limited to the number specified in your service agreement.</li>
            <li>Oxerfy communicates primarily via WhatsApp, email, and agreed project tools.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">06 Intellectual Property</h2>
          <p className="text-sm md:text-base">Upon receipt of final payment in full, all deliverables, creative assets, and developed materials become the property of the client. Until final payment is received, all work remains the intellectual property of Oxerfy.</p>
          <p className="text-sm md:text-base">Oxerfy retains the right to showcase completed work in its portfolio, case studies, and marketing materials unless the client explicitly requests confidentiality in writing at the time of engagement.</p>

          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">07 Limitation of Liability</h2>
          <p className="text-sm md:text-base">Oxerfy's total liability for any claim under any engagement shall not exceed the total fee paid for the specific service in question. Oxerfy is not liable for indirect, consequential, or business losses resulting from the use or delay of delivered services.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">08 Governing Terms</h2>
          <p className="text-sm md:text-base">These Terms are governed by the laws applicable in Dhaka, Bangladesh. Any disputes shall first be attempted to be resolved through direct communication. Oxerfy reserves the right to update these Terms at any time, with updates effective upon publication.</p>
          <p className="text-sm md:text-base"><strong>Contact:</strong> oxerfy@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
