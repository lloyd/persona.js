#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, abort, redirect, render_template, request, session
import requests

import json

app = Flask(__name__)
app.secret_key = 'Change Me'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    """Handle user login requests with a POST to /login on our server."""

    # The request has to have an "assertion" for us to verify"
    if 'assertion' not in request.form:
        abort(400)

    # Send the assertion to Mozilla's verifier service.
    # I could do this locally, too.
    info = {'assertion': request.form['assertion'], 'audience': '127.0.0.1'}
    resp = requests.post('https://verifier.login.persona.org/verify', data=info)
    if resp.ok:
        # Now I have a JSON object with the user's verified email in it.
        verification = json.loads(resp.content)

        # Did the assetion successfully validate? If so, log the user in.
        if verification['status'] == 'okay':
            session.update({'email': verification['email']})
            return redirect('/')

    # Either the request or the verification failed. Abort.
    abort(500)


@app.route('/logout', methods=['POST'])
def logout():
    """Clear the user's session when they POST to /logout on my server."""
    session.pop('email', None)
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
