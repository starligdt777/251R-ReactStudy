import React, { useState, useEffect, useRef } from "react"; // MODIFIED: import useRef
import "./App.css";
import photo1 from "./assets/photo1.jpg";
import photo2 from "./assets/photo2.jpg";
import photo3 from "./assets/photo3.jpg";
import photo4 from "./assets/photo4.jpg";

function App() {
  const defaultPhotos = [
    {
      id: 1,
      title: "숲",
      description: "이전에 사용하던 바탕화면입니다.",
      src: photo1,
      ownerId: "admin",
    },
    {
      id: 2,
      title: "크리스피 크림 도나쓰",
      description:
        "열량: 210kcal, 탄수화물: 23g, 단백질: 3g, 지방: 12g\n우리의 뱃살을 책임지는 든든한 간식",
      src: photo2,
      ownerId: "admin",
    },
    {
      id: 3,
      title: "쌀 티셔츠",
      description:
        "https://www.musinsa.com/products/3416460\n이런게 실제로 존재한답니다\n36,000원",
      src: photo3,
      ownerId: "admin",
    },
    {
      id: 4,
      title: "고려대 마스코트",
      description: "사실 저는 이 친구들이 누구인지 이름을 잘 모르겠습니다..",
      src: photo4,
      ownerId: "admin",
    },
  ];

  // lazy init
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem("photos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.error("Error parsing photos from localStorage:", error);
      }
    }
    return defaultPhotos;
  });

  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // file input 직접 통제

  // sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("photos", JSON.stringify(photos));
    } catch (error) {
      console.error("Error saving photos to localStorage:", error);
    }
  }, [photos]); // photos에 변화 생기면 자동으로 callback

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newPhoto = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        src: reader.result,
        ownerId: "currentUser", // TO-DO: implementing login
      };
      setPhotos((prev) => [newPhoto, ...prev]);
      setTitle("");
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowForm(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app">
      <h1>Simple Photo Gallery</h1>
      <button
        className="toggle-button"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "업로드 취소" : "새 사진 업로드"}
      </button>

      {showForm && (
        <form className="upload-form" onSubmit={handleSubmit}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">업로드</button>
        </form>
      )}

      <div className="gallery">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="thumbnail"
            onClick={() => setSelected(photo)}
          >
            <img src={photo.src} alt={photo.title} />
            <p>{photo.title}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selected.src} alt={selected.title} />
            <h2>{selected.title}</h2>
            <p>작성자: {selected.ownerId}</p>
            <p>{selected.description}</p>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
