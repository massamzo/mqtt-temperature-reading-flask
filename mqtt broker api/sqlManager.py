import mysql.connector as sql
import json
from datetime import datetime

IDS_FILE = 'ids.txt'


db = sql.connect(
    host="localhost",
    user="meshNetwork",
    password="Mesh128@",
    database="reteMesh"
)
mycur = db.cursor()

def nodiPresenti():
    global db, mycur

    mycur.execute("SELECT * FROM nodesInfo")
    res = mycur.fetchall()

    nodi = []
    for x in res:
        nodi.append(x[0])

    return nodi
    
def latestValue(nodes):

    global db, mycur
    valoriRecenti = []
    for i in nodes:
        mycur.execute(f"SELECT * FROM {i} ORDER BY date DESC LIMIT 1")
        res = mycur.fetchall()
        valoriRecenti.append(res[0][0])
    
    return valoriRecenti


def all_val(nodes):

    global db, mycur

    for i in nodes:
        mycur.execute(f"SELECT * FROM {i}")
        res = mycur.fetchall()
        print(res)


#create all tables required

def hasNamesTable(name):

    global db
    cur = db.cursor(buffered=True)
    cur.execute("SHOW TABLES")

    for i in cur:
        if(name == i[0]):
            return True

    #create the main table and return true

    cur.execute(f"CREATE TABLE {name} (length INT, classTable VARCHAR(255), id VARCHAR(255))")
    return False


#recheck
def updateNamesTable(name, data):
    global db
    cur = db.cursor(buffered=True)

    cur.execute(f"insert into {name} (classTable, id) VALUES ('null','0')")
    db.commit()
    for i in data:
        cur.execute(f"insert into {name} (classTable, id) VALUES ('null','{i['id']}')")
        db.commit()





def checkLength(filename, length):
    try:
        f = open(filename, 'r')
        len = int(f.read())
        f.close()
        f = open(filename, 'w')
        f.write(str(length))

        if(len == length): return 0
        elif(len > length) : return -1 
    except:
        f = open(filename, 'w')
        f.write('0')

    return 1

def createMissingTables(name):

    global db
    cur = db.cursor(buffered=True)

    cur.execute(f"SELECT classTable,id from {name}")

    res = cur.fetchall()
    print(res)
    ids = {
        'ids': [],
        'classes':[]
    }

    for i in res:
        ids['ids'].append(i[1])
        ids['classes'].append(i[0])
        try:
            cur.execute(f"CREATE TABLE {i[0]} (hum INT, temp INT, dateTime DATETIME)")
        except:
            ''
    #save the ids to the file to make the reading procedure faster

    file = open(IDS_FILE, 'w')
    json.dump(ids, file, indent=1)
    file.close()

    


def updateData(data):

    global db
    cur = db.cursor(buffered=True)
    dataList = data['data']
    avg_hum = data['avg_hum']
    avg_temp = data['avg_temp']
    curr_date =  datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    #get the id's from the list

    try:
        file = open(IDS_FILE, 'r')
        ids = json.loads(file.read())
        file.close()

        #inserting the Temperatura Istituto
        cur.execute(f"INSERT INTO {ids['classes'][0]} (hum,temp,dateTime) VALUES ('{avg_hum}','{avg_temp}','{curr_date}')")
        db.commit()

        for i in dataList:

            if(str(i['id']) in ids['ids']):
                print()
                cur.execute(f"INSERT INTO {ids['classes'][ids['ids'].index(str(i['id']))]} (hum,temp,dateTime) VALUES ('{i['hum']}','{i['temp']}','{curr_date}')")
                db.commit()

    except:
        ""