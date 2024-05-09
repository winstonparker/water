// Import the i2c-bus module using ES Module syntax
import i2c from 'i2c-bus';
import { sleep } from '../util/time.mjs';

// Constants used in the module
const ADS1115_IIC_ADDRESS0 = 0x48;
const ADS1115_IIC_ADDRESS1 = 0x49;
const ADS1115_REG_POINTER_CONVERT = 0x00;
const ADS1115_REG_POINTER_CONFIG = 0x01;
const ADS1115_REG_CONFIG_OS_SINGLE = 0x80;
const ADS1115_REG_CONFIG_MUX_SINGLE_0 = 0x40;
const ADS1115_REG_CONFIG_MUX_SINGLE_1 = 0x50;
const ADS1115_REG_CONFIG_MUX_SINGLE_2 = 0x60;
const ADS1115_REG_CONFIG_MUX_SINGLE_3 = 0x70;
const ADS1115_REG_CONFIG_MUX_DIFF_0_1 = 0x00;
const ADS1115_REG_CONFIG_MUX_DIFF_0_3 = 0x10;
const ADS1115_REG_CONFIG_MUX_DIFF_1_3 = 0x20;
const ADS1115_REG_CONFIG_MUX_DIFF_2_3 = 0x30;
const ADS1115_REG_CONFIG_PGA_6_144V = 0x00; // default gain
const ADS1115_REG_CONFIG_PGA_2_048V = 0x02; 
const ADS1115_REG_CONFIG_MODE_SINGLE = 0x01;
const ADS1115_REG_CONFIG_DR_128SPS = 0x80; // default data rate
const ADS1115_REG_CONFIG_CQUE_NONE = 0x03;
const ADS1115_REG_CONFIG_MODE_CONTIN = 0x00 ;

export default class ADS1115 {
    constructor(bus, address = ADS1115_IIC_ADDRESS0) {
        this.bus = bus;
        this.address = address;
        this.gain = ADS1115_REG_CONFIG_PGA_6_144V;
        this.coefficient = this.calculateCoefficient(this.gain);
    }

    calculateCoefficient(gain) {
        switch (gain) {
            case 0x00: return 0.1875; // PGA_6_144V
            case 0x02: return 0.125;  // PGA_4_096V
            case 0x04: return 0.0625; // PGA_2_048V
            case 0x06: return 0.03125;// PGA_1_024V
            case 0x08: return 0.015625;// PGA_0_512V
            case 0x0A: return 0.0078125;// PGA_0_256V
            default: return 0.125;  // Default to 4.096V
        }
    }

    setGain(gain) {
        this.gain = gain;
        this.coefficient = this.calculateCoefficient(gain);
    }

    async writeConfig(single = true, channel = 0) {
        let config = [];

        if (channel == 0){
            config = [ ADS1115_REG_CONFIG_OS_SINGLE | ADS1115_REG_CONFIG_MUX_SINGLE_0 | this.gain  | ADS1115_REG_CONFIG_MODE_CONTIN, ADS1115_REG_CONFIG_DR_128SPS | ADS1115_REG_CONFIG_CQUE_NONE]
        }
        const buffer = Buffer.alloc(3); // 3 bytes: register pointer and two config bytes
        buffer[0] = ADS1115_REG_POINTER_CONFIG; // First byte is the register pointer
        buffer[1] = config[0];
        buffer[2] = config[1];
        await this.bus.i2cWrite(this.address, buffer.length, buffer);
        await sleep(100);
    }

    async readValue() {
        await this.bus.i2cWrite(this.address, 1, Buffer.from([ADS1115_REG_POINTER_CONVERT]));
        await sleep(100);
        const data = Buffer.alloc(2);
        await this.bus.i2cRead(this.address, 2, data);
        let raw = data.readInt16BE(0);
        if (raw > 32767) {
            raw -= 65536;
        }
        return Math.round(raw * this.coefficient);
    }

    async readVoltage(channel) {
        await this.writeConfig(true, channel);
        return await this.readValue();
    }

    async readDifferential(channel) {
        await this.writeConfig(false, channel);
        return await this.readValue();
    }
}

// Factory function to create an ADS1115 instance
export async function createADS1115(address = ADS1115_IIC_ADDRESS0) {
    const bus = await i2c.openPromisified(1);
    return new ADS1115(bus, address);
}