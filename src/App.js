import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View, FlatList, TouchableOpacity, TextInput, Alert} from 'react-native';
import BluetoothService from './services/BluetoothService';
import DeviceRow from './components/DeviceRow';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [message, setMessage] = useState('Hello from RN');

  useEffect(() => {
    BluetoothService.init();
    const sub = BluetoothService.onDeviceDiscovered(d => {
      setDevices(prev => {
        const exists = prev.find(x => x.id === d.id);
        if (exists) return prev.map(x => (x.id === d.id ? d : x));
        return [...prev, d];
      });
    });

    return () => {
      sub.remove();
      BluetoothService.destroy();
    };
  }, []);

  const startScan = async () => {
    setDevices([]);
    try {
      await BluetoothService.startScan();
    } catch (e) {
      Alert.alert('Scan error', e.message || String(e));
    }
  };

  const connect = async device => {
    try {
      const d = await BluetoothService.connectToDevice(device.id);
      setConnectedDevice(d);
    } catch (e) {
      Alert.alert('Connect error', e.message || String(e));
    }
  };

  const disconnect = async () => {
    await BluetoothService.disconnect();
    setConnectedDevice(null);
  };

  const send = async () => {
    if (!connectedDevice) return Alert.alert('Not connected');
    try {
      await BluetoothService.sendText(message);
      Alert.alert('Sent', 'Message sent');
    } catch (e) {
      Alert.alert('Send error', e.message || String(e));
    }
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 16}}>
      <View style={{marginBottom: 12}}>
        <Text style={{fontSize: 22, fontWeight: '700'}}>React Native Bluetooth (BLE)</Text>
        <Text style={{color: '#666', marginTop: 4}}>Scan, connect, and send text (BLE).</Text>
      </View>

      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <TouchableOpacity onPress={startScan} style={{padding: 12, backgroundColor: '#007bff', borderRadius: 8, marginRight: 8}}>
          <Text style={{color: 'white'}}>Scan</Text>
        </TouchableOpacity>
        {connectedDevice ? (
          <TouchableOpacity onPress={disconnect} style={{padding: 12, backgroundColor: '#dc3545', borderRadius: 8}}>
            <Text style={{color: 'white'}}>Disconnect</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({item}) => <DeviceRow device={item} onConnect={() => connect(item)} />}
        ListEmptyComponent={() => <Text>No devices yet — press Scan</Text>}
      />

      <View style={{marginTop: 12}}>
        <TextInput value={message} onChangeText={setMessage} style={{borderWidth: 1, padding: 8, borderRadius: 6}} />
        <TouchableOpacity onPress={send} style={{padding: 12, backgroundColor: '#28a745', borderRadius: 8, marginTop: 8}}>
          <Text style={{color: 'white'}}>Send Text</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
