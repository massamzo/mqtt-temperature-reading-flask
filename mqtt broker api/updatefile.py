import mysql.connector as sql
import sqlManager
import json

NAMES_TABLE =  "classes"
IDS_FILE = 'ids.txt'

db = sql.connect(
    host="localhost",
    user="meshNetwork",
    password="Mesh128@",
    database="reteMesh"
)

#i have the ids but don't know the name of the classes

def addClasses():

    global db
    cur = db.cursor()


    classe = ""
    id = ""

    while(classe != '-1'):
        classe = input("numero aula (-1 per uscire ): ")
        id = input("id : ")

        if(len(classe) > 0 and len(id) > 0 and classe != '-1'):
            cur.execute(f"INSERT INTO {NAMES_TABLE} (length, classTable, id) VALUES ('1','C{classe}','{id}')")

    


    cur.execute(f"SELECT classTable,id from {NAMES_TABLE}")

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



def showData():
    global db
    cur =  db.cursor(buffered=True)
    name = input("name of the class : ")
    cur.execute(f"SELECT * from C{name}")
    res = cur.fetchall()

    print(res)


choice = input("choose action between ADD, UPDATE , REMOVE, SEE: ")
if(choice == 'add'):
    # continue adding unless -1 is inserted

    addClasses()

elif(choice =='see'):

    showData()
  


    



