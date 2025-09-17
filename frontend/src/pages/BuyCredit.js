import React, { useContext, useState } from "react";
import { plans } from "../Data/dummydata";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";
import Gpi from "../Gpi";
import "./BuyCredit.css"; // Import the CSS

export default function BuyCredit() {
    const { user, getLocalcredits } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    const planToProductId = (planName) => {
        if (planName === "Basic") return "basic";
        if (planName === "Premium") return "premium";
        if (planName === "Pro") return "pro";
        return null;
    };

    const buy = async (planName) => {
        try {
            setLoading(true);
            const productId = planToProductId(planName);
            if (!productId) return toast.error("Invalid plan");

            const { data } = await Gpi.post(
                "/api/payment/create-order",
                { productId },
                { withCredentials: true }
            );

            if (!data.success)
                return toast.error(data.message || "Failed to create order");

            const { order, key } = data;

            const options = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: "Mock Interview Platform",
                description: planName,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await Gpi.post(
                            "/api/payment/verify",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                productId,
                            },
                            { withCredentials: true }
                        );

                        if (verifyRes.data.success) {
                            toast.success(
                                "Payment successful! Credits added to your account."
                            );
                            await getLocalcredits();
                        } else {
                            toast.error(
                                verifyRes.data.message || "Payment verification failed"
                            );
                        }
                    } catch (e) {
                        console.error(e);
                        toast.error("Payment verification error");
                    }
                },
                prefill: { name: user?.name || "", email: "" },
                theme: { color: "#3b82f6" },
                modal: { ondismiss: function () { setLoading(false); } },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (e) {
            console.error(e);
            toast.error("Checkout failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="buycredit-container">
            <button className="plans-btn">Plans</button>

            <h1 className="buycredit-title">Choose the Plan</h1>

            <div className="plans-grid">
                {plans.map((item, index) => (
                    <div key={index} className="plan-card">
                        <h2 className="plan-name">{item.name}</h2>
                        <p className="plan-price">{item.price}</p>
                        <p className="plan-credits">{item.credit} credits</p>
                        <p className="plan-desc">{item.description}</p>
                        <button
                            onClick={() => buy(item.name)}
                            disabled={loading}
                            className={`buy-btn ${loading ? "loading" : ""}`}
                        >
                            {loading ? "Processing..." : user ? "Buy Now" : "Get started"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
