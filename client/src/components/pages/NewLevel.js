import React from 'react';
import ProjectCard from './ProjectCard';

const newLevel = (props) => {
    return (
    <ul>
        {props.tasks.map(item => (
        <ProjectCard
        key={item._id}
        {...item}
        />
    ))}
    </ul>
    )
}

export default newLevel;