
# API Documentation:

#### Full Issue Profile
`/issues/profile/<issue_id|>`  
Get an issue's full profile. If no `issue_id` is provided, a relevant issue will be selected and returned.  
Sample endpoint response:  
```
{
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
        ...
    ]
}
```

#### Issue Preview
`/issues/preview/`  
Returns the previews of current and archived issues.  
Sample endpoint response:  
```
{
    "current": [
        {
            "issue_title": "Support the Pidgeon Recognition Act",
            "days_until_vote": 11,
            "desired_outcome": "yea",
            "number_of_positive_votes_outstanding": 6,
            "confidence_rating": 95,
            "id": 1
        },
        ...
    ],
    "archive": [
        {
            "issue_title": "Support the Pidgeon Recognition Act",
            "passage_date": "12/1/2017",
            "id": 1
        },
        ...
    ]
}
```


/legislators/<state>/

/search/<legislators|issues|unified>/?query=<query>&sort=<time_until_vote|alphabetical|relevance>