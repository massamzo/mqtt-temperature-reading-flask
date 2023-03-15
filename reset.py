import mariadb as sql
import json
import os
IDS_FILE = "./mqtt_broker_api/ids.txt"
LENGTH_FILE = "./mqtt_broker_api/length.txt"


db = sql.connect(
    host="localhost",
    user="meshNetwork",
    password="Mesh128@",
    database="reteMesh"
)

mycursor = db.cursor()

def tablesToDrop():
    file = open(IDS_FILE, 'r')
    data = json.loads(file.read())
    file.close()

    return data['classes']


def dropTables():
    cur = db.cursor(buffered=True)
    classes = tablesToDrop()

    cur.execute("DROP TABLE classes")

    for classe in classes:
        cur.execute(f"DROP TABLE {classe}")

    
def dropIdFiles():
    os.remove(IDS_FILE)
    #reset the length to 0
    file = open(LENGTH_FILE, "w")
    file.write("0")
    file.close()


def resetAll():

    dropTables()
    dropIdFiles()






resetAll()


