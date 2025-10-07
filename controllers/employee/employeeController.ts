
import type { Request, Response, NextFunction } from 'express';

import { db } from '../../services/firebase.ts';

import {generateEmployeeId} from "../../utils/helper/generateEmployeeId.ts";
import admin from "firebase-admin";
import type { Employee } from "../../model.ts";



export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {



    try {
         const { firstName, lastName, email, positionId, departmentId }:Employee = req.body;
        if (!firstName || !lastName || !email || !positionId || !departmentId) {
            return res.status(400).json({ message: 'Missing required employee fields.' });
        }

        const employeeId = await generateEmployeeId();

        const newEmployee: Employee = {
            employeeId,
            firstName,
            lastName,
            email,
            positionId,
            departmentId,
            hireDate: admin.firestore.Timestamp.now(),
            isActive: true,
            createdAt: admin.firestore.Timestamp.now(),
        };

        const docRef = await db.collection('employees').add(newEmployee);
        console.log(docRef)
        res.status(201).json(newEmployee);

    } catch (error) {
        next(error);
    }
};

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
            const snapshot = await db.collection('employees').where('isActive', '==', true).get();
            if (snapshot.empty) {
                return res.status(200).json({message:"Employees not found"});
            }

            const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

export const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const docRef = db.collection('employees').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        next(error);
    }
};


export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, positionId, departmentId } = req.body;

        const docRef = db.collection('employees').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        if (!firstName || !lastName || !email || !positionId || !departmentId) {
            return res.status(400).json({ message: 'Missing required employee fields.' });
        }
        const updateData = {
            updatedAt: admin.firestore.Timestamp.now(),
            firstName:firstName,
            lastName:lastName,
            email:email,
            positionId:positionId,
            departmentId:departmentId
        };

        await docRef.update(updateData);

        res.status(200).json({ message:"successfully updated", data:updateData });
    } catch (error) {
        next(error);
    }
};


export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const docRef = db.collection('employees').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        await docRef.update({
            isActive: false,
            updatedAt: admin.firestore.Timestamp.now(),
        });

        res.status(200).json({ message: 'Employee deactivated successfully.' });
    } catch (error) {
        next(error);
    }
};