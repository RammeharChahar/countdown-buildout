import React, { useEffect, useState } from 'react';
import './Countdown.css';
import { Howl } from 'howler';

function Countdown() {
  const [isCounterRunning, setIsCounterRunning] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isCounterOver, setIsCounterOver] = useState(false);
  const [selectedDaysError, setSelectedDaysError] = useState(false);

   useEffect(() =>{
    const getLocalData = localStorage.getItem('counter');
    const selectedDate = localStorage.getItem('selectedDate');
    if(getLocalData){
      const getCounter = JSON.parse(getLocalData);
      setIsCounterRunning(true);
      setSelectedDateTime(selectedDate);
      setTimeRemaining( 
        getCounter.days,
        getCounter.hours,
        getCounter.minutes,
        getCounter.seconds)
    }
   },[])


  useEffect(() => {
    let timer;

    const calculateTimeRemaining = () => {
      const selectedDate = new Date(selectedDateTime);
      const now = new Date();

      if (selectedDate > now) {
        let timeDifference = selectedDate - now;

        const oneDay = 1000 * 60 * 60 * 24;
        const oneHour = 1000 * 60 * 60;
        const oneMinute = 1000 * 60;
        const oneSecond = 1000;

        const days = Math.floor(timeDifference / oneDay);
        timeDifference %= oneDay;

        const hours = Math.floor(timeDifference / oneHour);
        timeDifference %= oneHour;

        const minutes = Math.floor(timeDifference / oneMinute);
        timeDifference %= oneMinute;

        const seconds = Math.floor(timeDifference / oneSecond);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds
        });

        const localStorageObject = {
          days : days,
          hours : hours,
          minutes : minutes,
          seconds : seconds,
        }

        if (days <= 99) {
          setSelectedDaysError(false);
        }

        const timeRemainingObject = JSON.stringify(localStorageObject);
        localStorage.setItem('counter', timeRemainingObject);

      } else {
        clearInterval(timer);
        setIsCounterRunning(false);
        setIsCounterOver(true);
      }
    };

    if (isCounterRunning) {
      timer = setInterval(calculateTimeRemaining, 1000);
    }

    return () => clearInterval(timer);
  }, [isCounterRunning, selectedDateTime]);

  const handleTimeChange = (event) => {
    const dateTimeValue = event.target.value;
    setSelectedDateTime(dateTimeValue);
    localStorage.setItem('selectedDate', event.target.value);

    const selectedDate = new Date(dateTimeValue);
    const now = new Date();
    const timeDifference = selectedDate - now;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (days > 99) {
      setSelectedDaysError(true);
    } else {
      setSelectedDaysError(false);
    }
    setIsCounterOver(false); 
  };

  const toggleCounter = (event) => {
    event.preventDefault();
    setIsCounterRunning(!isCounterRunning);
    setIsCounterOver(false); 
  };

  const handleCounterBtn = () =>{
    if(isCounterRunning){
      setTimeRemaining({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      });
      localStorage.setItem('counter', '');
      localStorage.setItem('selectedDate', '');
    }
  }

  return (
    <div className="countdown_wrapper">
      <form onSubmit={toggleCounter} className="form_wrap">
        <input
          type="datetime-local"
          onChange={handleTimeChange}
          className="countdown_picker"
          id="countdowntime"
          name="countdowntime"
        />
        <button type="submit" onClick={handleCounterBtn} className="countdown_start_btn">
          {isCounterRunning ? 'Cancel' : 'Start Timer'}
        </button>
      </form>

      {selectedDaysError ? (
        <p className="counter_text">Selected time is more than 100 days</p>
      ) : isCounterOver ? (
        <p className="counter_text">🎉 The countdown is over! What's next on your adventure? 🎉</p>
      ) : (
        <div className="counter_wrapper">
          <div className="counter_div">
            <p className="counter_content">{timeRemaining.days}</p>
            <p className="counter_content_1">Days</p>
          </div>
          <div className="counter_div">
            <p className="counter_content">{timeRemaining.hours}</p>
            <p className="counter_content_1">Hours</p>
          </div>
          <div className="counter_div">
            <p className="counter_content">{timeRemaining.minutes}</p>
            <p className="counter_content_1">Minutes</p>
          </div>
          <div className="counter_div">
            <p className="counter_content">{timeRemaining.seconds}</p>
            <p className="counter_content_1">Seconds</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Countdown;
