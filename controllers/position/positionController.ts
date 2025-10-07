import { Request, Response, NextFunction } from 'express';
import { db } from '../../services/firebase';
import admin from 'firebase-admin';
import {Position} from "../../model.ts";


export const createPosition = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, departmentId }:Position = req.body;

        if (!title || !departmentId) {
            return res.status(400).json({ message: 'Title and departmentId are required.' });
        }

        const newPosition = {
            title,
            departmentId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection('positions').add(newPosition);


        res.status(201).json({ id: docRef.id, ...newPosition });
    } catch (error) {
        next(error);
    }
};


export const getAllPositions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const snapshot = await db.collection('positions').get();

        if (snapshot.empty) {
            return res.status(200).json([]);
        }

        const positions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(positions);
    } catch (error) {
        next(error);
    }
};


export const getPositionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const docRef = db.collection('positions').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Position not found.' });
        }

        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        next(error);
    }
};


export const updatePosition = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, departmentId }:Position= req.body;

        if (!title && !departmentId) {
            return res.status(400).json({ message: 'At least one field (title or departmentId) must be provided.' });
        }

        const docRef = db.collection('positions').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Position not found.' });
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (departmentId) updateData.departmentId = departmentId;
        updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

        await docRef.update(updateData);

        res.status(200).json({ id, ...updateData });
    } catch (error) {
        next(error);
    }
};

// Delete a position
export const deletePosition = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const docRef = db.collection('positions').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Position not found.' });
        }

        await docRef.delete();
        res.status(204).send(); // No Content
    } catch (error) {
        next(error);
    }
};
