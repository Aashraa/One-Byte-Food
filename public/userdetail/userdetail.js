document.addEventListener("DOMContentLoaded", () => {
    // Function to handle login form submission
    const handleLogin = async (event) => {
      event.preventDefault();
  
      // Get form data
      const email = document.querySelector(".sign-in-form input[name='email']").value;
      const password = document.querySelector(".sign-in-form input[name='password']").value;
  
      try {
        // Send form data to server
        const response = await fetch("/sign_in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });
  
        if (response.ok) {
          // Extract user data from response
          const { username, email } = await response.json();
  
          // Update UI to display user details
          document.querySelector(".username").textContent = username;
          document.querySelector(".email").textContent = email;
          // Update other UI elements as needed
        } else {
          // Handle login failure
          alert("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please try again later.");
      }
    };
  
    // Add event listener to the login form
    document.querySelector(".sign-in-form").addEventListener("submit", handleLogin);
  });
  