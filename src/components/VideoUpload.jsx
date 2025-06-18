import { useState } from "react";
import videoLogo from "../assets/video-posting.png";
import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  Progress,
  Alert,
} from "flowbite-react";
import axios from "axios";
import toast from "react-hot-toast";

function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [meta, setMeta] = useState({ title: "", description: "" });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formFieldChange = (event) => {
    setMeta((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleForm = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a video file.");
      return;
    }
    saveVideoToServer(selectedFile, meta);
  };

  const resetForm = () => {
    setMeta({ title: "", description: "" });
    setSelectedFile(null);
    setProgress(0);
    setUploading(false);
  };

  const saveVideoToServer = async (video, videoMetaData) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", videoMetaData.title);
      formData.append("description", videoMetaData.description);
      formData.append("file", video);

      await axios.post("http://localhost:8000/api/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progressPercent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(progressPercent);
        },
      });

      setMessage("Uploaded successfully!");
      toast.success("Video uploaded!");
      resetForm();
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-white px-4 py-8 max-w-2xl mx-auto">
      <Card className="p-6 shadow-xl bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-center">Upload Video</h2>

        <form className="flex flex-col gap-5" onSubmit={handleForm} noValidate>
          {/* Title */}
          <div>
            <Label htmlFor="title" value="Video Title" />
            <TextInput
              id="title"
              name="title"
              value={meta.title}
              onChange={formFieldChange}
              placeholder="Enter title"
              disabled={uploading}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" value="Video Description" />
            <Textarea
              id="description"
              name="description"
              value={meta.description}
              onChange={formFieldChange}
              placeholder="Write video description..."
              rows={4}
              disabled={uploading}
              required
            />
          </div>

          {/* File Picker */}
          <div className="flex items-center gap-4">
            <img
              className="h-16 w-16 object-cover"
              src={videoLogo}
              alt="Video preview"
            />
            <div>
              <Label htmlFor="file">Choose Video File</Label>
              <input
                id="file"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="block mt-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              />
              {selectedFile && (
                <p className="text-sm mt-1 text-gray-400">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          {uploading && (
            <Progress
              color="blue"
              progress={progress}
              textLabel="Uploading"
              size="lg"
              labelProgress
              labelText
            />
          )}

          {/* Message */}
          {message && (
            <Alert
              color={message.includes("success") ? "success" : "failure"}
              withBorderAccent
              onDismiss={() => setMessage("")}
            >
              <span className="font-medium">{message}</span>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default VideoUpload;
