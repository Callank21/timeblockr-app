import React from 'react';
import ProjectCard from './ProjectCard';
import { useQuery } from '@apollo/client';
import { QUERY_TASK } from '../../utils/queries';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const Projects = () => {
    const { id: projectId } = useParams();

    // make data call for tasks for specific user here
    const { data } = useQuery(QUERY_TASK, {
        variables: { id: projectId },
    });

    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        data && setTasks(data.task);
    }, [data]);
     const nestedTasks = tasks.map(item => {
            return ({
            ...item,
            tasks: []       
        });
       });
       
            var parentValues = nestedTasks.filter(x => x.path === "");
            for(var i = 0; i < parentValues.length; i++) {
              let taskData = [];
              var id = parentValues[i]._id;
              var children = returnAllChildren(id);
              if (children) {
              children.forEach(x => taskData.push(x));
              let idQue = taskData.map(item => item.path.split(',').filter(item => item)).sort().reverse().map(x => x.pop());
                let noDup = idQue.slice().sort(function(a,b){return a > b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);
                let objectQue = [];
                noDup.map(x => returnChildren(x)).forEach(x => x.forEach(y => objectQue.push(y)));
                objectQue = objectQue.map(x => x._id);
              for(let j = 0; j < idQue.length; j++) {
                var output1 = nestedTasks.filter(item => item._id.toString() === idQue[j])[0];
                var output2 = nestedTasks.filter(item => item._id.toString() === objectQue[j])[0];
                output1.tasks.push(output2);
              }

              parentValues = nestedTasks.filter(x => x.path === "");
            };
        }
    function returnAllChildren(id) { //takes the id of a task, returns an array of all children of that task
        let regex = new RegExp(`,${id},`);
        var paths = tasks.filter(({path}) => path.match(regex));
        if (paths.length === 0) {
            return null;
        }
        return paths;
    };

    function returnChildren(id) { //takes the id of a task, returns an array of the immediate children of that task
        let regex = new RegExp(`,${id},$`);
        var paths = tasks.filter(({path}) => path.match(regex));
        if (paths.length === 0) {
            return null;
        }
        return paths;
    };

    const cards = parentValues.map(item => {
        return(
            <ProjectCard 
            key={item._id}
            {...item}
            /> 
        );
    });
        

    return (
        <div>
            <Link to={`/`}>
            <div className='buttonContainer'>
              <p>&larr; Back </p>
      </div>
      </Link>
        <div className="projectContainer">
        <div className="tf-tree tf-custom ">
            <ul>
            {cards}
            </ul>
            </div>
            </div>
            </div>
    );
};

export default Projects;