import { createVoltageReader } from './src/modules/VoltageReader.mjs';
import { createNewDocument } from './src/modules/Firebase.mjs';
import { getRaspberryPiSerial } from './src/modules/device.mjs';
import { getEnvironmentData, initSensor } from './src/modules/DHT.mjs';

import cron from 'node-cron';

let voltageReader = null;
let deviceId = null;

async function setup() {
  try {
      await initSensor(4);
      voltageReader = await createVoltageReader();
      deviceId = await getRaspberryPiSerial();
    } catch (error) {
      console.error('Error while setting up voltage reader:', error);
    }
}

async function main() {
    try {
        
        if(!voltageReader){
          await setup();
        }

        let readers = 1;
        for(let i = 0; i < readers; i += 1){
          const voltage = await voltageReader.read(i);
          console.log(`Read voltage: ${voltage} - Reader ${i}`);
          await createNewDocument( `/sensors/moisture/sensor-${i}`, {"mv": voltage, "deviceId": deviceId })
        }

        const environmentData = await getEnvironmentData(4);
        console.log(`Read environment data - Temp: ${environmentData.temperature}, Humidity: ${environmentData.humidity}`);
        await createNewDocument( `/sensors/environment/sensor-4`, {"temperature": environmentData.temperature, "humidity": environmentData.humidity, "deviceId": deviceId })

      } catch (error) {
        console.error('Error while reading voltages:', error);
      }
}

cron.schedule('* * * * * *', () => {
  main();
});