import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid, GridColDef, GridRowModesModel, GridRowModes, GridActionsCellItem, GridRowId, GridRowModel, GridToolbarContainer, GridSlots } from '@mui/x-data-grid';
import { fetchEmployees, saveEmployee, updateEmployee, Employee, deleteEmployee } from '../Services/employeeService';


const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    // Fetch employees from API automaitcaly as this is the main usage
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data: Employee[] = await fetchEmployees();
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            } finally {
                setLoading(false);
            }
        };

        loadEmployees();
    }, []);

    interface EditToolBarProps{
        setEmployees: (newRows: (oldRows: Employee[]) => Employee[]) => void;
        setRowModesModel:( newModel: (oldModel : GridRowModesModel) =>  GridRowModesModel) => void;
    }

    function EditToolbar(props: EditToolBarProps){
        const {setEmployees, setRowModesModel: setRowsModesModel} = props

        //add record click
        const handleClick = () => {
            //handling the creating of the Id here
            const id = Math.max(...employees.map(emp => emp.id )) + 1;
            setEmployees((oldRows) => [
                ...oldRows,
                {id, name: '', value: 0, isNew: true}
            ]);
            setRowsModesModel((oldModel) => ({
                ...oldModel,
                [id]: {mode: GridRowModes.Edit, fieldToFocus: 'name'},
            }) );
        };
        
        return (
            <GridToolbarContainer>
              <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
              </Button>
            </GridToolbarContainer>
          );
    }
    const processRowUpdate = async (newRow: GridRowModel) => {
        //creating the placeholder Employee object
        const updatedRow: Employee = {
            id: (newRow as Employee).id as number,         
            name: (newRow as Employee).name as string,    
            value: (newRow as Employee).value as number,   
            isNew: false                     
        };

        // setting employee row state based on if is new and if the employee can be saved
        try{
            if((newRow as Employee).isNew){
                const savedEmployee : Employee = await saveEmployee(updatedRow);

                setEmployees((prevEmployees) => prevEmployees.map((employee) => 
                    employee.id === updatedRow.id ? savedEmployee : employee)) 
            }
            // if the user is not new but process row is called we know to update the user so call put
            else{
                const updatedEmployee : Employee = await updateEmployee(updatedRow)
                setEmployees((prevEmployees) =>
                    prevEmployees.map((employee) =>
                        employee.id === updatedRow.id ? updatedEmployee : employee
                    )
                );
            } 
        }
        catch(e){
            console.error(console.log("Erorr svaing", e))
        }

        return updatedRow;
      };


    
    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };


    const handleSaveClick  = async (id: GridRowId)  => {
        setRowModesModel((prev) => ({
            ...prev,
            [id]: { mode: GridRowModes.View } 
        }));

        // need to get the updated rows values before processing the row as we are passed empty values, where IsNew = true by default
        const foundEmployee = employees.find((emp) => emp.id === id);

        if(foundEmployee){
            try{
                await processRowUpdate(foundEmployee);
            } 
            catch(e){
                console.error("Error saving", e);
            }
        }
        
    };

    

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };

    const handleDeleteClick = async (id: GridRowId)  => {
        try{
            await deleteEmployee(id as number);
        
        setEmployees(employees.filter((employee) => employee.id !== id));
        }
        catch(e){
            console.error("Error deleting employee:", e);
        }
    };

 

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        { field: 'value', headerName: 'Value', type: 'number', width: 110, editable: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => handleSaveClick(id)} />,
                        <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={handleCancelClick(id)} />,
                    ];
                }

                return [
                    <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />,
                    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(id)} />,
                ];
            },
        },
    ];

    if (loading) {
        return <div>Loading Employees...</div>;
    }

    return (
        <Container>
            <h1 >Employee List</h1>
            <Box sx={{  width: '100%' }}>
                <DataGrid
                    rows={employees}
                    columns={columns}       
                    editMode="row"
                    rowModesModel={rowModesModel}

                    onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar as GridSlots['toolbar'],
                      }}
                      slotProps={{
                        toolbar: { setEmployees, setRowModesModel },
                      }}
                      
                    
                />
            </Box>
        </Container>
    );
};

export default EmployeeList;