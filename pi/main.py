import os
from datetime import datetime
from time import sleep
from dotenv import load_dotenv

import ruuvitag_sensor
from ruuvitag_sensor.log import log

from urllib.parse import quote
import requests
from ruuvitag_sensor.ruuvi import RuuviTagSensor

load_dotenv()

api_url = os.getenv("API_URL")
sensor_macs = os.getenv("SENSOR_MACS").split(",")

print(sensor_macs)

timeout_in_seconds = 5
sleep_time = 5


def get_time():
    return datetime.now().strftime("%Y-%m-%dT%H-%M-%S")


while True:
    datas = RuuviTagSensor.get_data_for_sensors(sensor_macs, timeout_in_seconds)

    for key, value in datas.items():
        time = get_time()
        temperature = value["temperature"]
        data = {
            "temperature": value["temperature"],
            "timestamp": time
        }

        print(f"{time}: {temperature}")

        response = requests.post(f"{api_url}/temperatures", json=value)

        if not response.ok:
            print(f"Failed to send temperature to server. Error: {response.status_code}, {response.content}")

    sleep(sleep_time)
