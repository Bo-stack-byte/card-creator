import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './carousel.css'; // Ensure you have the CSS file for custom styling

Modal.setAppElement('#root'); // Set the app element for accessibility

const ImageBrowser = ({ folder, foreground, onSelectImage, maxWidth = 800, maxHeight = 600 }) => {
  const [urls, setUrls] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchUrls() {
      try {
        const response = await axios.get(`/api/image/get-signed-urls?folder=${folder}`);
        console.log("Fetched URLs:", response.data);
        setUrls(response.data);
        if (response.data.length > 0) {
          setSelectedImage(response.data[0]); // Set the first image as the selected image
        }
      } catch (error) {
        console.error("Error fetching signed URLs:", error);
      }
    }
    fetchUrls();
  }, [folder]);

  const handleOpen = () => {
    setOpen(true);
    console.log("Modal opened");
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
    console.log("Modal closed");
  };

  const handleThumbnailClick = (url) => {
    setSelectedImage(url);
    console.log("Thumbnail clicked:", url);
  };

  const handleSelectImage = () => {
    if (selectedImage) {
      onSelectImage(selectedImage, foreground);
      handleClose();
      console.log("Image selected:", selectedImage);
    }
  };

  return (
    <div>
      <button onClick={handleOpen}>Browse...</button>
      <Modal
        isOpen={open}
        onRequestClose={handleClose}
        contentLabel="Image Thumbnails"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxHeight: '80vh',
            overflowY: 'auto',
          },
        }}
      >
        <button onClick={handleClose} style={{ float: 'right', cursor: 'pointer' }}>Close</button>
        <h2>Thumbnails</h2>
        <div className="carousel-thumbs"> {/* Custom class for thumbnails */}
          {urls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Thumbnail ${index}`}
              onClick={() => handleThumbnailClick(url)}
              style={{ 
                width: '80px', 
                height: '80px', 
                cursor: 'pointer', 
                margin: '10px', 
                border: selectedImage === url ? '2px solid blue' : 'none'
              }} 
            />
          ))}
        </div>
        {selectedImage && (
          <div 
            style={{ 
              textAlign: 'center', 
              width: `${maxWidth}px`, 
              height: `${maxHeight}px`, 
              overflow: 'hidden', 
              margin: 'auto', 
              position: 'relative', 
              border: '1px solid #ccc', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <img
              src={selectedImage}
              alt="Selected"
              onClick={handleSelectImage}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                cursor: 'pointer' 
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ImageBrowser;
