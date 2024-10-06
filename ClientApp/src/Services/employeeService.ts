export interface Employee {
    id: number;
    name: string;
    value: number;
    isNew?: boolean;
}

// exporting the CRUD operators

export const fetchEmployees = async (): Promise<Employee[]> => {  
    const response = await fetch('http://localhost:5000/employees');
    if (!response.ok) {
        throw new Error('Failed to fetch employees');
    }
    return await response.json();  
};

export const saveEmployee = async (employee: Employee): Promise<Employee> => {
    const response = await fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    });

    if (!response.ok) {
        throw new Error('Failed to save employee');
    }

    const result = await response.json();
    return result.employee; 
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
    const response = await fetch(`http://localhost:5000/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    });

    if (!response.ok) {
        throw new Error('Failed to update employee');
    }

    const result = await response.json();
    return result.employee; 
};

export const deleteEmployee = async (id: number): Promise<void> => {
    const response = await fetch(`http://localhost:5000/employees/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete employee');
    }
};