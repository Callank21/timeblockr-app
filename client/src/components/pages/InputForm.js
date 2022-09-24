import React from 'react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';
import { CREATE_TASK, UPDATE_TASK } from '../../utils/mutations';
import { useParams } from 'react-router-dom';

const InputForm = (props) => {

    const [createTask] = useMutation(CREATE_TASK);
    const [updateTask] = useMutation(UPDATE_TASK);
    const [errorMessage, setErrorMessage] = useState('');
    const { data } = useQuery(QUERY_ME);
    const { id: projectId } = useParams();

    const [inputState, setInputState] = useState({
        title: '',
        description: '',
        time: ''
    });

    const [done, setDone] = useState(props.done);

    useEffect(() => {
      props.edit && setInputState({
        title: props.title,
        description: props.description,
        time: props.time,
      });
  }, [data]);


    const handleChange = (event) => {
        var { name, value } = event.target;

        if (name === "time") {
          value = Number(value);
        }
        if (name === "done") {
          if (value === "false")
          value = true
          else if (value === "true")
          value = false
        }
        if (props.child && props.path === '') {
          setInputState({
            ...inputState,
            [name]: value,
            username: data.me.username,
            path: `,${props.id},`,
            totaltime: 0,
          });
        }
        else if (props.edit) {
          if (name === "done") {
            setDone(!done);
          }
          setInputState({
            ...inputState,
            [name]: value,
            username: data.me.username,
            path: props.path,
            totaltime: 0,
            id: props.id,
          });
        }
        else if (props.path) {
          setInputState({
            ...inputState,
            [name]: value,
            username: data.me.username,
            path: `${props.path}${props.id},`,
            totaltime: 0,
          });
        }
        else {
          setInputState({
            ...inputState,
            [name]: value,
            username: data.me.username,
            path: '',
            totaltime: 0,
            done: done
          });
        }
      };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        
    
        const { title, description, time } = inputState;
    
        if (title === '' || description === '' || time === '') {
          setErrorMessage('Valid input required');
        } else {
          try {
            await createTask({
              variables: { ...inputState},
            });
          } catch (e) {
            console.error(e);
          }
    
          setInputState({
            title: '',
            description: '',
            time: ''
          });
    
          window.location.assign(`/projects/${projectId}`);
        }
      };

    const handleEditForm = async (event) => {
      event.preventDefault();
      const { title, description, time} = inputState;
    
        if (title === '' || description === '' || time === '') {
          setErrorMessage('Valid input required');
        } else {
          try {
            await updateTask({
              variables: { ...inputState},
            });
          } catch (e) {
            console.error(e);
          }
    
          setInputState({
            title: '',
            description: '',
            time: ''
          });
    
          window.location.assign(`/projects/${projectId}`);
        }
    };

    return (
        <div className="formContainer">
          <form className='inputContainer' onSubmit={props.edit ? (handleEditForm) :(handleFormSubmit)}>
            {props.edit ? (
              <p>Edit</p>
            ) : (
              <p>Add Task </p>
            )}
            <div>
            {done ? (
              <button className="doneOn" name="done" value={done} onClick={handleChange} type="button"></button>
            ) : (
            <button className="doneOff" name="done" value={done} onClick={handleChange} type="button"></button>
            )}
            </div>
              <input
              name="title"
              type="text"
              id="title"
              placeholder="Title"
              value={inputState.title}
              onChange={handleChange}
              />
              <textarea 
              name="description"
              type="text"
              id="description"
              placeholder="Description"
              value={inputState.description}
              onChange={handleChange}
              />
              <input
              name="time"
              type="number"
              id="time"
              placeholder="Time"
              value={inputState.time}
              onChange={handleChange}
              />
              <button>Submit</button>
          </form>
          </div>
    );
};

export default InputForm;