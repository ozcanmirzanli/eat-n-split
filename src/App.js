// @ts-nocheck
import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
    transactions: [],
    profile: {
      email: "clark@example.com",
      phone: "123-456-7890",
      address: "123 Main St, City",
    },
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
    transactions: [],
    profile: {
      email: "sarah@example.com",
      phone: "123-456-7890",
      address: "123 Main St, City",
    },
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
    transactions: [],
    profile: {
      email: "anthony@example.com",
      phone: "123-456-7890",
      address: "123 Main St, City",
    },
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // @ts-ignore
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    const transaction = {
      amount: value,
      expense: selectedFriend?.name,
      date: new Date().toLocaleDateString(),
    };

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend?.id
          ? {
              ...friend,
              balance: friend.balance + value,
              transactions: [...friend.transactions, transaction],
            }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <>
      <div className="title">
        <Title />
      </div>
      <div className="app">
        <div className="sidebar">
          <FriendsList
            friends={friends}
            onSelection={handleSelection}
            selectedFriend={selectedFriend}
          />

          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

          <Button onClick={handleShowAddFriend}>
            {!showAddFriend ? "Add friend" : "Close"}
          </Button>
        </div>
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
    </>
  );
}

function Title() {
  return <h1>Eat N' Split</h1>;
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul className="friends-list">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li
      className={isSelected ? "selected" : ""}
      onClick={() => onSelection(friend)}
    >
      <div className="friend-header">
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
      </div>

      {!isSelected && (
        <div className="balance-info">
          {friend.balance < 0 && (
            <p className="red">
              You owe {friend.name} {Math.abs(friend.balance)}€
            </p>
          )}
          {friend.balance > 0 && (
            <p className="green">
              {friend.name} owes you {Math.abs(friend.balance)}€
            </p>
          )}
          {friend.balance === 0 && <p>You and {friend.name} are even</p>}
        </div>
      )}

      {isSelected && (
        <div className="friend-details">
          <div className="profile-info">
            <p>Email: {friend.profile.email}</p>
            <p>Phone: {friend.profile.phone}</p>
            <p>Address: {friend.profile.address}</p>
          </div>
        </div>
      )}
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image || !email || !phone || !address) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?={id}`,
      balance: 0,
      id,
      profile: {
        email,
        phone,
        address,
      },
    };
    onAddFriend(newFriend);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑🏻‍🤝‍👩Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📧 Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>☎️ Phone</label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label>🏠 Address</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState(0);
  const [paidByUser, setPaidByUser] = useState(0);
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByFriend);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💵 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧑‍🦰 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>🧑🏻‍🤝‍👩 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      {selectedFriend && (
        <TransactionHistory transactions={selectedFriend.transactions} />
      )}

      <Button>Split bill</Button>
    </form>
  );
}

function TransactionHistory({ transactions }) {
  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      <ul>
        {transactions?.map((transaction, index) => (
          <li key={index}>
            <strong>{transaction.expense}'s</strong> expense was&nbsp;
            {transaction.amount}€ on {transaction.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
