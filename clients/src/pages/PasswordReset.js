import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Use "react-router-dom" to extract URL parameters
import axios from "axios";

function PasswordReset() {
  const { token } = useParams(); // Extract the token from the URL query parameters
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    // Check if the token is valid on component mount (when the page loads)
    axios
      .get(`http://localhost:5001/check-reset-token/${token}`)
      .then((response) => {
        // Token is valid, you can proceed to show the password reset form
      })
      .catch((err) => {
        // Token is invalid or has expired, display an error message or redirect to an error page
      });
  }, [token]);

  const handlePasswordReset = () => {
    // Make a request to your server to reset the user's password
    axios
      .post("https://faceback.onrender.com/reset-password", { token, password })
      .then((response) => {
        // Password reset was successful, you can show a success message or redirect to the login page
        setResetSuccess(true);
      })
      .catch((err) => {
        // Handle errors if the password reset fails
      });
  };

  if (resetSuccess) {
    return <div>Password reset successful! You can now login with your new password.</div>;
  }

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handlePasswordReset}>Reset Password</button>
    </div>
  );
}

export default PasswordReset;
