# -*- coding: utf-8 -*-
from flask import Flask, request, Response, jsonify
from utils import create_token, login_required, verify_token
from flask_cors import CORS
import pymongo
import datetime
import json
import re


app = Flask(__name__)
app.debug = True
CORS(app, supports_credentials=True)
database = pymongo.MongoClient("mongodb://localhost:27017/").Sage


@app.route("/user/register", methods=['POST'])
def register():
    data = json.loads(request.get_data())
    if database.user.find({'username': re.compile('^%s$' % data['username'], re.IGNORECASE)}).count() != 0:
        response = jsonify({'message': 'The username you entered is already in use on another account', 'code': 20001})
    elif database.user.find({'email': data['email']}).count() != 0:
        response = jsonify({'message': 'The email address you entered is already in use on another account', 'code': 20002})
    else:
        database.user.insert_one({'username': data['username'], 'email': data['email'], 'password': data['password']})
        response = jsonify({'message': 'success', 'code': 20000})
    return response


@app.route("/user/login", methods=['POST'])
def login():
    data = json.loads(request.get_data())
    user = database.user.find_one({'username': re.compile('^%s$' % data['username'], re.IGNORECASE), 'password': data['password']})
    return jsonify({'data': {'token': create_token(str(user['_id'])), 'username': user['username']}, 'message': 'success', 'code': 20000}) \
        if user != None else jsonify({'message': 'You entered an incorrect username or password', 'code': 20000})


@app.route("/product/info", methods=['GET'])
def products_info():
    return jsonify({'data': [{'productID': product['productID'], 'name': product['name'], 'description': product['description'],
                              'price': product['price'], 'image': product['image']} for product in database.product.find()]})


@app.route("/product/product<int:id>", methods=["GET"])
def product_info(id):
    product = database.product.find_one({'productID': "product" + str(id)})
    product.pop("_id")
    return jsonify({'data': product})


@app.route("/user/<username>/cart", methods=["GET", 'POST', "PUT", "DELETE"])
@login_required
def update_cart(username):
    if request.method == "GET":
        return jsonify(code=20000, message="success", data=[{'productID': item['productID'], 'quantity': item['quantity'], \
            'name': database.product.find_one({'productID': item['productID']})['name'], \
                'price': database.product.find_one({'productID': item['productID']})['price']} \
                    for item in database.cart.find({'username': 'VodkaSoul'})])
    elif request.method == "POST":
        data = json.loads(request.get_data())
        data.update({"username": username})
        if database.cart.find_one({'username': username, 'productID': data['productID']}) != None:
            database.cart.update_one({'username': username, 'productID': data['productID']}, {'$inc': {'quantity': int(data['quantity'])}})
        else:
            database.cart.insert_one(data)
        return jsonify({'code': 20000, 'message': 'Successfully add to cart!'})
    elif request.method == "PUT":
        data = json.loads(request.get_data())
        result = database.cart.find_one({'username': username, 'productID': data['productID']})
        result['quantity'] = data['quantity']
        database.cart.update({'username': username, 'productID': data['productID']}, {'$set': result})
        return jsonify(code=20000, message='successfully update')
    else:
        data = json.loads(request.get_data())
        database.cart.delete_one({'username': username, 'productID': data['productID']})
        return jsonify(code=20000, message="Successfuly delete selected products!")


@app.route("/user/<username>/order", methods=["GET", "POST"])
@login_required
def update_order(username):
    if request.method == "GET":
        return jsonify(code=20000, message="success", \
                       orders=[{'order_id': str(order['_id']), 'purchases': order['purchases'], 'create_time': order['create_time']} \
                                for order in database.order.find({'username': username})],\
                       products=[[{'productID': purchase['productID'], 'quantity': purchase['quantity'],\
                                   'name': database.product.find_one({'productID': purchase['productID']})['name'],\
                                   'price': database.product.find_one({'productID': purchase['productID']})['price']}\
                                  for purchase in order['purchases']] for order in database.order.find({'username': username})])
    else:
        pIds = json.loads(request.get_data())
        database.order.insert_one({'username': username, 'purchases': [{'productID': pId, 'quantity': database.cart.find_one(
            {'username': username, 'productID': pId})['quantity']} for pId in pIds], 'create_time': datetime.datetime.utcnow()})
        return jsonify(code=20000, message="success create an order")
