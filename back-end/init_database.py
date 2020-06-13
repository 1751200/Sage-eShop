import pymongo
import json

client = pymongo.MongoClient(
    "mongodb://VodkaSoul:15050285917@101.37.34.56:27017/")
database = client.Jump

# init product collection

# product1 = {
#     'productID': 'product1',
#     'name': 'Ferm Living Muses Vase - Calli',
#     'price': '$74.99',
#     'description': 'Ferm Living Muses Vase (Calli).100% Stoneware VaseUnique Timeless yet Modern DesignReactive Matte GlazeRough Expression to Complement ShapeOne Size Ø',
#     'image': 'product1.jpg',
# }

# product2 = {
#     'productID': 'product2',
#     'name': 'DutZ Vase Robert smoke - H54 cm',
#     'price': '$199.99',
#     'description': 'Beautiful Flowerfeldt® glassware is an asset to your interior. You will definitely add exclusivity to your interior when you bring the vase Robert smoke of DutZ into your house.',
#     'image': 'product2.jpg'
# }

# product3 = {
#     'productID': 'product3',
#     'name': 'Artificial Flowers Bouquet',
#     'price': '$9.9',
#     'description': 'Owing to our in-depth expertise in this domain, we are Distributor & Supplier of Artificial Flowers bouquet in New Delhi, Delhi, India.',
#     'image': 'product3.jpg'
# }

# product4 = {
#     'productID': 'product4',
#     'name': 'Cherished Friend Bouquet',
#     'price': '$69.90',
#     'description': 'For the friends who truly feel like family, share your thoughts and love with timeless white flowers. Our Cherished Friend bouquet is comprised of a ...',
#     'image': 'product4.jpg'
# }

# product5 = {
#     'productID': 'product5',
#     'name': 'Artifical Flower Made by Recycled Old Stuff',
#     'price': '$6.90',
#     'description': ' Giving old clothes and things, thee kiss of life. See more ideas about Old clothes, Upcycle and Tyres recycle.',
#     'image': 'product5.jpg'
# }

# product6 = {
#     'productID': 'product6',
#     'name': 'Miss Daisy by Volanni',
#     'price': '$55.00',
#     'description': 'Send the Miss Daisy bouquet of flowers from Volanni in Washington, DC. Local fresh flower delivery directly from the florist and never in a box!',
#     'image': 'product6.jpg'
# }

# product_collection = database.product
# product_collection.insert_many([product1, product2, product3, product4, product5, product6])


# record = {'nickname': 'VoS1', 'score': 51}
# mini = database.Score.find_one(sort=[("score", 1)])
# if record['score'] >= mini['score']:
#     database.Score.update_one(mini, {'$set': record})

results = database.Score.find().sort('score', pymongo.DESCENDING)
print([{'name': r['nickname'], 'score': r['score']} for r in results])
