import React from 'react';
import RosterLevel from './RosterLevel';

const RosterItem = (props) => {

    function handleSubmit(e) {
        localStorage.setItem('calendarRoster', JSON.stringify(props._id));
    }

    return (
        <li className='topList'>
            {props.tasks.length > 0 ? (
                <>
                <div className="rosterListItem" style={props.done ? (
                    {backgroundColor: "green"}) :
                    ({backgroundColor: props.color})}>
                    <div>
                    <button>🗑</button>
                    <span>{props.title}</span>
                    </div>
                    <div>
                    <span>{props.totaltime}</span>
                    <form onSubmit={handleSubmit}>
                    <button type="submit">&#9658;</button>
                    </form>
                    </div>
                </div>
                {<RosterLevel
                color={props.color}
                depthLevel={props.depthLevel}
                {...props}
                />}
                </>
            ) : (
                <div className="rosterListItem" style={props.done ? (
                    {backgroundColor: "green"}) :
                    ({backgroundColor: props.color})}>
                    <div>
                    <button>🗑</button>
                    <span>{props.title}</span>
                    </div>
                    <div>
                    <span>{props.totaltime}</span>
                    <form onSubmit={handleSubmit}>
                    <button type="submit">&#9658;</button>
                    </form>
                    </div>
                </div>
            )
            }
        </li>
    )
}

export default RosterItem;