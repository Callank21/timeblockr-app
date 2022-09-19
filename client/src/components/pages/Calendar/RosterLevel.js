import React from 'react';
import RosterItem from './RosterItem';
import { useState, useEffect } from 'react';

const RosterLevel = ({color, depthLevel, tasks}) => {
    depthLevel = depthLevel + 1;
    color = color.slice(
    color.indexOf("(") + 1, 
    color.indexOf(")")
).split(',').map(x => Number(x) - 30).join().replace(/^/,'rgb(').replace(/$/, ')');
    
    return(
        <ul className="rosterNewLevel">
        {tasks.map(item => (
        <RosterItem
        key={item._id}
        {...item}
        color={color}
        depthLevel={depthLevel}
        />
    ))}
        </ul>
    )
}

export default RosterLevel;