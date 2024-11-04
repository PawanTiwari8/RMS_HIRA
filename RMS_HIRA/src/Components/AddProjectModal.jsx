import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addProject, updateProject } from "../Store/projectSlice";
import { employees as mockEmployees } from "../utils/mockEmployee";


const AddProjectModal = ({ isOpen, onClose , project, isEditing}) => {
  const [projectName, setProjectName] = useState("");
  const [initialBudget, setInitialBudget] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const dispatch = useDispatch();
  
   useEffect(() => {
    if (isEditing && project) {
      setProjectName(project.name);
      setInitialBudget(project.initialBudget);
      setSelectedEmployees(project.employees);
    } else {
      resetForm();
    }
  }, [isEditing, project]);


  const resetForm = () => {
    setProjectName("");
    setInitialBudget("");
    setSelectedEmployees([]);
    onClose()
  };

  const handlehourCalculation = (index , e) => {
    let input = e;
    const validDecimal = /^$|^\d+(\.\d{0,2})?$/;
    if (validDecimal.test(input)) {
      const [hours, minutes] = input.split('.');
      if (!minutes || parseInt(minutes) <= 59) {
        handleHoursChange(index,input); 
      } else {
        alert("Minutes should not exceed 59.");
      }
    } else {
      alert("Please enter a valid hour format with up to two decimal places.");
    }
  }; 

  const handleRemoveEmployee = (index) => {
    const updatedEmployees = selectedEmployees.filter((_, i) => i !== index);
    setSelectedEmployees(updatedEmployees);
  }; 

  const handleAddEmployee = () => {
    setSelectedEmployees([...selectedEmployees, { id: "", hoursWorked: "" }]);
  };

  const handleEmployeeSelection = (index, employeeId) => {
    const employee = mockEmployees.find((emp) => emp.id === parseInt(employeeId));
    const updatedEmployees = selectedEmployees.map((emp, i) =>
      i === index ? { ...employee, hoursWorked: emp.hoursWorked || "" } : emp
    );
    setSelectedEmployees(updatedEmployees);
  };

  const handleHoursChange = (index, hours) => {
    const updatedEmployees = selectedEmployees.map((emp, i) =>
      i === index ? { ...emp, hoursWorked: hours } : emp
    );
    setSelectedEmployees(updatedEmployees);
  };

  const calculateRevenue = (initialBudget, selectedEmployees) => {
   
    const totalExpenditure = selectedEmployees.reduce((total, emp) => {
      const [hours, minutes] = emp.hoursWorked.split('.');
      const hourValue = parseInt(hours || 0, 10);
      const minuteValue = parseInt(minutes || 0, 10);
      const hoursWorked = (hourValue * 60) + minuteValue ; 
      const totalHoursWorked = parseFloat((emp.salaryRate * hoursWorked)/60);
      return total + totalHoursWorked;
    }, 0);
    
    return parseFloat(initialBudget) - totalExpenditure;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: isEditing ? project.id : Date.now(),
      name: projectName,
      initialBudget: parseFloat(initialBudget),
      employees: selectedEmployees.map((emp) => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        salaryRate: emp.salaryRate,
        hoursWorked: parseFloat(emp.hoursWorked),
      })),
      revenue: calculateRevenue(initialBudget, selectedEmployees),
    };
    
    if (isEditing) {
      dispatch(updateProject(newProject));
    } else {
      dispatch(addProject(newProject));
    }
    resetForm();
  };

  return isOpen ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#00000099] flex items-center justify-center">
      <div className="bg-white p-4 w-[400px] max-h-[80%] overflow-y-auto rounded-lg">
        <div className=" font-bold mb-4">{isEditing ? "Edit Project" : "Add New Project"}</div>
        <form onSubmit={handleSubmit}>
        <div class="relative z-0 w-full mb-5 group">
        <input 
         type="text" 
         name="Project_Name" 
         id="Project_Name" 
         className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
         placeholder=" " 
         required 
         value={projectName}
         onChange={(e) => setProjectName(e.target.value)}
         />
        <label for="Project_Name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Project Name</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
        <input 
         type="number" 
         name="Initial_Budget" 
         id="Initial_Budget" 
         className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
         placeholder=" " 
         required 
         value={initialBudget}
         onChange={(e) => setInitialBudget(e.target.value)}
         />
        <label for="Initial_Budget"  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Initial Budget</label>
        </div>
          <div className="font-bold mb-4">Employees list</div>
          {selectedEmployees.map((emp, index) => (
            <div key={index}>
              <label>
                <select
                  value={emp.id}
                  onChange={(e) => handleEmployeeSelection(index, e.target.value)}
                  className="mb-3"
                  required
                >
                  <option value="" >Select an employee</option>
                  {mockEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.role} (₹{employee.salaryRate}/hr)
                    </option>
                  ))}
                </select>
              </label>
              <button 
                type="button" 
                onClick={() => handleRemoveEmployee(index)} 
                className="pl-4"
              >
                 <svg class="h-4 w-4  border-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button> 

             
        <div class="relative z-0 w-full mb-5 group">
        <input 
         type="number" 
         name="Initial_Budget" 
         id="Initial_Budget" 
         className="mt-2 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
         placeholder=" " 
         required
         value={emp.hoursWorked}
         onChange={(e) => handlehourCalculation(index, e.target.value)}
         />
        <label for="Initial_Budget"  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Hours Worked</label>
        </div>
             
        </div>
          ))}

          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handleAddEmployee}>
            + Add Employee
          </button>
          <button type="submit" className=" w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Submit</button>
        </form>
        <button onClick={()=>(resetForm())} className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Close</button>
      </div>
    </div>
  ) : null;
};

export default AddProjectModal;