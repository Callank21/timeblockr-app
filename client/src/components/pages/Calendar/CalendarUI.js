import React from 'react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { useCallback, useState, useEffect } from 'react';
import { QUERY_ME } from '../../../utils/queries';
import { CREATE_CALENDARITEM, UPDATE_CALENDARITEM, DELETE_CALENDARITEM} from '../../../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import * as dayjs from 'dayjs';

// first, import date.js to translate minutes into a timefram
// next, get a list of the events that will be translated into calendar items, get their times,
function freeTimeCalculator (data, timeframe) {
  console.log(data[0].start);
  console.log(data[0].end);
  console.log(dayjs(data[0].start).add(75, 'minute').$d);
  console.log(timeframe);
}

const CalendarUI = () => {
  const [createCalendarItem] = useMutation(CREATE_CALENDARITEM);
    const [updateCalendarItem] = useMutation(UPDATE_CALENDARITEM);
    const [onClick, setOnClick] = useState(false);
    const [events, setEvents] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [calendarItem, setCalendarItem] = useState({
        calendarId: '',
        title: '',
        category: '',
        start: '',
        end: '',
        state: ''
  });

  const [date, setDate] = useState(new Date().getDay());
    const [ID, setID] = useState();
    const [Roster, setRoster] = useState([]);
    const calendars = [{ id: 'cal1', name: 'Personal' }, {id: 'cal2', name: 'Tasks'}];

    useEffect(() => {
        if (localStorage.getItem('calendarRoster')) {
          setID(JSON.parse(localStorage.getItem('calendarRoster')));
        }
      }, []);

      
  const { data } = useQuery(QUERY_ME);

    useEffect(() => {
      data && setEvents(data.me.calendaritems);
      console.log(ID);
    }, [data]);

    useEffect(() => {
      if (data) {
      // freeTimeCalculator (events, 1000);
    }
    }, [data]);

    useEffect(() => {
        if (onClick) {
          handleCreateEvent();
        }
      }, [calendarItem]);

      
  
    const handleCreateEvent = async () => {
    
        const { calendarId, title, category, start, end, state } = calendarItem;
      if (calendarId === '' || title === '' || category === '' || start === '' || end === '') {
        setErrorMessage('Valid input required');
      } else {
        try {
          await createCalendarItem({
            variables: {
              calendarId: calendarId,
              title: title,
              category: category,
              start: start,
              end: end,
              state: state
            },
          });
        } catch (e) {
          console.error(e);
        }

        setCalendarItem({
          calendarId: '',
          title: '',
          category: '',
          start: '',
          end: '',
          state: ''
        });

      setOnClick(false);
      // window.location.assign(`/calendar`);
    }
    };

    const onAfterRenderEvent = (event) => {
      // console.log(event.title);
    };

    const calendarOptions = {
      useFormPopup: true,
      useDetailPopup: true,
    };
    
    class Options extends React.Component {
      calendarRef = React.createRef();


      onClickInstance = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.on('beforeCreateEvent', (data) => {
          setOnClick(true);
          setCalendarItem({
            calendarId: data.calendarId,
            title: data.title,
            category: 'time',
            start: data.start.d.d,
            end: data.end.d.d,
            state: data.state
          })
        });
      };
    
      handleClickNextButton = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.next();
      };

      handleClickBackButton = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.prev();
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

      popUpMenu = (event) => {
        console.log(event);
        event.preventDefault()
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.openFormPopup(event);
      }

      render() {
        return (
          <>
          <div className="calendarButtons">
                <button onClick={this.weekChange} type="button">week</button>
                <button onClick={this.monthChange} type="button">month</button>
            </div>
            <div className="calendarUIContainer" onClick={this.onClickInstance}>
            <Calendar 
            height="100%"
            width="100%"
            view="week"
            week={{
                dayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                startDayOfWeek: date,
                taskView: false,
                eventView: ['time']
            }}
            selectDateTime={this.selectDateTime}
            calendars={calendars}
            events={events}
            onAfterRenderEvent={onAfterRenderEvent}
            ref={this.calendarRef} {...calendarOptions} />
            <div className="weekNavContainer">
            <button onClick={this.handleClickBackButton}>Go back!</button>
            <button onClick={this.handleClickNextButton}>Go next!</button>
            </div>
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