import React from "react";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="privacy-container">
            <h1>🔒 Privacy Policy for Motera App</h1>
            <p className="policy-dates"><strong>Effective Date:</strong> September 30, 2025</p>
            <p className="policy-dates"><strong>Last Updated:</strong> {today}</p>

            <h3>Introduction</h3>
            <p>
                Motera (“we,” “our,” or “us”) values your trust. This Privacy Policy explains how we collect,
                use, and protect your personal information when you use the <strong>Motera app</strong> and
                related services.
            </p>

            <h3>Personal Information</h3>
            <p>Name, email, phone number, and resume details you provide.</p>

            <h3>Usage & Technical Information</h3>
            <p>Device type, OS, browser, IP, session logs, and performance analytics.</p>

            <h3>Video & Audio Data</h3>
            <p>
                Video/audio streams during mock interviews may be temporarily processed for face detection,
                expression analysis, or proctoring. Recordings only stored if you consent.
            </p>

            <h3>How We Use Your Information</h3>
            <ul>
                <li>Provide and improve mock interview services.</li>
                <li>Analyze performance and give AI feedback.</li>
                <li>Ensure interview integrity (face presence monitoring).</li>
                <li>Communicate updates or support messages.</li>
                <li>Comply with legal obligations.</li>
            </ul>

            <h3>Data Sharing & Disclosure</h3>
            <p>We do not sell personal data. Sharing occurs only for:</p>
            <ul>
                <li>Service providers (hosting, analytics).</li>
                <li>Legal compliance.</li>
                <li>Business transfers (merger, acquisition).</li>
            </ul>

            <h3>Data Retention</h3>
            <p>
                Personal data collected through our services is retained only for as long as necessary to provide
                the services and fulfill the purposes described in this Privacy Policy. Interview recordings,
                for example, are automatically deleted after <strong>14 days</strong>, unless you specifically
                request otherwise.
            </p>


            <h3>Security of Your Information</h3>
            <p>
                We implement reasonable administrative, technical, and physical safeguards to protect your
                personal information from unauthorized access, disclosure, alteration, or destruction. While we
                strive to protect your data, no system is completely secure. We recommend that you also take
                precautions, such as using strong passwords and keeping your login details confidential.
            </p>

            <h3>Your Rights</h3>
            <p>
                Depending on your jurisdiction, such as GDPR in Europe or CCPA in California, you have certain
                rights regarding your personal information. You may request access to your data, correct or
                update inaccurate information, request deletion of your data, or request that it be transferred
                to another service. To exercise your rights, please contact us at <strong>support@moterai.com</strong>.
            </p>

            <h3>Children’s Privacy</h3>
            <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect
                personal information from children under 13. If you believe that your child has provided us
                with personal information, please contact us immediately so that we can take appropriate
                action, including deleting the data.
            </p>

            <h3>Changes to this Policy</h3>
            <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, legal
                requirements, or business operations. We encourage you to review this page periodically. Your
                continued use of the Motera app constitutes acceptance of any updates or modifications.
            </p>

            <h3>Contact Us</h3>
            <p className="support">
                <strong> Email:</strong>support@moterai.com<br />
                <strong> Website: </strong>https://motera.app<br />
                <strong>Response Time:</strong>We aim to respond to all privacy-related inquiries within 48 hours
            </p>
        </div>
    );
}
