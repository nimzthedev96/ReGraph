import { useState } from "react";
import { Form } from "react-bootstrap";
import { useAlert } from "../../context/AlertContext";
import BasicButton from "../../components/BasicButton";

const UploadFile = (params) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState("Default");
  const { showAlert } = useAlert();
  const { setPage } = params;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name);

      const token = localStorage.getItem("jwt_token");
      console.log(token);
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const fileResponse = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/uploadFile",
          {
            method: "POST",
            headers: {
              authorization: token, // Include the token in the header
            },
            body: formData,
          }
        );

        await fileResponse.json();

        console.log(fileResponse);

        if (fileResponse.status == "200") {
          if (category == null) setCategory("Default");

          const response = await fetch(
            process.env.REACT_APP_BACKEND_URL + "/data/readDataPointsFromFile",
            {
              method: "POST",
              headers: {
                Authorization: token, // Include the token in the header
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filename: "test1.csv",
                category: category,
              }),
            }
          );

          await response.json();

          console.log(response);

          showAlert("File uploaded successfully!", "success");
          setPage("report");
        } else {
          showAlert("File upload failed!", "danger");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        showAlert("File upload failed.", "danger");
      }
    } else {
      showAlert("No file selected! Please select a file first", "warning");
    }
  };

  return (
    <div>
      <h4>Upload new file</h4>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>

        {selectedFile && (
          <p className="mt-2">Selected file: {selectedFile.name}</p>
        )}
      </Form>
      <Form>
        <Form.Label htmlFor="cat">Enter a category for your data</Form.Label>
        <Form.Control id="cat" onChange={setCategory} />
      </Form>
      <Form>
        <BasicButton
          btnClass="btnPrimary"
          btnLabel="Upload file"
          btnOnClick={handleUpload}
        />
      </Form>
    </div>
  );
};

export default UploadFile;
