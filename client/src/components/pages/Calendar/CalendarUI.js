import React from 'react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { useState, useEffect } from 'react';
import { QUERY_TASK } from '../../../utils/queries';
import { useQuery } from '@apollo/client';


const CalendarUI = () => {
    const [date, setDate] = useState(new Date().getDay());
    const [ID, setID] = useState();
    const calendars = [{ id: 'cal1', name: 'Personal' }, {id: 'cal2', name: 'Tasks'}];

    useEffect(() => {
        if (localStorage.getItem('calendarRoster')) {
          setID(JSON.parse(localStorage.getItem('calendarRoster')));
        }
      }, [ID]);

      const { data } = useQuery(QUERY_TASK, {
        variables: { id: ID },
    });

    const initialEvents = [
      {
        id: '1',
        calendarId: 'cal1',
        title: 'Lunch',
        category: 'time',
        start: '2022-09-17T19:30:00',
        end: '2022-09-17T20:00:00',
      },
      {
        id: '2',
        calendarId: 'cal1',
        title: 'Coffee Break',
        category: 'time',
        start: '2022-09-28T15:00:00',
        end: '2022-09-28T15:30:00',
      },
    ];
  
    const onAfterRenderEvent = (event) => {
      console.log(event.title);
    };

    const calendarOptions = {
    };
    
    class Options extends React.Component {
      calendarRef = React.createRef();


      onClickInstance = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        console.log(calendarInstance.on('selectDateTime', (eventObj) => {
          console.log(eventObj);
        }));
      };
    
      handleClickNextButton = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.next();
      };
    
      weekChange = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.changeView("week");
      }

      monthChange = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.changeView("month");
      }

      selectDateTime = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        var dateTime = calendarInstance.selectDateTime();
        console.log(dateTime);
      }

      render() {
        return (
          <>
          <div className="calendarButtons">
                <button onClick={this.weekChange} type="button">week</button>
                <button onClick={this.monthChange} type="button">month</button>
            </div>
            <div className="calendarUIContainer" onMouseUp={this.onClickInstance}>
            <Calendar 
            height="100%"
            width="100%"
            view="week"
            week={{
                dayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                startDayOfWeek: date,
            }}
            selectDateTime={this.selectDateTime}
            calendars={calendars}
            events={initialEvents}
            onAfterRenderEvent={onAfterRenderEvent}
            ref={this.calendarRef} {...calendarOptions} />
            <button onClick={this.handleClickNextButton}>Go next!</button>
            </div>
          </>
        );
      }
    }

    return (
        <div className="calendarUIContainer">
            <Options></Options>
        </div>
    )
}

export default CalendarUI;