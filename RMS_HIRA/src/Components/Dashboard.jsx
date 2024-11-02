
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProject } from "../Store/projectSlice";
import AddProjectModal from "./AddProjectModal";
import { employees as mockEmployees } from "../utils/mockEmployee";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const totalRevenue = projects.reduce((total, project) => {
    return total + project.revenue;
  }, 0);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const handleEdit = (project) => {
    setProjectToEdit(project); 
    setIsModalOpen(true); 
  }; 

  const handleDelete = (projectId) => {
    dispatch(deleteProject(projectId));
  };

   const handleCloseModal = () => {
    setIsModalOpen(false);
    setProjectToEdit(null);
  };
  

  return (
  <div className="">
  <div>
    <div className="flex justify-center gap-4 md:flex-row">
       <div>
       <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
       <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{projects.length}</h5>
       <p className="font-normal text-gray-700 dark:text-gray-400">Total Ongoing Projects</p>
       </a>
       </div>
       <div>
       <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
       <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{totalRevenue}</h5>
       <p className="font-normal text-gray-700 dark:text-gray-400">Total Revenue </p>
       </a>
       </div>
       <div>
       <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
       <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{mockEmployees.length}</h5>
       <p className="font-normal text-gray-700 dark:text-gray-400">Total Employees</p>
       </a>
       </div>
    </div>
  </div>
  <div className="text-center text-3xl w-full mt-4">Project Dashboard</div> 
  <div className="text-center">
        <button type="button" className=" w-3/12 mt-4 self-start bg-blue-400  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openModal}>
         + Add Project
        </button>
        </div> 
  <div className="flex flex-wrap gap-2"> 
    {projects.map((project) => (
    <div className=" my-2 max-w-96 flex flex-col bg-gray-200 shadow rounded-lg" key={project.id}>
    <div className="p-4 flex flex-col justify-between">
      <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
      <div className="">
        <div>
          <p className="text-gray-600 mt-2 font-semibold">Initial Budget : {project.initialBudget}</p>
          <p className="text-gray-600 mt-2 font-semibold">Revenue : {project.revenue}</p>
        </div>
        <div className="my-2">Employee Detail :</div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-blue-600 dark:border-gray-700 dark:hover:bg-blue-700">
         {project.employees.map((emp) => (
          <div className="flex space-x-2 text-white border-blue-200 border-2 p-2 rounded-md m-2" key={emp.id}>
          <div>Name: {emp.name}</div>
          <div className="">Role: {emp.role}</div>
          <div>Salary Rate: {emp.salaryRate}</div>
          <div>Hours Worked: {emp.hoursWorked}</div>
        </div>
        ))}
       </div>
      </div>
      <button onClick={()=>(handleEdit(project))} className="mt-4 self-start bg-green-600 w-full hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Edit
      </button>
      <button onClick={()=>(handleDelete(project.id))} className="mt-4 self-start bg-red-600 w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Delete
      </button>
    </div>
  </div>
))}
</div>
      {setProjectToEdit?<AddProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={projectToEdit} 
        isEditing={Boolean(projectToEdit)} 
      />: <AddProjectModal isOpen={isModalOpen} onClose={closeModal} />}
</div>
);
};

export default Dashboard;
