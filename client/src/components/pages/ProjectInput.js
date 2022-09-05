import React from 'react';
import { useState, useEffect } from 'react';
import Projects from '../pages/Projects';
import InputForm from '../pages/InputForm';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';
import { Link } from 'react-router-dom';

const ProjectInput = () => {
    const [state, setState] = useState(false);

    const handleClick = () => {
        setState(!false);
      };

      var { data } = useQuery(QUERY_ME);
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        data && setTasks(data.me.tasks);
    }, [data]);

    var parentValues = tasks.filter(x => x.path === "");
      const tabs = parentValues.map(item => {
        return(
        <Link key={item._id} to={`/projects/${item._id}`} className="tabLink">
        <div className='tabContainer'>
              <p> {item.title} </p>
              <button> + </button>
          </div>
        </Link>
        )
      });

return (
    <div >
        <div className='buttonContainer'>
              <p> Add Project </p>
              <button onClick={handleClick}> + </button>
      </div>
      <div id='mainContainer'>
          {
              state && <InputForm />
          }
      <div className="projectTab">
      {tabs}
      </div>
      </div>
    </div>
);
};

export default ProjectInput;