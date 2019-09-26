# Project Kunta

<img src="http://kunta.io/img/kunta_right.png" alt="Project Kunta Logo" width="100"/>


*** RUN ON NODE v9.6.1 FOR NOW **

## Protocol

### Simple Configuration

```javascript
const BLOCKCHAIN_CONFIGURATION = {
    type: BLOCKCHAIN_TYPE.GENERAL,
    options: {
        total_coins: 100,
    },
    choice_model: CHOICE_TYPE.UNCOORDINATED,
    consensus: CONSENSUS_TYPE.PROOF_OF_WORK,
    genesis_block: {},
    roots: [
        {
            name: "tx",
            index: true,
            type: ROOT_TYPE.UTXO,
            access: ACCESS_TYPE.PUBLIC
        }
    ]
}
```

### Advanced Configuration

```javascript
{
          type: 1,
          options: {},
          consensus: 0,
          genesis_block: {},
          block_creation_time: 60000 * 1,
          vm_hash: "6a17d8206ee63cc9548efd2fa75f79e4c7fa1989c24f1da776423b892a5421c5",
          roots: [
            {
              "name": "vote",
              "access": 0,
              "code": "[SIG] [HASHPUBK] [CHECKSIG] [PUBKHASH]",
              "return": "votes",
              "aspects": [
                {
                  "description": "holding the total number of votes at a time",
                  "aspect": "votes",
                  "default_value": 1200
                },
                {
                  "description": "votes can only happen if 1",
                  "aspect": "able_to_vote",
                  "default_value": 1
                }
              ]
            },
            {
              "name": "verdict",
              "access": 0,
              "code": "[EXTERN_STATE] [PARAMETER] OP_ATLEAST_ZERO OP_VERIFY",
              "return": "#BLANK#",
              "aspects": [
                {
                  "description": "refer to extern state, grab v, sum",
                  "aspect": "end_date",
                  "default_value": 1826387363
                }
              ]
            }
          ],
          chainscript: {
              functions: [
                  {"Create": {
                    "hash": "74e236ee07ca952268b24b1e39f1d8c1e9406e5c21461a243740c1002a2f21b3",
                    "body": {
                        "code": "OP_FUNCCALL [FUNC_NAME] [PARAM] OP_RETURN [VALUE]",
                        "script": "OP_FUNCCALL log \"created...\" OP_RETURN True"
                    },
                    "return": {
                        "code": "[ACCOUNT]",
                        "script": "votes"
                    }
                  }},
                  {"testFunc": {
                    "hash": "74e236ee07ca952268b24b1e39f1d8c1e9406e5c21461a243740c1002a2f21b3",
                    "body": {
                        "code": "Nonce answer = b.nonce; return answer;",
                        "script": "Nonce answer = b.nonce; return answer;"
                    },
                    "return": {
                        "code": "[ACCOUNT]",
                        "script": "votes"
                    }
                  }},
                  {"OnNewBlock": {
                    "hash": "74e236ee07ca952268b24b1e39f1d8c1e9406e5c21461a243740c1002a2f21b3",
                    "body": {
                        "code": "ONB_Param1 ONB_Param2 ONB_Param3 ONB_Param4",
                        "script": "ONB_Param1 ONB_Param2 ONB_Param3 ONB_Param4"
                    },
                    "return": {
                        "code": "",
                        "script": ""
                    }
                  }}
              ]
          }
        }
```
