import paho.mqtt.client as paho
import json
import mysql.connector as sql
import traceback
import sqlManager
import datetime


NAMES_TABLE =  "classes"
LENGTH_FILE = "length.txt"
LIVE_DATA_FILE = "./mqtt broker api/liveData.txt"

toRead = False
#making the connection with database

db = sql.connect(
    host="localhost",
    user="meshNetwork",
    password="Mesh128@",
    database="reteMesh"
)

myCursor = db.cursor()

#check if tables are updated if not then update them

def findTbName(name):
    
    cur = db.cursor(buffered=True)
    cur.execute("SHOW TABLES")

    for x in cur:
        if str(x[0]) == name:
            return True
    return False

def updateTables(data):
    #mantieni sempre la stessa posizioni dei nodi nell'array
    global myCursor,db
    for dic in data["main"]:
        tbName = "node"+str(dic["node"])
        id = str(dic['id'])

        #nome non trovato = nuovo nodo aggiunto
        if(not findTbName(tbName)):
            myCursor.execute(f"CREATE TABLE {tbName} (temp VARCHAR(255), date DATETIME)")
            myCursor.execute(f"INSERT INTO nodesInfo (nodeName, nodeId) VALUES('{tbName}','{id}')")
            db.commit()



def arrToJson(arr):
    for i in range(len(arr)):
        arr[i] = json.loads(arr[i])

    return arr

def updateData(data):

    global myCursor, db

    date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    for dic in data["main"]:
        
        tbName = "node"+str(dic['node'])
        temp = dic['temp']
        myCursor.execute(f"INSERT INTO {tbName} (temp, date) VALUES ('{temp}','{date}')")
        db.commit()



def onMes(client, userdata, msg):

    
    global toRead

    try:
        print(msg.topic + " : "+msg.payload.decode())
        
        data = json.loads(msg.payload.decode())

        #pick only the response from mqtt

        if('data' in data.keys()):
            

            data['data'] = arrToJson(data['data'])
            if(not toRead):
                #data e' un array che va convertito in json
            

                #check if the namesTable exists
                sqlManager.hasNamesTable(NAMES_TABLE)

                    

                #check if the length is equal to expected
            
                if(sqlManager.checkLength("length.txt", len(data['data']))  == 1):
                    
                    #update all the tables if < 0 doesn't matter

                    sqlManager.createMissingTables(NAMES_TABLE)

                
                #save data to the database

                sqlManager.updateData(data)
            else:
                toRead = False
                
                #if someone requested, then save it to a json file

                file = open("liveData.txt", 'w')
                json.dump(data['data'], file, indent=1)
                file.close()

        elif("request_id" in data.keys()):
            #toRead = True
            toRead = False
        
    except:
        ""

    
        




    ''' #aggiorno tabelle se ce un nuovo nodo
    updateTables(data)
    updateData(data)

    #print(sqlManager.latestValue(['node0','node1']))
    print("\n---------------\n")
    print(sqlManager.latestValue(["node0","node1"]))
    '''

    

    


client = paho.Client()
client.on_message = onMes

if client.connect("localhost", 1883, 1000) != 0:
    print("FAILED")

#subscription
client.subscribe('/prova')

try:
    client.loop_forever()
except Exception:
    traceback.print_exc()
client.loop_forever

client.disconnect()
