from flask import Flask, render_template,request, redirect, url_for,jsonify
import sqlManager1
from flask_mysqldb import MySQL
import time
import json
from requestData import jsonToPubblish,randomNumbers

LIVE_DATA_FILE = "./mqtt broker api/liveData.txt"
IDS_FILE = "./mqtt broker api/ids.txt"

app = Flask(__name__)
mysql = MySQL(app) 

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'meshNetwork'
app.config['MYSQL_PASSWORD'] = 'Mesh128@'
app.config['MYSQL_DB'] = 'reteMesh'

app.secret_key = 'UPDATETHISPART'


"""

def decodeLiveRequest():

    file = open(LIVE_DATA_FILE, 'r')
    dati = file.read()
    dati = json.loads(dati)
    file.close()

    dati = dati['data']
    print(dati)
    #search for the right classes
    ids = open(IDS_FILE, 'r')
    id_data = json.loads(ids.read())
    ids.close()

    final = []
    class_ids = id_data['classes']

    for dato in dati:
        dic = {
            "aula":"",
            "hum":dato['hum'],
            "temp":dato['temp'],
        }

        #trovo aula


        index = id_data['ids'].index(str(dato['id']))
        dic['aula'] = class_ids[index]
        final.append(dic)
    
    return jsonify(final)
        
"""
    


    




@app.route('/')
def mainPage():
    #return the number of the nodes and their ids
    return render_template("index.html", classi=sqlManager1.nodiPresenti())

@app.route('/process_data', methods=["GET","POST"])
def process_data():
    global mysql
    if request.method == 'POST':

        
        data = request.get_json()
        date = ""
        choice = ""
    
        classes = data['classes']
        try:
            date = data['date']
            choice = data['choice']
        except:
            ""
        live = data['live']

        cur = mysql.connection.cursor()

        if(live == "yes"):
            dati = {
                "data":[]
            }

            #before searching into database, pubblish the json so can get updated data

            #check if the user asked for all the classes;

            jsonToPubblish(classes)
            time.sleep(0.3)
            

            """
            if(classes[0] == 'istituto'):
                #fetch data from the json file
                print(decodeLiveRequest())
                return decodeLiveRequest()
            """

            if(classes[0] == 'istituto'):
                file = open(IDS_FILE, 'r')
                dat = json.loads(file.read())
                file.close()

                classes = dat['classes']
                classes.remove("Cistituto")

                for i in range(len(classes)):
                    app = classes[i]
                    app = app[1:]
                    classes[i] = app


            for classe in classes:

                cur.execute(f"SELECT * FROM C{classe} ORDER BY dateTime DESC LIMIT 1")
                res = cur.fetchall()
                print(res)

                dic = {
                    "aula":classe,
                    "hum":res[0][0],
                    "temp":res[0][1]
                }

                dati['data'].append(dic)

                
            
            return jsonify(dati)


        

        dati = {
            "latest":[],
            "data":[]
        }

        for classe in classes:
            

            latestTemp = []
            dataTemp = []

            cur.execute(f"SELECT * FROM C{classe} ORDER BY dateTime DESC LIMIT 1")
            res = cur.fetchall()
            print(res)
            latestTemp.append(res[0][0])
            latestTemp.append(res[0][1])

            if(date == "null" and choice == "null"):
                cur.execute(f"SELECT * FROM C{classe}")
                ris = cur.fetchall()

                print("ciao\n",ris)
                for i in ris:
                    dic = {
                    "name":" ",
                    "x": 0,
                    "y":0,
                    "y2":0
                    }

                    dic['x'] = i[2]
                    dic['y'] = i[1]
                    dic['y2']=i[0]
                    dic['name'] = classe

                    dati['data'].append(dic)

            dati['latest'].append(latestTemp)
            
        


        print(dati)
        return jsonify(dati)
    return redirect(url_for('mainPage'))



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5090, debug=True)
