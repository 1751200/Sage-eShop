from flask import request, jsonify, current_app
from bson.objectid import ObjectId
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import pymongo
import functools


SECRET_KEY = "A secret key"


def create_token(userId):
    # s = Serializer(current_app.config["SECRET_KEY"], expires_in=3600)
    s = Serializer(SECRET_KEY, expires_in=3600)
    token = s.dumps({"id": userId}).decode("ascii")
    return token


def verify_token(token):
    s = Serializer(SECRET_KEY)
    try:
        data = s.loads(token)
    except Exception:
        return None
    database = pymongo.MongoClient("mongodb://localhost:27017/").Sage
    user = database.user.find_one({'_id': ObjectId(data)})
    return user


def login_required(view_func):
    @functools.wraps(view_func)
    def verify_token(*args, **kwargs):
        try:
            token = request.headers["Authorization"][7:]
        except Exception:
            return jsonify(code=4103, message='Token missing')

        s = Serializer(SECRET_KEY)
        try:
            s.loads(token)
        except Exception:
            return jsonify(code=4101, message="Authorization expires")

        return view_func(*args, **kwargs)

    return verify_token
