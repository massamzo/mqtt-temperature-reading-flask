import mysql.connector as sql


class DBConnection(object):
    def __init__(self, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME):
        self.host = DB_HOST
        self.port = DB_PORT
        self.user = DB_USER
        self.password = DB_PASSWORD
        self.dbName = DB_NAME

        self.con = None

    
    def connect_db(self):
        if self.con == None:
            self.con = sql.connect(
                host="localhost",
                user="meshNetwork",
                password="Mesh128@",
                database="reteMesh"
            )

        return self.con

    def latestValue(self, query):
        self.query = query
        self.cursor = self.con.cursor()
        self.cursor.execute(self.query)
        self.result = self.cursor.fetchall()

        return self.result