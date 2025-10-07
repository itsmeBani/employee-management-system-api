import { Router } from 'express';

const router = Router();
import * as employeeController from '../controllers/employee/employeeController.ts';
import * as attendanceController from '../controllers/attendance/attendanceController.ts';

router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id',employeeController.deleteEmployee);

// Route to get attendance for a specific employee
router.get('/:employeeId/attendance', attendanceController.getAttendanceRecords);

export default router;
