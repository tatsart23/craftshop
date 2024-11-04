import React, {useState} from 'react'

const addCarousel = () => {

    const [formData, setFormData] = useState({
        text: '',
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('text', formData.text);
        if (image) {
            formDataToSend.append('testImage', image);
        }

        try {
            const response = await fetch('http://localhost:5000/addCarousel', {
                method: 'POST',
                body: formDataToSend,
            });

            const textResponse = await response.text();
            let jsonResponse;

            try {
                jsonResponse = JSON.parse(textResponse);
            } catch (err) {
                console.error('Failed to parse JSON:', err, textResponse);
                jsonResponse = null;
            }

            if (response.ok) {
                if (jsonResponse) {
                    console.log(jsonResponse);
                    alert('Carousel image added successfully!');
                    setFormData({ text: '' });
                }
            } else {
                console.error('Failed to add carousel:', jsonResponse);
                alert('Failed to add to carousel. Please try again.');
            }
        } catch (error) {
            console.error('Error adding carousel:', error);
            alert('Failed to add carousel. Please try again.');
        }

    }

  return (
    <div>
      
        <form className="data-wrapper" onSubmit={handleSubmit} encType='multipart/form-data'>

            <h2>Add to Carousel</h2>

            <label>Text:</label>
            <input
                name="text"
                placeholder="Text"
                value={formData.text}
                onChange={handleChange}
                required
            />

            <label>Image:</label>
            <input type="file" name="image"
                onChange={handleImageChange}
                required
            />

            <button type="submit" className="add-button">Submit</button>
        </form>

    </div>
  )
}

export default addCarousel
