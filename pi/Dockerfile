FROM ubuntu:20

RUN apt-get install bluetooth bluez blueman bluez-hcidump

RUN apt-get install python3-pip

RUN pip install ruuvitag_sensor requests python-dotenv

WORKDIR /app

COPY . .

CMD ["python", "main.py"]
