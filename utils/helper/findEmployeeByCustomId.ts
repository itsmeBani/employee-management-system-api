import {db} from "../../services/firebase.ts";

export const findEmployeeByCustomId = async (employeeId: string) => {

    const employeeQuery = await db.collection('employees').where('employeeId', '==', employeeId).limit(1).get();
    if (employeeQuery.empty) {
        return null;
    }
    return employeeQuery.docs[0];
};
