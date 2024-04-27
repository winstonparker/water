import { createADS1115 } from '../util/ADS1115.mjs'; // Ensure ADS1115 is also an ES module
import { sleep, getCurrentTimestamp } from '../util/time.mjs';

export default class VoltageReader {
  constructor(ads1115) {
    this.ads1115 = ads1115; // Initialize ADS1115 with default I2C address
  }

  async read(index) {
    try {
      const voltageValue = await this.ads1115.readVoltage(index);
      await sleep(1000);
      return voltageValue;
    } catch (error) {
      console.error('Error reading voltage:', error);
      throw error; // Re-throw the error for further handling if necessary
    }
  }
}

// Factory function to create an ADS1115 instance
export async function createVoltageReader() {
    const ads1115 = await createADS1115();
    return new VoltageReader(ads1115);
}