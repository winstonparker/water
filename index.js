import { createVoltageReader } from './src/modules/VoltageReader.mjs';

async function main() {
    try {
        const voltageReader = await createVoltageReader();

        while(true){
            const voltage0 = await voltageReader.read(0);
            console.log(`Read voltage: ${voltage0}`);
        }
        
      } catch (error) {
        console.error('Error while reading voltages:', error);
      }
}

main();
