import { app } from './app'; import { prisma } from './db';
const port=Number(process.env.PORT)||4000;const server=app.listen(port,()=>console.log(`API listening on :${port}`));process.on('SIGTERM',async()=>{server.close();await prisma.$disconnect();});
