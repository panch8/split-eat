import { useState } from "react";


const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children, onClick}){
  return <button onClick={onClick} className="button">{children}</button>
}

function App() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  
  function handlerOnClick(){
    setIsAddFormOpen((isAddFormOpen)=>!isAddFormOpen)

  }

  function handlerAddFriend(newFriend){
    setFriends((friends)=>[...friends, newFriend])
    setIsAddFormOpen(false)
    setSelectedFriend(newFriend)
  }

  function handleSelectFriend(friend){
    setSelectedFriend((f)=>f?.id === friend.id ? null : friend);
    setIsAddFormOpen(false);
  } 

  // no need to pass whole friend because already the selected friend is in the app state
  // function handleUpdateBalance(updatedFriend){
  //   let index;
  //   friends.filter((fr,i)=>{
  //      fr.id === updatedFriend.id && (index = i)
  //   })
    
  //   setFriends((friends)=>{return friends.toSpliced(index,1,updatedFriend)})
  //   setSelectedFriend(updatedFriend)

  // }

  function handleUpdateBalance(updatedValue){
    
    setFriends((friends)=>
    friends.map(friend => 
      friend.id === selectedFriend.id
      ? {...friend, balance: friend.balance + updatedValue}
      :friend
      )
    );
     setSelectedFriend(null)
  }
  return (
    <div className="app">
     <div className="sidebar">
      <FriendsList 
      friends={friends} 
      selectedFriend={selectedFriend} 
      onSelect={handleSelectFriend}  />
      
      {isAddFormOpen && 
      <AddFriendForm onAddFriend={handlerAddFriend}/>}
      
      <Button onClick={handlerOnClick}>{isAddFormOpen?"Close":"Add Friend"}</Button>
     </div> 
      {selectedFriend && <SplitForm selectedFriend={selectedFriend} onSplit={handleUpdateBalance}/>}
      
    </div>
  );
}

function FriendsList({friends, onSelect, selectedFriend}){
  return <ul>
    {friends.map(friend=> 
    <Friend 
    key={friend.name} 
    friend={friend} 
    onSelect={onSelect} 
    selectedFriend={selectedFriend}/>)}
  </ul>
}

function Friend({friend, onSelect, selectedFriend}){
  return <li>
    <img src={friend.image} alt={friend.name}></img>
    <h3>{friend.name}</h3>
    <p>{friend.balance === 0 && `You and ${friend.name} are even`}</p>
    <p className="red">{friend.balance < 0 && `You owe ${friend.name} $${Math.abs(friend.balance)}`}</p>
    <p className="green">{friend.balance > 0 && `${friend.name} owes you $${friend.balance}`}</p>
    <Button onClick={()=>onSelect(friend)}>{selectedFriend === friend ? "close":"select"}</Button>
  </li>
}

function AddFriendForm({onAddFriend}){
  const [name,setName]= useState("");
  const [photoUrl, setPhotoUrl] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e){
    e.preventDefault();
    if(!name)return;
    const newFriend = {
      name,
      image: photoUrl,
      id: crypto.randomUUID(),
      balance: 0
    }
    onAddFriend(newFriend);

    setPhotoUrl("https://i.pravatar.cc/48");
    setName('');


  }

  return(
    <form className="form-add-friend">
      <label>🕺 Friend Name</label>
      <input type="text" value={name} onChange={(e)=>setName(e.target.value)} autoFocus={true} ></input>
      <label>📷 Image URL</label>
      <input type="text" value={photoUrl} onChange={(e)=>setPhotoUrl(e.target.value)}></input>
      <Button onClick={handleSubmit}>Add</Button>
    </form>
 )
}

function SplitForm({selectedFriend, onSplit}){

  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense]= useState("");
  const friendExpense = bill? bill - myExpense: "";
  const [whoPays, setWhoPays] = useState('you');
  
  function handleSplit(e){
    e.preventDefault();
    if(!bill || !myExpense ) return;
    const localeBalance = whoPays !== 'you'? -myExpense : bill - myExpense;

    // const balance = selectedFriend.balance + localeBalance;
    // const updatedFriend={...selectedFriend, balance};
    // console.log(updatedFriend);
    // onSplit(updatedFriend);
    onSplit(localeBalance);
    setBill(0);
    setMyExpense(0);
    setWhoPays('you');
  }
  
  
  

  return (
     <form className="form-split-bill" 
    onSubmit={handleSplit}>

      <h2>{`Split a bill with ${selectedFriend.name}`}</h2>
      <label>💰 Bill value</label>
      <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))}></input>
      <label>🏃‍♂️ Your expense</label>
      <input type="text" value={myExpense} onChange={(e)=>setMyExpense(Number(e.target.value) > bill? myExpense : +e.target.value)}></input>
      <label>🏃‍♂️ {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendExpense}></input>
      <label>🤑 Who is paying the bill</label>
      <select value={whoPays} onChange={(e)=>setWhoPays(e.target.value)}>
        <option value={'you'}> You </option>
        <option value={selectedFriend.id}>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  )
}




export default App;
