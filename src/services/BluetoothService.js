import {Device, BleManager} from 'react-native-ble-plx';
import {Platform, PermissionsAndroid} from 'react-native';
import {EventEmitter} from 'events';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

const emitter = new EventEmitter();
let manager = null;
let connectedDevice = null;

const SERVICE_UUID = null; // add if you know
const WRITE_CHAR_UUID = null; // add if you know

const BluetoothService = {
  init() {
    manager = new BleManager();
    if (Platform.OS === 'android') {
      // request coarse permissions on older devices
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]).then(() => {});
    }
  },

  async startScan() {
    if (!manager) throw new Error('BLE manager not initialized');
    manager.startDeviceScan(null, {allowDuplicates: false}, (error, device) => {
      if (error) {
        console.warn('Scan error', error);
        return;
      }
      if (device) {
        emitter.emit('device', {
          id: device.id,
          name: device.name || device.localName || 'Unknown',
          device,
        });
      }
    });
    setTimeout(() => {
      try { manager.stopDeviceScan(); } catch (e) {}
    }, 12000);
  },

  onDeviceDiscovered(cb) {
    const listener = d => cb(d);
    emitter.on('device', listener);
    return { remove: () => emitter.off('device', listener) };
  },

  async connectToDevice(id) {
    if (!manager) throw new Error('BLE manager not initialized');
    const device = await manager.connectToDevice(id);
    await device.discoverAllServicesAndCharacteristics();
    connectedDevice = device;
    return {id: device.id, name: device.name || device.localName};
  },

  async disconnect() {
    if (connectedDevice && manager) {
      try {
        await manager.cancelDeviceConnection(connectedDevice.id);
      } catch (e) {}
      connectedDevice = null;
    }
  },

  async sendText(text) {
    if (!connectedDevice) throw new Error('No connected device');
    if (SERVICE_UUID && WRITE_CHAR_UUID) {
      const base64 = Buffer.from(text).toString('base64');
      await connectedDevice.writeCharacteristicWithResponseForService(SERVICE_UUID, WRITE_CHAR_UUID, base64);
      return;
    }
    const services = await connectedDevice.services();
    for (const service of services) {
      const chars = await service.characteristics();
      for (const c of chars) {
        if (c.isWritableWithResponse || c.isWritableWithoutResponse) {
          const base64 = Buffer.from(text).toString('base64');
          await connectedDevice.writeCharacteristicWithResponseForService(service.uuid, c.uuid, base64);
          return;
        }
      }
    }
    throw new Error('No writable characteristic found');
  },

  destroy() {
    try {
      if (manager) manager.destroy();
    } catch (e) {}
  }
};

export default BluetoothService;
