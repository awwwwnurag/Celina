import React from 'react';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 font-Poppins">
      <div className="space-y-2 border-b border-brand-border pb-4 text-center">
        <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-widest text-black">
          Terms of Service
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-gray-500">
          Please review the rules governing your use of the Celina Clothing website.
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed text-justify">
        <p>
          Welcome to <strong>Celina Clothing</strong>! The following conditions dictate your interaction with our platform and the services we provide. By browsing or purchasing from our store, you acknowledge that you have read, understood, and agreed to comply with these terms. If you do not agree with any part of these rules, you should immediately cease using this website.
        </p>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">1. Introduction & Eligibility</h3>
          <p>
            This digital storefront is managed and operated exclusively by Celina Clothing. By accessing or using our platform, you confirm that you are legally recognized as an adult in your jurisdiction, or are browsing under the direct supervision of a consenting parent or guardian.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">2. User Registration & Security</h3>
          <p>
            Certain features or checkout processes may prompt you to register a profile. You commit to submitting true, precise, and current details. Safeguarding your login credentials is solely your responsibility, and any actions or transactions originating from your logged-in session will be attributed directly to you.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">3. Our Offerings & Inventory</h3>
          <p>We specialize in premium ethnic apparel. Please be aware of the following regarding our inventory:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>While many pieces are crafted upon request, fulfillment ultimately relies on current textile availability.</li>
            <li>We dedicate significant effort to ensuring product imagery and specifications are exact; however, slight discrepancies in color or texture might be perceived depending on your device's display calibration.</li>
            <li>All pricing is subject to adjustments at our discretion without prior public announcement.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">4. Exchanges & Refunds</h3>
          <p>
            For comprehensive instructions regarding returning or swapping merchandise, please consult our dedicated Return Policy page. Finalizing a transaction on this platform implies your full consent to those established return guidelines.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">5. Billing Procedures</h3>
          <p>
            Complete financial settlement must be achieved using our supported secure payment gateways before any order is finalized. Celina Clothing retains the authority to void any transaction if the payment authorization fails, remains unverified, or appears fraudulent.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">6. Dispatch & Delivery</h3>
          <p>
            Packages will be dispatched to the exact destination details you input during the checkout sequence. While we partner with reliable courier services, Celina Clothing cannot be held liable for transit delays, handling damages, or misplaced parcels once they leave our facility.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">7. Copyright & Ownership</h3>
          <p>
            Every piece of digital content presented here—spanning photography, typography, branding assets, and interface design—is the exclusive intellectual property of Celina Clothing. Unauthorized duplication, reproduction, or commercial redistribution of our assets is strictly forbidden by global copyright legislation.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">8. Restricted Conduct</h3>
          <p>By engaging with our platform, you strictly agree to abstain from:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Engaging in any illegal, deceptive, or scam-related behaviors.</li>
            <li>Attempting to circumvent our digital security measures or disrupting server operations.</li>
            <li>Transmitting malicious software or deploying unauthorized data scraping tools.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">9. Liability Constraints</h3>
          <p>
            Under no circumstances shall Celina Clothing be held accountable for indirect, accidental, or secondary damages resulting from your utilization of our digital interface, service interruptions, or the physical garments purchased.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">10. Policy Modifications</h3>
          <p>
            We maintain the privilege to amend or rewrite these conditions whenever necessary, effective immediately upon publishing. Your ongoing interaction with our store post-update signifies your agreement to the modified rules.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">11. Legal Jurisdiction</h3>
          <p>
            All clauses within this agreement, along with any independent service contracts, are interpreted and enforced in alignment with the statutory laws of India.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">12. Get In Touch</h3>
          <p>
            For clarifications regarding these conditions or any other store-related inquiries, our support team is available at:
          </p>
          <p className="font-bold">
            Email: care@celinaclothing.com<br />
            Address: Celina Clothing, Sadarpur Sector-45, Gate No.3, Noida, UP, 201303, IN
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
