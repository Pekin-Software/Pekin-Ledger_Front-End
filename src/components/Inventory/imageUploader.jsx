import React, { useState } from 'react';
import './imageUploader.css';
import { ShoppingBag } from 'lucide-react';

const ImageUploader = ({ product = {}, handleUploadImage }) => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerFileSelect = () => {
    document.getElementById("image-upload").click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setImageFile(file);
      handleUploadImage(product.id, file); // auto-upload
      setIsModalOpen(false); // close modal after image is selected
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setImageFile(file);
      handleUploadImage(product.id, file); // auto-upload
    }
  };


  return (
    <>
      <section className="product-image">
        <div
          className="imageholder"
          onClick={() => (image || product?.image) ? setIsModalOpen(true) : triggerFileSelect()}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {image || product?.image ? (
  <img src={image || product.image} alt="Product" />
) : (
  <div className="icon-placeholder">
    <ShoppingBag size={48} />
    <span>Click to Upload Product Photo</span>
  </div>
)}
        </div>

        <input
          id="image-upload"
          className="product-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" >
          <div className="modal-content" >
           <img src={image || product.image} alt="Full View" className="modal-image" />
            <span>
                <button className="upload-img" onClick={triggerFileSelect}>Change Image</button>
            <button className="close-img" onClick={() => setIsModalOpen(false)}>Close</button>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
