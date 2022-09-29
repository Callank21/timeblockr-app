import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { QUERY_TASK } from '../../../utils/queries';
import { useQuery } from '@apollo/client';
import RosterItem from './RosterItem';
import CalendarButtons from './CalendarButtons';
import CalendarUI from './CalendarUI';

const TaskRoster = () => {
    const { id: projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [list, setList] = useState([]);
    const { data } = useQuery(QUERY_TASK, {
      variables: { id: projectId },
  });
    useEffect(() => {
      if (localStorage.getItem('list')) {
        setList(JSON.parse(localStorage.getItem('list')));
      }
    }, []);
    
    useEffect(() => {
        data && setTasks(data.task); 
      },[]);

      var nestedTasks = tasks.map(item => {
        return ({
        ...item,
        tasks: []       
    });
   });
        for(var i = 0; i < nestedTasks.length; i++) {
          let taskData = [];
          var id = nestedTasks[i]._id;
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
          nestedTasks = nestedTasks.filter(x => x.path === "");
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

useEffect(() => {
    if (nestedTasks.length > 0) {
    localStorage.setItem('list', JSON.stringify(nestedTasks));
    setList(JSON.parse(localStorage.getItem('list')));
    }
}, [tasks]);


const cards = list.map(item => {
  const depthLevel = 0;
  return(
      <RosterItem 
      key={item._id}
      color={"rgb(255,255,255)"}
      depthLevel={depthLevel}
      {...item}
      /> 
  );
});
    return (
      <div className="calendarContainer">
        <div className="taskRosterContainer">
            <div className="rosterTop"> 
            <p>Task Roster</p>
            <Link key="view" to={`/view`}><button>+</button></Link>
            </div>
            <div className="cardRosterContainer">
            {cards}
            </div>
        </div>
        <CalendarButtons />
        <CalendarUI />
        </div>
    )
}

export default TaskRoster;