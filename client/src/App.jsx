import { useEffect , useState} from 'react';
import axios from "axios";

import './App.css'
const API_URL = "http://localhost:5001/students";

function App() {
  const [students, setStudents]= useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);


  const fetchStudents = ()=>{
    axios
      .get(API_URL)
      .then((response)=>{
        setStudents(response.data);
      })
      .catch((error)=>{
        console.log("Error loading")
      })
  }

  useEffect(() => {
     fetchStudents()
  }, []);

  const resetForm = ()=>{
    setName(""),
    setCourse(""),
    setAge(""),
    setEditingId(null);
  }

  const handleSubmit = async()=>{
    

    const studentData = {
      name: name,
      course: course,
      age: Number(age)};

    try{
      if(editingId == null){
        await axios.post(API_URL, studentData);
      }else{
        await axios.put(`${API_URL}/${editingId}`, studentData);
      }
      resetForm();
      fetchStudents();
    }catch(error){
      console.log("error saving student", error);
    }

  }

  const handleEdit =(student)=>{
    setName(student.name),
    setCourse(student.course),
    setAge(student.age),
    setEditingId(student._id)
  }

  const handleDelete =async (id) =>{
    try{
      await axios.delete(`${API_URL}/${id}`);
      if(id == editingId){
        resetForm();
      }
      fetchStudents();
    }catch(error){
      console.log("Error deleting",error);
    }

  }
  
  return(

    <div>
      <h1>Student Management System</h1>
      <h2>{editingId == null? "Add Student" : "Edit Student"}</h2>

      <input placeholder="Name" value={name} onChange={(event)=> setName(event.target.value)}  /> <br/>
      <input placeholder="Course" value={course} onChange={(event)=> setCourse(event.target.value)}  /> <br/>
      <input placeholder="Age" value={age} onChange={(event)=> setAge(event.target.value)}  /> <br/>
      
      <button onClick={handleSubmit}>{editingId == null? "Add Student" : "Update Student"}</button>
      {editingId !== null &&(
        <button onClick={resetForm}>Cancel</button>
      )}

      <hr/>

      <h2>Student List</h2>
      {students.length == 0 && <p>No Students Yet.</p>}

      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
          <button onClick={()=> handleEdit(student)}>Edit</button>
          <button onClick={()=> handleDelete(student._id)}>Delete</button>
          </div>
      ))}
      {/* <h2>Add Student</h2>
      <input placeholder="Name"/>
      <br/>

      <input placeholder='Course'/>
      <br/>

      <input placeholder='Age'/>
      <br/>

      <button>Add Student</button>

      <h2>Students</h2>
      <p>No students yet.</p> */}
      
    </div>
  )
}

export default App
