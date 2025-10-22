import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const BluetoothScan = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);

  // Request permissions when app starts
  useEffect(() => {
    requestPermissions();
    return () => manager.destroy(); // cleanup BLE
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
    }
  };

  const startScan = () => {
    if (scanning) return;

    setDevices([]);
    setScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        setScanning(false);
        return;
      }

      if (device && !devices.some(d => d.id === device.id)) {
        setDevices(prev => [...prev, device]);
      }
    });

    // Stop scan after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Bluetooth Device Scanner</Text>

      <Button
        title={scanning ? 'Scanning...' : 'Start Scan'}
        onPress={startScan}
        disabled={scanning}
      />

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>
              {item.name ? item.name : 'Unknown Device'}
            </Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default BluetoothScan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101820',
    padding: 20,
  },
  title: {
    color: '#00C2FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  deviceItem: {
    backgroundColor: '#1E2A38',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  deviceName: {
    color: '#fff',
    fontSize: 16,
  },
  deviceId: {
    color: '#888',
    fontSize: 12,
  },
});
