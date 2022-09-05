import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_TASK } from '../../utils/queries';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Project = () => {
    const { id: projectId } = useParams();

    const { data } = useQuery(QUERY_TASK, {
        variables: { id: projectId },
    });
    const [task, setTask] = useState({
        id: "",
        title: "",
        time: "",
        totaltime: "",
        description: "",
        path: ""
    });

    useEffect(() => {
        data && setTask({
        id: data.task[0]._id,
        title: data.task[0].title,
        time: data.task[0].time,
        totaltime: data.task[0].totaltime,
        description: data.task[0].description,
        path: data.task[0].path 
        });
    }, [data]);

    const [back, setBack] = useState('');

    useEffect(() => {
        data && setBack(data.task[0].path.split(',').filter(item => item)[0]);
    }, [data]);
    return(
        <div>
            <Link key={task._id} to={`/projects/${back}`}>
            <div className='buttonContainer'>
              <p>&larr; Back </p>
            </div>
            </Link>
            <div className="projectContainer">
                <div>
                <h1>{task.title}</h1>
                <div className="lowerTaskContainer">
                <div className="taskDescription">
                <p>{task.description}</p>
                </div>
                <div className="taskTime">
                <div className="taskTimeCard"><span>Total:</span><span>{task.time}</span></div>
                <div className="taskTimeCard"><span>Total:</span><span>{task.totaltime}</span></div>
                </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Project;