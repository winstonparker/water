// Filename: getPiSerial.mjs
import { promises as fs } from 'fs';

const getCpuInfoPath = () => '/proc/cpuinfo';

/**
 * Fetches the serial number of the Raspberry Pi from /proc/cpuinfo.
 * @returns {Promise<string|null>} A promise that resolves to the serial number, or null if not found.
 */
export const getRaspberryPiSerial = async () => {
  try {
    const data = await fs.readFile(getCpuInfoPath(), 'utf8');
    const lines = data.split('\n');
    const serialLine = lines.find(line => line.includes('Serial'));

    if (serialLine) {
      const serial = serialLine.split(':')[1].trim();
      return serial;
    } else {
      console.log('Serial number not found.');
      return null;
    }
  } catch (err) {
    console.error('Failed to read /proc/cpuinfo:', err);
    return null;
  }
};
