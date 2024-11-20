import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import DisplayImage from "./displayImage";

export default function Image() {
    const [userImage, setImage] = useState(null);
    const [previewImageUrl, setPreviewURL] = useState("");
    const [fullImage, setFullImage] = useState(false);
    const [allimge, setAllimage] = useState([]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImage(file);
        const previewImageUrl = URL.createObjectURL(file);
        setPreviewURL(previewImageUrl);
    };

    const handleFullImage = () => {
        setFullImage(true);
    };

    const closeFullImage = () => {
        setFullImage(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userImage", userImage);

        try {
            const response = await axios.post("http://127.0.0.1:300/imageUplode", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            await displayImage();

            setPreviewURL("");
            setImage(null);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const displayImage = async () => {
        try {
            console.log("Fetching images...");
            const response = await axios.get("http://127.0.0.1:300/imageUplode");
            if (response.status === 200) {
                console.log("Images fetched successfully:", response.data);
                setAllimage(response.data);
            } else {
                console.error("Failed to fetch images", response.status);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        displayImage();
    }, []);
    return (
        <div className="container">
            <div className={allimge.length ? "image_container display_allImage" : "image_container"}>
                {allimge.length > 0 && <DisplayImage allimge={allimge} displayImage={displayImage} />}
                {fullImage && (
                    <div className="full_image_preview_bluer">
                        <div className="preview_image_box">
                            <div className="big_preview">
                                <div className="clse_btn" onClick={closeFullImage}>X</div>
                                <img src={previewImageUrl} alt="Preview" />
                            </div>
                        </div>
                    </div>
                )}
                <div className="max-width">
                    <div className="image_box_data">
                        <form onSubmit={handleSubmit}>
                            {previewImageUrl && (
                                <div className="preview_image_section">
                                    <div className="preview_image" onClick={handleFullImage}>
                                        <img src={previewImageUrl} alt="Preview" />
                                    </div>
                                </div>
                            )}
                            <input
                                type="file"
                                id="file"
                                className="file-input"
                                onChange={handleImage}
                                accept="image/*"
                                required
                            />
                            <label htmlFor="file" className="file-input-label">Choose Image</label>
                            <button type="submit" className="file-input-label for_button">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
