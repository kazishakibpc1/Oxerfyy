import React from "react";
import { Link } from "react-router-dom";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-base text-cream p-6 pt-24 md:p-10 md:pt-32">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-mint hover:underline mb-8 block">&larr; Back to Home</Link>
        <div className="prose prose-invert prose-mint max-w-none">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Disclaimer</h1>
          <p className="text-cream/60 text-sm md:text-base">Effective Date: April 23, 2026 · Oxerfy · oxerfy.com</p>
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">⚠ Read Before Proceeding</h2>
          <p className="text-sm md:text-base">This Disclaimer applies to all content, advice, opinions, and materials shared through oxerfy.com, social media channels, WhatsApp, email, or any other Oxerfy communication platform.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">01 General Information Only</h2>
          <p className="text-sm md:text-base">All content published by Oxerfy — including website copy, social media posts, case studies, reports, messages, and conversations — is provided for general informational and marketing purposes only. Oxerfy makes no warranty, express or implied, regarding the accuracy, completeness, or applicability of any information shared.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">02 No Financial or Investment Advice</h2>
          <p className="text-sm md:text-base">Oxerfy does not provide financial, investment, or business capital advice of any kind. Nothing shared by Oxerfy through any channel should be interpreted as a recommendation to invest, allocate capital, take financial risk, or make any business funding decision.</p>
          <p className="text-sm md:text-base">If any Oxerfy team member shares a general opinion or insight that touches on business finance, growth projections, or investment returns, this is purely informational and does not constitute professional financial guidance. You are under no obligation to follow any such opinion.</p>

          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">03 No Professional or Legal Advice</h2>
          <p className="text-sm md:text-base">Oxerfy is a digital services agency — not a law firm, financial advisory firm, tax consultancy, or regulatory body. Any information relating to legal structures, business registration, contracts, or regulatory compliance shared by Oxerfy is general and informal in nature.</p>
          <p className="text-sm md:text-base">You should always consult a qualified, licensed professional — legal counsel, accountant, or financial adviser — before making any decision with legal or financial implications. Oxerfy is not liable for outcomes resulting from reliance on any general information it has shared.</p>

          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">04 No Guarantee of Results</h2>
          <p className="text-sm md:text-base">Oxerfy presents case studies, client results, and performance metrics for illustrative purposes only. Past results achieved for other clients — including viral growth, conversion improvements, or ad performance — do not guarantee identical or similar outcomes for your business.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">05 Client Autonomy & No Forced Decisions</h2>
          <p className="text-sm md:text-base">Oxerfy operates on the principle of full client autonomy. Any direction, suggestion, or recommendation made by Oxerfy — whether strategic, technical, or creative — is advisory only. You are always free to accept, modify, or reject any recommendation. Oxerfy will never pressure or coerce you into any decision.</p>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>Clients are never obligated to follow Oxerfy's strategic suggestions.</li>
            <li>Oxerfy's opinions on market trends, platform choices, or growth tactics are not binding directives.</li>
            <li>All final business decisions remain solely with the client.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">06 Third-Party Platforms & Tools</h2>
          <p className="text-sm md:text-base">Oxerfy uses and may recommend third-party tools, platforms, and services (e.g., Meta, WordPress, Make.com, Vercel, Canva, WhatsApp). Oxerfy is not affiliated with, endorsed by, or responsible for the policies, uptime, terms, or actions of any third-party platform.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">07 Online-Only Operation</h2>
          <p className="text-sm md:text-base">Oxerfy is a fully remote, online-based agency. All work, communication, and service delivery occur through digital platforms. We do not have a physical client office. Any claim that physical meetings, in-person consultations, or walk-in services are offered by Oxerfy is false.</p>
          
          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">08 No Liability for Loss</h2>
          <p className="text-sm md:text-base">To the fullest extent permitted by law, Oxerfy and its team members shall not be held responsible for any direct, indirect, incidental, or consequential loss — financial, operational, or reputational — arising from:</p>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>Reliance on any general content or opinions shared by Oxerfy</li>
            <li>Business decisions made based on Oxerfy's creative or strategic suggestions</li>
            <li>Platform outages or third-party service failures beyond our control</li>
            <li>Client inaction, delayed approvals, or incomplete information provided to Oxerfy</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">09 Updates to This Disclaimer</h2>
          <p className="text-sm md:text-base">Oxerfy reserves the right to update this Disclaimer at any time without prior notice. The updated version will be published on this page with a revised effective date. Continued use of Oxerfy services constitutes acceptance of any revised Disclaimer.</p>
          <p className="text-sm md:text-base"><strong>Questions or concerns:</strong> oxerfy@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
