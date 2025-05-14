import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import photo1 from "./assets/photo1.jpg";
import photo2 from "./assets/photo2.jpg";
import photo3 from "./assets/photo3.jpg";
import photo4 from "./assets/photo4.jpg";


// 로그인 처리 로직
function LoginForm({ onLogin }) {
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim()) onLogin(id.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        placeholder="아이디를 입력해주세요"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required // 반드시 채워야 함함
      />
    </form>
  );
}

function App() {
  const [user, setUser] = useState(() => localStorage.getItem('user'));

  useEffect(() => {
    if (user) localStorage.setItem('user', user);
    else localStorage.removeItem('user');
  }, [user]);

  const handleLogin = (id) => setUser(id);
  const handleLogout = () => {
    setUser(null);
    setIsEditing(false);
  };

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
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("photos", JSON.stringify(photos));
    } catch (error) {
      console.error("Error saving photos to localStorage:", error);
    }
  }, [photos]);

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
        ownerId: user,
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

  const handleDelete = (id) => {
    setPhotos(photos.filter((p) => p.id !== id));
    setSelected(null);
    setIsEditing(false);
  };

  const handleEditStart = (photo) => {
    setIsEditing(true);
    setEditTitle(photo.title);
    setEditDescription(photo.description);
  };

  const handleEditSave = (id) => {
    const updated = photos.map((p) =>
      p.id === id
        ? { ...p, title: editTitle.trim(), description: editDescription.trim() }
        : p
    );
    setPhotos(updated);
    const newSelected = updated.find((p) => p.id === id);
    setSelected(newSelected);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="app">
        <h1>Simple Photo Gallery Login</h1>
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Simple Photo Gallery</h1>
      <div className="user-info">
        <span>현재 ID: {user} </span>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
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
        <div
          className="modal"
          onClick={() => {
            setSelected(null);
            setIsEditing(false);
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selected.src} alt={selected.title} />
            <h2>{selected.title}</h2>
            <p>작성자: {selected.ownerId}</p>
            <p>{selected.description}</p>

            {selected.ownerId === user && (
              <div className="actions">
                {isEditing ? (
                  <form
                    className="upload-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditSave(selected.id);
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <button type="submit">저장</button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                    >
                      취소
                    </button>
                  </form>
                ) : (
                  <>  
                    <button onClick={() => handleEditStart(selected)}>수정</button>
                    <button onClick={() => handleDelete(selected.id)}>삭제</button>
                  </>
                )}
              </div>
            )}
            <button
              onClick={() => {
                setSelected(null);
                setIsEditing(false);
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;