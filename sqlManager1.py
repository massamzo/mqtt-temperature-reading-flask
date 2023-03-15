import mysql.connector as sql
import json

NAMES_TABLE =  "classes"
IDS_FILE = '/home/massam/Desktop/mqtt_proj/mqtt broker api/ids.txt'

db = sql.connect(
    host="localhost",
    user="meshNetwork",
    password="Mesh128@",
    database="reteMesh"
)
mycur = db.cursor()

def nodiPresenti():
    file = ""
    try:
        file = open(IDS_FILE, 'r')
        res = json.loads(file.read())
        file.close()
    
        ris = [i[1:] for i in res['classes']]

        return ris
    except:
        ""
    
def latestValue(nodes):

    global db, mycur
    valoriRecenti = []
    for i in nodes:
        mycur.execute(f"SELECT * FROM {i} ORDER BY date DESC LIMIT 1")
        res = mycur.fetchall()
        valoriRecenti.append(res[0][0])
    
    return valoriRecenti



'''mosquitto_pub -t '/prova' -m '{"main":["{\"node\":0,\"temp\":3.79999924,\"hum\":65,\"id\":317221743}","{\"node\":1,\"temp\":14.10000038,\"hum\":65,\"id\":317221941}"],"delay":10}'
'''