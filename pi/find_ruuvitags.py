import ruuvitag_sensor
from ruuvitag_sensor.log import log
from ruuvitag_sensor.ruuvi import RuuviTagSensor

ruuvitag_sensor.log.enable_console()

RuuviTagSensor.find_ruuvitags()
