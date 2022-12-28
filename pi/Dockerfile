FROM ubuntu:20.04

RUN apt-get update

RUN apt-get install bluetooth bluez blueman bluez-hcidump -y

RUN apt-get install python3-pip -y

RUN pip install ruuvitag_sensor requests python-dotenv

WORKDIR /app

COPY . .

CMD ["start.sh"]
