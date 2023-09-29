#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template, url_for
from models import storage
from uuid import uuid4
from os import getenv


# flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = int(getenv('HBNB_API_PORT'))
host = '0.0.0.0'


# begin flask page rendering
@app.teardown_appcontext
def teardown_db(exception):
    """
    after each request, this method calls .close() (i.e. .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()


@app.route('/100-hbnb')
def hbnb_filters(the_id=None, strict_slashes=False):
    """
    handles request to custom template with states, cities & amentities
    """
    states = storage.all('State').values()
    print(states);
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = dict([user.id, "{} {}".format(user.first_name, user.last_name)]
                 for user in storage.all('User').values())
    return render_template('100-hbnb.html',
                           states=states,
                           amens=amens,
                           places=places,
                           users=users,
                           cache_id='?' + str(uuid4()))

if __name__ == "__main__":
    """
    MAIN Flask App"""
    app.run(host=host, port=port)
