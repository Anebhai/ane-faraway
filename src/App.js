import { useState } from "react";
import "./App.css";
import { Form } from "./Form";

function App() {
  return (
    <div className="App">
      <Faraway />
    </div>
  );
}

function Faraway() {
  // ^We lifted up the state and we are passing down functions, array to the child componnets as props, Here we lift the state up as we get new item from form component but item array is in packing list. So after lifting it we pass the items array as props to packing component. And functionhandle as prop to form component. convention is onAddItems.
  const [items, setItems] = useState([]);

  function handleAddItems(newItem) {
    setItems((prevItems) => [...prevItems, newItem]);
    // ^We are updating based on current state so callback function is needed, dont use push as we also need previous items
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all the items??"
    );
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      {/* Props convention */}
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return (
    <div>
      <h1> 🌴 Far Away 💼</h1>
    </div>
  );
}

function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
  // ^ For sorting we also use derive state from above items. And we dont mutatate the items directly so we use .slice()...See how locale compare for description and number for boolean is used.
  const [sortBY, setSortBy] = useState("input");
  let sortedItems;

  if (sortBY === "input") sortedItems = items;

  if (sortBY === "description") {
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  }

  if (sortBY === "packed") {
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      {sortedItems.length > 0 && (
        <div className="actions">
          <select
            value={sortBY}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
          >
            <option value="input">Sort by Input Order</option>
            <option value="description">Sort by description</option>
            <option value="packed">Sort by Packed Status</option>
          </select>
          <button onClick={onClearList}>ClearList</button>
        </div>
      )}
    </div>
  );
}

function Item({
  item: { id, description, quantity, packed },
  onDeleteItem,
  onToggleItem,
}) {
  return (
    <li>
      <input
        type="checkbox"
        value={packed}
        onChange={() => {
          onToggleItem(id);
        }}
      />
      <span style={packed ? { textDecoration: "line-through" } : {}}>
        {quantity} {description}
      </span>

      <button>
        <span onClick={() => onDeleteItem(id)}> ❌ </span>
      </button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length) {
    return (
      <footer className="stats">
        <em>Start Packing your List 🚀</em>
      </footer>
    );
  }

  // ^ Derived State. Always length and percentage calculations may be derived states.
  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentagePacked = (packedItems / totalItems) * 100;

  return (
    <footer className="stats">
      {percentagePacked === 100 ? (
        <em>You got everthing ready to go ✈🙌</em>
      ) : (
        <em>
          💼 You have {totalItems} items on your list, and you already packed{" "}
          {packedItems} ({percentagePacked.toFixed(0)}%) items.
        </em>
      )}
    </footer>
  );
}

export default App;
