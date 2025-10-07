import express from "express"

import employeeRoutes from './routes/employeeRoutes.ts';
import attendanceRoutes from './routes/attendanceRoutes.ts';
import departmentRoutes from './routes/departmentRoutes.ts';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/employees', employeeRoutes);
app.use('/department', departmentRoutes);
app.use('/attendance', attendanceRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
