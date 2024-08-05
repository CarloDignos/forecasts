import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "./editUser.css";
import botImg from "../assets/bot.jpeg";

function EditUser({ user, show, onHide, onSave }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user.firstName);
  const [middleName, setMiddleName] = useState(user.middleName);
  const [lastName, setLastName] = useState(user.lastName);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [userType, setUserType] = useState(user.userType);
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false); // Add loading state

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 2097152) {
      return alert("Max file size is 2mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "jmkohxmf");
    try {
      setUploadingImg(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/aspiree14/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true); // Set loading to true when saving starts

      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
      }

      const updatedUser = {
        ...user,
        firstName,
        middleName,
        lastName,
        email,
        picture: imageUrl || user.picture,
      };

      if (password.trim() !== "") {
        updatedUser.password = password;
      }

      onSave(updatedUser);

      // Simulate some delay to show the loading state
      setTimeout(() => {
        setLoading(false); // Set loading to false after saving is complete
        onHide(); // Hide the modal
        navigate("/UserInformation"); // Navigate back to "/UserInformation"
      }, 2000); // Adjust the delay time as needed
    } catch (error) {
      setLoading(false); // Set loading to false in case of an error
      console.error("Failed to update user:", error.response.data.error);
      // You can show an error message here
    }
  };

  return (
    <Modal show={show} onHide={onHide} animation={false} className="animated-modal">
      <Modal.Header closeButton>
        <Modal.Title>Profile information edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="signup-profile-pic__container">
            <img
              src={imagePreview || user.picture || botImg}
              className="signup-profile-pic"
              alt=""
            />
            <label htmlFor="image-upload" className="image-upload-label">
              <i className="fas fa-plus-circle add-picture-icon"></i>
            </label>
            <input
              type="file"
              id="image-upload"
              hidden
              accept="image/png, image/jpeg"
              onChange={validateImg}
            />
          </div>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formMiddleName">
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditUser;
