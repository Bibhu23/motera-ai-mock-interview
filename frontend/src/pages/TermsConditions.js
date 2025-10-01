import React from "react";
import "./TermsConditions.css";

export default function TermsConditions() {
    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="page-wrapper">
            <div className="terms-container">
                <h1>📜 Terms & Conditions for Motera App</h1>
                <p className="policy-dates"><strong>Effective Date:</strong> September 30, 2025</p>
                <p className="policy-dates"><strong>Last Updated:</strong> {today}</p>

                <h3>1. Acceptance of Terms</h3>
                <p>
                    By using the Motera app and related services, you agree to comply with these Terms
                    & Conditions. If you do not agree, you must not use our services. Continued use
                    of the app constitutes acceptance of updates or modifications to these terms.
                </p>

                <h3>2. User Accounts</h3>
                <p>
                    To access certain features, you may need to create an account. You are responsible
                    for maintaining the confidentiality of your login credentials and for all activities
                    under your account. Notify us immediately of any unauthorized use.
                </p>

                <h3>3. User Conduct</h3>
                <div className="disclaimer-box-user">
                    <ul>
                        <li>You agree not to misuse the app.</li>
                        <li>Do not upload harmful content.</li>
                        <li>Do not attempt unauthorized access.</li>
                        <li>Prohibited activities include harassment.</li>
                        <li>Do not upload malicious software.</li>
                        <li>Do not violate laws and regulations.</li>
                    </ul>
                </div>

                <h3>4. Intellectual Property</h3>
                <p>
                    All content, designs, software, and materials provided in the Motera app are
                    owned by Motera or its licensors. You may not copy, distribute, or use the
                    content without our written permission.
                </p>

                <h3>5. Data & Recordings</h3>
                <p>
                    Any data, including interview recordings, are retained only as long as necessary
                    to provide our services. For example, recordings are automatically deleted after
                    <strong> 14 days</strong> unless you request otherwise.
                </p>

                <div className="disclaimer-box">
                    <strong>⚠️ Important Disclaimer</strong>
                    <p>
                        Motera is provided "as is" without warranties of any kind. We are not liable for indirect,
                        incidental, or consequential damages resulting from the use of the app. Users acknowledge
                        the inherent risks of using AI-powered services.
                    </p>
                </div>

                <h3>7. Termination</h3>
                <p>
                    We may suspend or terminate your account if you violate these Terms & Conditions
                    or engage in illegal or harmful behavior. You may also terminate your account at
                    any time by contacting support.
                </p>

                <h3>8. Governing Law</h3>
                <p>
                    These Terms & Conditions are governed by the laws of [Insert Country/State]. Any
                    disputes arising from use of the Motera app shall be resolved in the applicable
                    courts of that jurisdiction.
                </p>

                <h3>9. Changes to Terms</h3>
                <p>
                    We may update these Terms & Conditions occasionally. Continued use of the app
                    means you accept any changes. We encourage you to review this page periodically.
                </p>

                <h3>10. Contact Us</h3>
                <p className="support">
                    <strong> Email:</strong>support@moterai.com<br />
                    <strong> Website: </strong>https://motera.app<br />
                    <strong>Response Time:</strong>We aim to respond to all privacy-related inquiries within 48 hours
                </p>
            </div>
        </div>
    );
}
