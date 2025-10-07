import {db} from "../../services/firebase.ts";

export const generateEmployeeId = async (): Promise<string> => {
    const snapshot = await db
        .collection('employees')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

    if (snapshot.empty) return 'EMP-001';

    const lastEmployee = snapshot.docs[0].data();
    const lastId = lastEmployee.employeeId;
    const num = parseInt(lastId.split('-')[1]) + 1;
    return `EMP-${num.toString().padStart(3, '0')}`;
};