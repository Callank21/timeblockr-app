//make card that takes props from data.map in last function and write them to the page
import React from 'react';
import { useState } from 'react';
import InputForm from '../pages/InputForm';
import NewLevel from './NewLevel';
import { DELETE_TASK } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProjectCard = (props) => {
    const { id: projectId } = useParams();
    const [deleteTask] = useMutation(DELETE_TASK);

    const [child, setChild] = useState(false);
    const [edit, setEdit] = useState(false);
    const [deleter, setDelete] = useState(false);

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

      var descriptor = props.description.substring(0, 100);
      if (props.description.length > 100) {
        descriptor = props.description.substring(0, 100).concat('...');
      }

    return (
        <li>
        {props.tasks.length > 0 ? (
        <>
        <Link key={props._id} to={`/project/${props._id}`}>
        <div id={props._id} data-path={props.path} className="tf-nc ">
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
            <div className="crudContainer">
            <button onClick={childClick}>Create Child</button>
            <button onClick={editClick}>Edit</button>
            <button onClick={deleteClick}>Delete</button>
            </div>
            {child && <InputForm 
        key={props._id}
        path={props.path}
        id={props._id}
        child={true}
        />} 
        {edit && <InputForm 
        key={props._id}
        path={props.path}
        id={props._id}
        edit={true}
        title={props.title}
        description={props.description}
        time={props.time}
        />}
        </div>
        </Link>
        {<NewLevel
        {...props}
        />}
        </>
            ) : (
        <Link key={props._id} to={`/project/${props._id}`}>    
        <div id={props._id} data-path={props.path} className="tf-nc">
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
            <div className="crudContainer">
            <button onClick={childClick}>Create Child</button>
            <button onClick={editClick}>Edit</button>
            <button onClick={deleteClick}>Delete</button>
            </div>
            {child ? ( <InputForm 
        key={props._id}
        path={props.path}
        id={props._id}
        child={true}
        />) :
        (edit && <InputForm 
        key={props._id}
        path={props.path}
        id={props._id}
        edit={true}
        title={props.title}
        description={props.description}
        time={props.time}
        />)}
        </div>
        </Link>
    )}
    </li>
    );
};

export default ProjectCard;