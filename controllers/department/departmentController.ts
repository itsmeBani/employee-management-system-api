import type {Request, Response, NextFunction} from 'express';
import {db} from "../../services/firebase.ts";

import admin from "firebase-admin";
import type {Department} from "../../model.ts";
import {getAllDocuments} from "../../utils/helper/getAllDocuments.ts";

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
    const {name}:Department= req.body;
    try {
        const docRef = db.collection('departments').doc();
        const id = docRef.id;
        const response=await docRef.set({
            id,
            name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(response)
        return res.status(201).json({
            message: "Successfully added",
            data: {
                department: name,
            }
        });

    } catch (error) {
        next(error);
    }
};


export const getAllDepartments = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const department=await getAllDocuments("departments")

        if (!department){
            return res.status(200).json({message:"No department found"});
        }
        return res.status(200).json(department);

    } catch (error) {
        next(error);
    }
};

export const getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    try {
        const departmentsRef = db.collection('departments').doc(id);
        const snapshot = await departmentsRef.get();
        if (snapshot?.exists) {
            return res.status(200).json(snapshot.data())
        }
        return res.status(404).json({message: 'Department not found'});
    } catch (error) {
        next(error);
    }
};


export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name }:Department= req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const departmentRef = db.collection('departments').doc(id);
        const snapshot = await departmentRef.get();

        if (!snapshot.exists) {
            return res.status(404).json({ message: 'Department not found' });
        }

        await departmentRef.update({
            name,
            updatedAt: new Date()
        });

        const updatedSnapshot = await departmentRef.get();
        return res.status(200).json(updatedSnapshot.data());
    } catch (error) {
        next(error);
    }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const departmentRef = db.collection('departments').doc(id);
        const snapshot = await departmentRef.get();

        if (!snapshot.exists) {
            return res.status(404).json({ message: 'Department not found' });
        }

        await departmentRef.delete();
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};