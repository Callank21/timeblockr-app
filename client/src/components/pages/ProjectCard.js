//make card that takes props from data.map in last function and write them to the page
import React from 'react';
import { useState, useEffect } from 'react';
import InputForm from '../pages/InputForm';
import NewLevel from './NewLevel';
import { DELETE_TASK, UPDATE_TASK } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProjectCard = (props) => {
    const { id: projectId } = useParams();
    const { view: views } = useParams();
    const [deleteTask] = useMutation(DELETE_TASK);
    const [updateTask] = useMutation(UPDATE_TASK);

    const [child, setChild] = useState(false);
    const [edit, setEdit] = useState(false);
    const [done, setDone] = useState(props.done);
    const [viewState, setViewState] = useState(false);

    useEffect(() => {
      if (views) {
        setViewState(true)
      }
    })
 
    const childClick = () => {
        if(edit === true) {
            setEdit(false);
        }
        setChild(!child);
      };

      const editClick = () => {
        if(child === true) {
            setChild(false);
        }
        setEdit(!edit);
      };

      const deleteClick = async () => {
        try {
            await deleteTask({
              variables: { id: props._id },
            });
          } catch (e) {
            console.error(e);
          }
          if (props.path === '') {
            window.location.assign(`/`);
          } else {
            window.location.assign(`/projects/${projectId}`);
          }
      };
        

      var descriptor = props.description.substring(0, 200);
      if (props.description.length > 200) {
        descriptor = props.description.substring(0, 200).concat('...');
      };

    return (
        <li>
        {props.tasks.length > 0 ? (
        <>
        <div id={props._id} data-path={props.path} className="tf-nc ">
          {/* <form onSubmit={handleEditForm}> */}
          {done ? (
              <button className="doneOn" type="button"></button>
            ) : 
            <button className="doneOff" type="button"></button>
            }
            {/* </form> */}
        <Link key={props._id} to={`/project/${props._id}`}>
            <div className="topCard">
                <h2>{props.title}</h2>
                <div>
                <div className="timeCard"><span>Time:</span><span>{props.time}</span></div>
                <div className="timeCard"><span>Total:</span><span>{props.totaltime}</span></div>
                </div>           
            </div>
            <div className="descCard">
            <p>{descriptor}</p>
            </div>
            </Link>
            
              {viewState ? (
                <Link key={props._id} to={`/calendar/${props._id}`}>
                <div className="addButtonContainer">
                <button>Add</button>
                </div>
                </Link>
              ) : (
            <div className="crudContainer">
            <button onClick={childClick}>Create Child</button>
            <button onClick={editClick}>Edit</button>
            <button onClick={deleteClick}>Delete</button>
            </div>
              )}
            {child && <InputForm 
        key={props._id}
        path={props.path}
        id={props._id}
        child={true}
        done={props.done}
        />} 
        {edit && <InputForm 
        key={props._id}
        path={props.path}
        id={props._id}
        edit={true}
        title={props.title}
        description={props.description}
        time={props.time}
        done={props.done}
        />}
        </div>
        {<NewLevel
        {...props}
        />}
        </>
            ) : (  
        <div id={props._id} data-path={props.path} className="tf-nc">
          {done ? (
              <button className="doneOn" type="button"></button>
            ) : 
            <button className="doneOff" type="button"></button>
            }
            {viewState ? (
              <div>
            <div className="topCard">
                <h2>{props.title}</h2>
                <div>
                <div className="timeCard"><span>Time:</span><span>{props.time}</span></div>
                <div className="timeCard"><span>Total:</span><span>{props.totaltime}</span></div>
                </div>           
            </div>
            <div className="descCard">
            <p>{descriptor}</p>
            </div>
            </div>) : (
              <Link key={props._id} to={`/project/${props._id}`}> 
                <div className="topCard">
                <h2>{props.title}</h2>
                <div>
                <div className="timeCard"><span>Time:</span><span>{props.time}</span></div>
                <div className="timeCard"><span>Total:</span><span>{props.totaltime}</span></div>
                </div>           
            </div>
            <div className="descCard">
            <p>{descriptor}</p>
            </div>
              </Link>
            )}
            {viewState ? (
              <Link key={props._id} to={`/calendar/${props._id}`}>
                <div className="addButtonContainer">
                <button>Add</button>
                </div>
                </Link>
              ) : (
            <div className="crudContainer">
            <button onClick={childClick}>Create Child</button>
            <button onClick={editClick}>Edit</button>
            <button onClick={deleteClick}>Delete</button>
            </div>
              )}
            {child ? ( <InputForm 
        key={props._id}
        path={props.path}
        id={props._id}
        child={true}
        done={props.done}
        />) :
        (edit && <InputForm 
        key={props._id}
        path={props.path}
        id={props._id}
        edit={true}
        title={props.title}
        description={props.description}
        time={props.time}
        done={props.done}
        />)}
        </div>
    )}
    </li>
    );
};

export default ProjectCard;