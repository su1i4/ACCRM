import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

function getSocket() {
  if (!socket) {
    socket = io("wss://alfacrm.kg", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
      query: {
        token: localStorage.getItem("access_token"),
      },
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("connect", () => {});

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  return socket;
}

export const liveProvider = {
  subscribe: ({ channel, types, callback, meta }: any) => {
    const socket = getSocket();

    socket.emit("message", { channel });

    socket.on(channel, (data: any) => {
      callback(data);
    });

    return {
      unsubscribe: () => {
        socket.emit("unsubscribe", { channel });
        socket.off(channel);
      },
    };
  },

  unsubscribe: (subscription: any) => {
    if (subscription && subscription.unsubscribe) {
      subscription.unsubscribe();
    }
  },

  publish: ({ channel, type, payload, date, meta }: any) => {
    const socket = getSocket();

    socket.emit("message", { channel, type, payload, date, meta });

    socket.once("publish_success", () => {});

    socket.once("publish_error", (error: any) => {});
  },
};
