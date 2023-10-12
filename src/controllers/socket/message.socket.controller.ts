import {Socket, socketio} from '@loopback/socketio';
import debugFactory from 'debug';
// import {service} from '@loopback/core';
// import TurnServer from '../services/turnServer.service';
import {createUuid, UuidNamespaces} from '@services/core';

const debug = debugFactory('loopback:socketio:controller');

@socketio('/notification')
export class NotificationSocketIoController {
  constructor(
    @socketio.socket() // Equivalent to `@inject('ws.socket')`
    private socket: Socket,
  ) {}

  /**
   * The method is invoked when a client connects to the server
   *
   * @param socket - The socket object for client
   */
  @socketio.connect()
  async connect(socket: Socket) {
    debug('Client connected: %s', this.socket.id);

    console.log('connected to streaming socket');

    console.log(socket.handshake.query.username);

    const username = socket.handshake.query.username as string;

    const roomId = createUuid(UuidNamespaces.SOCKET, username);

    return socket.join(`${roomId}`);
  }

  /**
   * Register a handler for alowing to request turn server for webcam stream
   *
   * @param username - user that wants to stream
   */
  @socketio.subscribe('request-turn-server')
  async requestTrunServer() {
    // debug('Client requests tunr server for: %s', this.socket.handshake.auth.);
    // const turnServer = await this.turnServer.createServer(username);
    // turnServer.start();
    // const turnServerInfo = {
    //   port: turnServer.listeningPort,
    // };
  }
  /**
   * Register a handler for all events
   */
  @socketio.subscribe('message')
  mesage(...args: unknown[]) {
    console.log('username:', args);
    debug('Message: %s', args);
  }

  /**
   * Register a handler for all events
   */
  @socketio.subscribe(/.+/)
  logMessage(...args: unknown[]) {
    console.log('message:', args);
    debug('Message: %s', args);
  }

  /**
   * The method is invoked when a client disconnects from the server
   * @param socket
   */
  @socketio.disconnect()
  disconnect() {
    console.log('test');
    debug('Client disconnected: %s', this.socket.id);
  }
}
