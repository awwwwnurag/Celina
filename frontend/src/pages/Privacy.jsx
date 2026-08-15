import React, { useContext } from 'react';
import { ShieldAlert } from 'lucide-react';
import SettingsContext from '../context/SettingsContext';

export const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 font-Poppins">
      <div className="space-y-2 border-b border-brand-border pb-4 text-center">
        <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-widest text-black">
          Privacy Policy
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-gray-500">
          How Celina Clothing gathers, uses, and safeguards your data.
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed text-justify">
        <p>
          <strong>Celina Clothing</strong> operates this website and all related services, tools, and content to provide you with an exceptional, curated ethnic fashion shopping experience. This Privacy Policy outlines how we gather, utilize, and protect your personal data when you interact with our platform, make purchases, or communicate with us. In any instance where our Terms of Service conflict with this document regarding personal information handling, this Privacy Policy takes precedence.
        </p>
        <p>
          By accessing our website and utilizing our services, you confirm that you have carefully read, understood, and consented to the data practices described herein.
        </p>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">1. Information We Collect</h3>
          <p>
            "Personal data" refers to any details that can identify you as an individual. Anonymous or de-identified data is excluded from this definition. Depending on your interactions with us, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Contact Information:</strong> Your full name, email address, phone number, shipping, and billing addresses.</li>
            <li><strong>Financial Details:</strong> Payment methods, transaction history, masked card details, and payment confirmations. (Note: We use secure third-party payment gateways and do not store full card numbers).</li>
            <li><strong>Account Data:</strong> Usernames, encrypted passwords, saved preferences, and order history.</li>
            <li><strong>Device & Usage Metrics:</strong> IP addresses, browser types, interaction logs, navigation paths, and cart activities.</li>
            <li><strong>Direct Communications:</strong> Customer support emails, chat logs, or feedback you submit.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">2. How We Gather Your Data</h3>
          <p>We obtain information through multiple avenues:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Directly Provided:</strong> When you register an account, complete a purchase, or contact our support team.</li>
            <li><strong>Automatically Collected:</strong> Through cookies, pixels, and essential tracking technologies as you navigate our store.</li>
            <li><strong>Third-Party Partners:</strong> From analytics providers, shipping logistics partners, and payment gateways assisting us in fulfilling your orders.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">3. How We Utilize Your Data</h3>
          <p>Your information helps us deliver a seamless shopping journey. We use it to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Process & Fulfill Orders:</strong> Handling payments, arranging deliveries, managing returns, and sending transactional updates.</li>
            <li><strong>Personalize Your Experience:</strong> Recommending products tailored to your previous purchases and saved wishlist items.</li>
            <li><strong>Marketing & Promotions:</strong> Sending newsletters, exclusive offers, and targeted advertisements. You can opt out of marketing communications at any time.</li>
            <li><strong>Security & Fraud Prevention:</strong> Verifying account logins, monitoring for suspicious activities, and ensuring the safety of our platform and users.</li>
            <li><strong>Legal Compliance:</strong> Fulfilling regulatory requirements, responding to legal requests, and enforcing our store policies.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">4. Sharing Your Information</h3>
          <p>We only share your data with trusted entities under strict confidentiality conditions:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Service Providers:</strong> IT infrastructure hosts, payment processors, delivery partners, and analytics services.</li>
            <li><strong>Marketing Partners:</strong> To deliver relevant advertisements across other platforms, adhering to their respective privacy standards.</li>
            <li><strong>Legal Obligations:</strong> If required by law, such as responding to subpoenas or protecting the rights and safety of Celina Clothing and our customers.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or corporate restructuring.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">5. External Links</h3>
          <p>
            Our store may contain links to external sites not operated by Celina Clothing. We are not responsible for the privacy practices of these third-party platforms. We encourage you to review their independent privacy policies before sharing any personal data.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">6. Children's Privacy</h3>
          <p>
            Our services are designed for adults. We do not intentionally collect data from individuals under the age of 18. If you believe a minor has provided us with personal information, please contact us immediately to have it deleted.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">7. Data Security & Retention</h3>
          <p>
            While we employ industry-standard encryption and security protocols to protect your data, no digital transmission is entirely foolproof. We retain your information only as long as necessary to fulfill the purposes outlined in this policy, manage your account, or comply with legal obligations.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">8. Your Choices & Rights</h3>
          <p>Depending on your jurisdiction, you may hold specific rights regarding your personal data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right to Access:</strong> Requesting a copy of the data we have collected about you.</li>
            <li><strong>Right to Correction:</strong> Asking us to update inaccurate or incomplete information.</li>
            <li><strong>Right to Erasure:</strong> Requesting the deletion of your personal data from our systems.</li>
            <li><strong>Opting Out:</strong> You can unsubscribe from promotional emails using the link provided at the bottom of our marketing messages.</li>
          </ul>
          <p>
            We process these requests in compliance with applicable laws and will not discriminate against you for exercising your rights. Verification of identity may be required.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg uppercase text-black tracking-wide border-l-4 border-[#C9A227] pl-3">9. Contact Us</h3>
          <p>
            For any inquiries regarding our privacy practices, or to exercise your data rights, please reach out to us:
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

export default Privacy;
