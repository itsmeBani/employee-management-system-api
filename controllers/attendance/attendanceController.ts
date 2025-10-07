import type { Request, Response, NextFunction } from 'express';
import {findEmployeeByCustomId} from "../../utils/helper/findEmployeeByCustomId.ts"
import admin from "firebase-admin";
import type {Employee} from "../../model.ts";


export const timeIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId }:Employee = req.body;

        if (!employeeId) {
            return res.status(400).json({ message: 'employeeId is required.' });
        }

        const employeeDoc = await findEmployeeByCustomId(employeeId);

        if (!employeeDoc) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        const attendanceRef = employeeDoc.ref.collection('attendance');

        await attendanceRef.add({
            type: 'time-in',
            timestamp: admin.firestore.Timestamp.now(),
            location: 'BGC, Taguig City Office'
        });

        return res.status(201).json({
            message: `Time-in recorded for employee ${employeeId}.`
        });

    } catch (error) {
        next(error);
    }
};


export const timeOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId }:Employee = req.body;

        if (!employeeId) {
            return res.status(400).json({ message: 'employeeId is required.' });
        }

        const employeeDoc = await findEmployeeByCustomId(employeeId);

        if (!employeeDoc) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        const attendanceRef = employeeDoc.ref.collection('attendance');

        await attendanceRef.add({
            type: 'time-out',
            timestamp: admin.firestore.Timestamp.now(),
            location: 'BGC, Taguig City Office'
        });

        return res.status(201).json({
            message: `Time-out recorded for employee ${employeeId}.`
        });

    } catch (error) {
        next(error);
    }
};


export const getAttendanceRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(400).json({ message: 'employeeId is required.' });
        }

        const employeeDoc = await findEmployeeByCustomId(employeeId);

        if (!employeeDoc) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        const attendanceSnapshot = await employeeDoc.ref
            .collection('attendance')
            .orderBy('timestamp', 'desc')
            .get();

        const records = attendanceSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.status(200).json({
            employeeId,
            attendanceCount: records.length,
            records
        });

    } catch (error) {
        next(error);
    }
};