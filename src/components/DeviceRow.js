import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default function DeviceRow({device, onConnect}) {
  return (
    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between'}}>
      <View>
        <Text style={{fontWeight: '600'}}>{device.name || 'Unknown'}</Text>
        <Text style={{color: '#666'}}>{device.id}</Text>
      </View>
      <TouchableOpacity onPress={onConnect} style={{alignSelf: 'center', padding: 8, backgroundColor: '#0b5ed7', borderRadius: 6}}>
        <Text style={{color: 'white'}}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}
