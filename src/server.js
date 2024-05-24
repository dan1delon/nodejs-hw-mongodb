import express from 'express';
import { PORT } from './constants/constants';

const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
