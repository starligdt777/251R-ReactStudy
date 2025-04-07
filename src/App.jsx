import { useState } from 'react'
import Item from "./items"

function App() {
  const [menu, setMenu] = useState([
    { id: 1, name: "삼겹살", description: "150g", price: 8000 },
    { id: 2, name: "목살", description: "150g", price: 6000 },
    { id: 3, name: "공깃밥", description: "", price: 1000 },
    { id: 4, name: "음료수", description: "콜라, 사이다", price: 2000 },
  ]);

  const [newItem, setNewItem] = useState({ name: "", description: "", price: "" });

  const add = () => {
    if (!newItem.name || !newItem.price) return; // 이름이나 가격 없으면 그냥 return
    const id = Date.now();
    setMenu([...menu, { id, ...newItem, price: Number(newItem.price )}]);
    setNewItem({ name: "", description: "", price: "" });
  };

  const remove = (id) => {
    setMenu(menu.filter(item => item.id !== id)) // id가 같은 것만 뺴냄
  };

  return (
    <div className='appContainer'>
      <h1> 메에뉴유파안</h1>

      {menu.map((item) => (
        <Item key={item.id} {...item} onDelete={() => remove(item.id)} />
      ))}

      <div className="inputHandle">
        <input
        placeholder='이름'
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        // onChange : 무언가 변경이 있을 때마다 실행
        />
        <input
        placeholder='설명'
        value={newItem.description}
        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <input
        placeholder='가격'
        type='number'
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <button onClick={add}>메뉴 추가</button>
      </div>

    </div>
      
  );
}

export default App;
