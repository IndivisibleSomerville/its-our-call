from flask import Flask
from flask import jsonify
from backend.version import CURRENT_VERSION


app = Flask(__name__)


@app.route('//')
def index():
    api_info = {
        "version": CURRENT_VERSION
    }
    return jsonify(api_info)
    

@app.route('/issues/full_profile/')
def issues_profile():
    response = {
        "issue_title": "An Act promoting climate change adaptation, environmental and natural resource protection, and investment in recreational assets and opportunity",
        "days_until_vote": 11,
        "desired_outcome": "yea",
        "number_of_positive_votes_outstanding": 6,
        "confidence_rating": 95,
        "legislators": [
            {
                "name": "Ted Deutch",
                "chamber": "House",
                "state": "Florida",
                "district": "22",
                "party": "Democrat",
                "id": 1
            },
            {
                "name": "Debbie Wasserman Schultz",
                "chamber": "House",
                "state": "Florida",
                "district": "22",
                "party": "Democrat",
                "id": 1
            },
            {
                "name": "Frederica Wilson",
                "chamber": "House",
                "state": "Florida",
                "district": "22",
                "party": "Democrat",
                "id": 1
            },
            {
                "name": "Mario Díaz-Balart",
                "chamber": "House",
                "state": "Florida",
                "district": "22",
                "party": "Republican",
                "id": 1
            },
            {
                "name": "Carlos Curbelo",
                "chamber": "House",
                "state": "Florida",
                "district": "22",
                "party": "Republican",
                "id": 1
            }
        ]
    }
    return jsonify(response)


@app.route('/issues/preview/')
def issues_preview():
    result = {
        "current": [
            {
                "issue_title": "Support the Pidgeon Recognition Act",
                "days_until_vote": 11,
                "desired_outcome": "yea",
                "number_of_positive_votes_outstanding": 6,
                "confidence_rating": 95,
                "id": 1
            },
            {
                "issue_title": "Support the Pidgeon Recognition Act",
                "days_until_vote": 11,
                "desired_outcome": "yea",
                "number_of_positive_votes_outstanding": 6,
                "confidence_rating": 95,
                "id": 1
            }
        ],
        "archive": [
            {
                "issue_title": "Support the Pidgeon Recognition Act",
                "passage_date": "12/1/2017",
                "id": 1
            },
            {
                "issue_title": "Support the Pidgeon Recognition Act",
                "passage_date": "12/1/2017",
                "id": 1
            },
            {
                "issue_title": "Support the Pidgeon Recognition Act",
                "passage_date": "12/1/2017",
                "id": 1
            },
            {
                "issue_title": "Support the Pidgeon Recognition Act",
                "passage_date": "12/1/2017",
                "id": 1
            }
        ]
    }
    return jsonify(result)


@app.route('/legislators/preview/')
def legislators_preview():
    result = {
        "senate": [
            {
                "name": "Ted Deutch",
                "state": "Florida",
                "district": "22",
                "party": "Democrat",
                "id": 1
            },
            {
                "name": "Debbie Wasserman Schultz",
                "state": "Florida",
                "district": "22",
                "party": "Democrat",
                "id": 1
            },
            {
                "name": "Frederica Wilson",
                "state": "Florida",
                "district": "22",
                "party": "Democrat",
                "id": 1
            },
            {
                "name": "Mario Díaz-Balart",
                "state": "Florida",
                "district": "22",
                "party": "Republican",
                "id": 1
            },
            {
                "name": "Carlos Curbelo",
                "state": "Florida",
                "district": "22",
                "party": "Republican",
                "id": 1
            }
        ],
        "house": [
            {
                "name": "Ted Deutch",
                "state": "Florida",
                "district": "22",
                "party": "Democrat",
                "id": 1
            },
            {
                "name": "Debbie Wasserman Schultz",
                "state": "Florida",
                "district": "22",
                "party": "Democrat",
                "id": 1
            },
            {
                "name": "Frederica Wilson",
                "state": "Florida",
                "district": "22",
                "party": "Democrat",
                "id": 1
            },
            {
                "name": "Mario Díaz-Balart",
                "state": "Florida",
                "district": "22",
                "party": "Republican",
                "id": 1
            },
            {
                "name": "Carlos Curbelo",
                "state": "Florida",
                "district": "22",
                "party": "Republican",
                "id": 1
            }
        ]
    }
    return jsonify(result)

