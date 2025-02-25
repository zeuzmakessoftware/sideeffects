## Hello world for flask

from flask import Flask

app = Flask(__name__)

def retrieve_embeddings(user_text, prescriptions):
    return True

def respond_to_user(text, prescriptions):
    return True

@app.route("/")
def hello_world():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True)