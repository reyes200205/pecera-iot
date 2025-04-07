import { Server, Socket } from "socket.io";

const connectedUsers = new Map<string, string>();

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Usuario conectado: ${socket.id}`);

    socket.on("userConnected", (userId: string | number) => {
      const userIdStr = userId.toString();
      connectedUsers.set(userIdStr, socket.id);
      console.log(`✅ Usuario ${userIdStr} conectado con socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket desconectado: ${socket.id}`);
      for (let [userId, sId] of connectedUsers.entries()) {
        if (sId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
};

export const emitAlertToUser = (io: Server, userId: string, alerta: any) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("nuevaAlerta", alerta);
    console.log(`🚨 Alerta enviada a ${userId}`, alerta);
  } else {
    console.log(`⚠️ Usuario ${userId} no está conectado.`);
  }
};
