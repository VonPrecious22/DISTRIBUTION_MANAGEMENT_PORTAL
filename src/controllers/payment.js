// Using fetch in JavaScript
fetch("https://api.notchpay.co/payments", {
  method: "POST",
  headers: {
    Authorization: "YOUR_PUBLIC_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    amount: 5000,
    currency: "XAF",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+237600000000",
    },
    description: "Payment for Order #123",
    callback: "https://your-website.com/callback",
    reference: "order_123",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    // Redirect the customer to the payment page
    window.location.href = data.authorization_url;
  })
  .catch((error) => console.error("Error:", error));
