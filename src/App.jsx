import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

const App = () => {
  const [date, setDate] = useState(new Date());
  const [birthdays, setBirthdays] = useState([]);
  const [loading,setLoading] = useState(false)
  const [query,setQuery] = useState('')
  const [favoriteBirthdays, setFavoriteBirthdays] = useState({});
  const obj = {
    "june 2":['g','o'],
    "june 5":['0','p']
  }
  console.log(Object.entries(obj),"objarra")


  const handleChange = (date) => {
    setDate(date);
    fetchBirthdays(date);
  };

  useEffect(()=>{
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    setLoading(true); // Set loading state to true before the fetch request
    fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${formattedDate}`)
      .then((res) => res.json())
      .then((response) => {
        const filteredData = response.births.filter((item)=>item.text.toLowerCase().trim().includes(query.toLowerCase().trim()))
        setBirthdays(filteredData);
        setLoading(false); // Set loading state to false after the fetch operation completes
      })
      .catch((error) => {
        console.error('Error fetching birthdays:', error);
        setLoading(false); // Make sure to set loading state to false in case of errors
      });

  },[query])

  useEffect(() => {
    fetchBirthdays(date);
  }, []);

  const fetchBirthdays = (date) => {

    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    setLoading(true); // Set loading state to true before the fetch request
    fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${formattedDate}`)
      .then((res) => res.json())
      .then((response) => {
        setBirthdays(response.births);
        setLoading(false); // Set loading state to false after the fetch operation completes
      })
      .catch((error) => {
        console.error('Error fetching birthdays:', error);
        setLoading(false); // Make sure to set loading state to false in case of errors
      });
  };

  const addToFavorites = (birthday) => {
    const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
    setFavoriteBirthdays((prev) => ({
      ...prev,
      [formattedDate]: [...(prev[formattedDate] || []), birthday.text],
    }));

    console.log(favoriteBirthdays,"fav")
    console.log(Object.entries(favoriteBirthdays))
  };
  const isFavorite = (birthday) => {
    const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
    return favoriteBirthdays[formattedDate]?.includes(birthday.text);
  };
  const removeFromFavorites = (date, birthday) => {
    setFavoriteBirthdays(prev => {
      const updatedFavorites = { ...prev };
      console.log(updatedFavorites[date],"updated date")
      updatedFavorites[date] = updatedFavorites[date].filter(
        favBirthday => favBirthday !== birthday
      );
      return updatedFavorites;
    });
  };
  
  return (
    <div className="container">
      <div style={{
        width:"100%",
        backgroundColor:"black",
        color:"white",
        textAlign:"center",
        marginBottom:"20px"
      }}>

      <h1>BirthDay Calendar</h1>
      </div>
      <div className="calendar-favorites-container">
        {/* Calendar */}
        <div className="calendar-container">
          <h2 className="section-heading">Calendar</h2>
          <Calendar value={date} onChange={handleChange} />
        </div>
        {/* Favorites */}
        <div className="birthday-list-container">
        <div className="section-heading"
       
        >
          <h2>All Birthdays On {date.toLocaleString('default', { month: 'long' })} {date.getDate()}</h2>
          <input type="text"
          placeholder='Search'
          value={query}
          onChange={(e)=>{
            setQuery(e.target.value)
          }}
          style={{
           padding:"10px",
           fontSize:"20px"

          }}
          />
        </div>
        {
          loading && <h1>
            Loading.....
          </h1>
        }
        {
        !loading &&
        birthdays.map((birthday, index) => (
          <div key={index}
          style={{
            display:"flex",
            justifyContent:"space-between"
          }}
          className="birthday-item">
            {birthday.text}
           {
            isFavorite(birthday)?
            <span
            
            style={{
              cursor:"pointer"
            }}
            >⭐</span>:<span
            onClick={()=>{
              addToFavorites(birthday)
            }}
            style={{
              cursor:"pointer"
            }}
            >☆</span>
           }
          </div>
        ))}
      </div>
      </div>
      {/* Birthday List */}
     
      <div className="favorites-container">
          <h2 className="section-heading">Favorites</h2>
          {
            Object.keys(favoriteBirthdays).length === 0 && <h2>
              No Favorite item added
            </h2>
          }
          <div className="favorite-list">

            {Object.entries(favoriteBirthdays).map(([date, birthdays]) => (
              <div key={date} className="favorite-date">
                <h3>{date}</h3>
                {birthdays.map((birthday, index) => (
                  <div key={index} className="favorite-item">
                   <p> {birthday} </p>
                   <button
                    onClick={() => removeFromFavorites(date, birthday)}
                   >remove</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      {/* demo */}
      {/* {
        Object.entries(obj).map(([date,birthdays])=>(
          <div key={date} className="favorite-date">
          <h3>{date}</h3>
          {birthdays.map((birthday, index) => (
            <div key={index} className="favorite-item">
              {birthday}
            </div>
          ))}
        </div>
        ))
      } */}
    </div>
  );
};

export default App;