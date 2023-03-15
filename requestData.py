import json
import paho.mqtt.client as paho
IDS_FILE = "./mqtt broker api/ids.txt"

#READ AND CONVERT IN JSON THE IDS FILE

def readIdsFile():
    file = open(IDS_FILE, 'r')
    ids = json.loads(file.read())
    file.close()

    return ids


#find the corrispond ids

def findIds(requested_classes):
    file = readIdsFile()
    id = file['ids']
    classes = file['classes']

    ids = []

    for i in requested_classes:
        ind = classes.index("C"+i)
        ids.append(int(id[ind]))

    return ids


#create the request json

def jsonToPubblish(requested_classes):

    client1 = paho.Client()
    client1.connect("localhost", 1883)

    if("istituto" in requested_classes):
        data = {
            "request_id":"all"
        }

        client1.publish("/prova",json.dumps(data))

    else:
        requested_ids = findIds(requested_classes)
        data = {
            "request_id":requested_ids,
            "length":0
        }

        data['length'] = len(requested_ids)



    
    client1.publish("/prova",json.dumps(data))


def randomNumbers():
    client1 = paho.Client()
    client1.connect("localhost", 1883)

    data = '{"data":["{\"node\":0,\"temp\":39.79999924,\"hum\":85,\"id\":317221743}","{\"node\":1,\"temp\":22.10000038,\"hum\":65,\"id\":317221941}"],"avg_temp":20.1738, "avg_hum":60,"delay":10}'

    client1.publish("/prova",data)

    
