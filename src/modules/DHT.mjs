import sensorLib from 'node-dht-sensor';

// Ensure the 'promises' API is utilized from the imported module
const sensor = sensorLib.promises;

/**
 * Gets DHT environment data for the given pin
 * @param {integer} pin
 */
export async function getEnvironmentData(pin) {
  try {
    const data = await sensor.read(22, pin);  // (sensor type, pin)
    data.temperature = celsiusToFahrenheit(data.temperature);
    data.humidity = parseInt(data.humidity.toFixed(0));
    return data;
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }
}

/**
 * Initialize sensor at given pin
 * @param {integer} pin
 */
export async function initSensor(pin) {
    try {
        const result = sensor.initialize(22, pin);
    } catch (err) {
      console.error("Failed to initialize sensor:", err);
    }
  }

/**
 * Converts Celsius to Fahrenheit. Rounds to 1 decimal point.
 * @param {number} celsius - The temperature in Celsius.
 * @returns {number} The temperature in Fahrenheit.
 */
function celsiusToFahrenheit(celsius) {
    return Number(((celsius * 9 / 5) + 32).toFixed(1));
}