import React, { useState, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const ProfilePicUpload = ({ profilePicUrl, onImageChange, isEditing }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(
    false
  );

  useEffect(() => {
    // No need to save the previous image URL in this component
  }, []);

  const handleHover = (hover) => {
    setIsHovered(hover);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setIsConfirmationDialogOpen(true);
    }
  };

  const handleUploadButtonClick = () => {
    // Trigger the hidden input element to open the file explorer
    document.getElementById("fileInput").click();
  };

  const handleImageUploadSubmit = () => {
    setIsConfirmationDialogOpen(false);
    if (selectedImageFile) {
      // Call the parent component's function to handle the image change
      onImageChange(selectedImageFile);
    }
  };

  const handleImageUploadCancel = () => {
    setSelectedImageFile(null);
    setIsConfirmationDialogOpen(false);
  };

  return (
    <div className="flex flex-center">
      <div
        className="relative"
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
      >
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <Avatar
          src={
            profilePicUrl ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt="Avatar"
          className="rounded-xl h-40 w-40 flex items-center justify-center"
        />

        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconButton
              className="text-white absolute "
              onClick={handleUploadButtonClick}
            >
              <CloudUploadIcon />
            </IconButton>
          </div>
        )}

        <Dialog
          open={isConfirmationDialogOpen}
          onClose={handleImageUploadCancel}
          style={{ zIndex: "99999" }}
        >
          <DialogTitle>Confirm Image Upload</DialogTitle>
          <DialogContent>
            {selectedImageFile && (
              <div>
                <img
                  src={URL.createObjectURL(selectedImageFile)}
                  alt="Selected"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    marginBottom: "10px",
                    zIndex: 1,
                  }}
                />
              </div>
            )}
            <p>Are you sure you want to upload this image?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleImageUploadCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleImageUploadSubmit} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfilePicUpload;
