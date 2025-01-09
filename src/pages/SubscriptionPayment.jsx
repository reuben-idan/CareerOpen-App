import { useState } from "react";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// toast.configure(); // Configure Toastify once

const SubscriptionPayment = () => {
  const publicKey = "pk_test_90800a7e8af8e9abef7680fabff8026047606e40"; // Replace with your Paystack public key
  const amount = 500000; // Example amount in kobo (5000 GHC)
  const currency = "GHS"; // Specify the correct currency

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const componentProps = {
    email,
    amount,
    currency, // Add currency to component props
    metadata: {
      name,
      phone,
    },
    publicKey,
    text: "Subscribe Now",
    onSuccess: () => {
      toast.success("Subscription successful! Welcome to CareerOpen.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onClose: () => {
      toast.info("You left the payment process. Subscription incomplete.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Subscribe to CareerOpen
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Unlock premium job listings and career resources with our subscription
        plan.
      </p>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </form>

        <div className="mt-6">
          <PaystackButton
            {...componentProps}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPayment;
