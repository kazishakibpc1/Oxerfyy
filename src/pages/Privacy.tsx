import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-base text-cream p-6 pt-24 md:p-10 md:pt-32">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-mint hover:underline mb-8 block">&larr; Back to Home</Link>
        <div className="prose prose-invert prose-mint max-w-none">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Privacy Policy</h1>
          <p className="text-cream/60 text-sm md:text-base">Effective Date: April 23, 2026 · Oxerfy · oxerfy.com</p>
          <p className="text-sm md:text-base">Oxerfy is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and what rights you have over it when you interact with oxerfy.com or engage our services.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">01 Who We Are</h2>
          <p className="text-sm md:text-base">Oxerfy is a fully online, remote-first digital agency based in Dhaka, Bangladesh. All our operations — from client onboarding to project delivery — are conducted through digital platforms. There is no physical service counter or walk-in office.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">02 Information We Collect</h2>
          <h3 className="text-lg md:text-xl font-bold mt-4 mb-2">Information You Provide</h3>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>Your name, email address, WhatsApp/phone number</li>
            <li>Business name, project details, and goals you share with us</li>
            <li>Budget, timeline, and scope information from contact forms</li>
            <li>Messages and correspondence sent via email, WhatsApp, or our website</li>
          </ul>
          <h3 className="text-lg md:text-xl font-bold mt-4 mb-2">Information Collected Automatically</h3>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>Browser type, device type, and IP address</li>
            <li>Pages visited and time spent on oxerfy.com</li>
            <li>Referral source (how you found us)</li>
            <li>Cookie and analytics data (via tools like Google Analytics)</li>
          </ul>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">03 How We Use Your Information</h2>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>To respond to your inquiries and project requests</li>
            <li>To deliver, manage, and improve our services</li>
            <li>To send project updates, invoices, and relevant communication</li>
            <li>To analyze website traffic and improve user experience</li>
            <li>To showcase completed work in our portfolio (only with implied or explicit consent)</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p className="text-sm md:text-base">We do not sell, rent, or trade your personal information to any third party.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">04 Data Sharing</h2>
          <p className="text-sm md:text-base">We may share your information only in limited circumstances:</p>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>With third-party tools essential to our operations (e.g., Make.com, Google Workspace, WhatsApp Business), which are bound by their own privacy policies.</li>
            <li>If required by law, court order, or government authority.</li>
            <li>To protect the rights or safety of Oxerfy, our team, or our clients.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">05 Cookies</h2>
          <p className="text-sm md:text-base">Our website uses cookies to improve functionality and measure performance. You may disable cookies through your browser settings, though this may affect some features of the site. We use strictly necessary cookies and analytics cookies only.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">06 Data Retention</h2>
          <p className="text-sm md:text-base">We retain your information for as long as needed to provide services and fulfill legal obligations. Project-related data is kept for a minimum of 1 year after project completion. You may request deletion at any time by contacting us.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">07 Your Rights</h2>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>Request access to the data we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data (where not legally required to retain)</li>
            <li>Withdraw consent for marketing communication at any time</li>
            <li>Object to how your data is being processed</li>
          </ul>
          <p className="text-sm md:text-base">To exercise any of these rights, contact us at oxerfy@gmail.com.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">08 Security</h2>
          <p className="text-sm md:text-base">As a fully online operation, Oxerfy applies appropriate digital security practices to protect your information — including secure communications, access controls, and use of trusted platforms. However, no online transmission is 100% secure, and we cannot guarantee absolute data security.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">09 Changes to This Policy</h2>
          <p className="text-sm md:text-base">We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date. Continued use of our services constitutes acceptance of the updated policy.</p>
        </div>
      </div>
    </div>
  );
}
