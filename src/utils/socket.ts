import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket;

  constructor(url: string) {
    this.socket = io(url, {
      transports: ['websocket']
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        console.log('Connected to WS');
        resolve();
      });

      this.socket.on('connect_error', (error: Error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  on(event: string, callback: (...args: any[]) => void): void {
    console.log('kdjskagdask')
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    this.socket.off(event, callback);
  }

  emit(event: string, data?: any): void {
    console.log(event);
    this.socket.emit(event, data);
  }
}

console.log(import.meta.env.VITE_REACT_API_BASE_URL)
const socketService = new WebSocketService(import.meta.env.VITE_REACT_API_BASE_URL);

export default socketService;
