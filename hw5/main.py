from flask import Flask, redirect, url_for, request, render_template
import json
import requests

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')

# deal with yelp search
# https://www.codespeedy.com/how-to-pass-javascript-variables-to-python-in-flask/


@app.route('/getTicketMasterSearch', methods=['POST', 'GET'])
def getYelpSearch():
    # print('enter getTicketMasterSearch')
    url = request.args.get('url')
    print('we got url ', url)
    response = requests.request('GET', url)
    # print(response.json())
    return response.json()

# @app.route('/getIPinfo', methods=['POST', 'GET'])
# def getIPinfo():
#     api_key = 'c74fd8c3b95806'
#     headers = {
#         'Authorization': 'Bearer %s' % api_key,
#     }
#     response = requests.request('GET', 'ipinfo.io', headers=headers)
#     print('we get ip info: ')
#     print(response)
#     return response.json()


if __name__ == '__main__':
    app.run(debug=True)
