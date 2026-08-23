---
title: "How to Make a Gmail Bot with a persona using OpenAI GPT and MindsDB"
description: "Introduction"
date: "2023-04-30T11:37:56.088Z"
slug: "how-to-make-a-gmail-bot-using-openai-gpt-and-mindsdb"
cover: "/images/posts/how-to-make-a-gmail-bot-using-openai-gpt-and-mindsdb/a4045aa3-6c49-4e0d-ab2b-89effb24538d-7a7fced9c1.jpeg"
tags:
  - "python"
  - "gmail"
  - "openai"
  - "mindsdb"
  - "mindsdbhackathon"
draft: false
hashnodeId: "clh3c82go000h09mm7drj7ykn"
---

## Introduction

The AI hype refuses to die, more so after the release of Chat GPT and more recently the GPT4. I've been missing the AI action so far, so when MindsDB & Hashnode announced this hackathon and I saw the Twitter Bot implementation using the OpenAI APIs I knew that I wanted to build a bot for the hackathon.

But then the question arose, a bot for what purpose and for which application? Twitter was already done and dusted. I wanted my bot to be a wise and witty companion who is always available, so that helped me zero down on a Gmail bot. But the Gmail Integration was not yet implemented, and that was the second reason for choosing to build it. Practicing my Python skills, and the idea of contributing to a good project were the other important reasons.

***Tl;dr*** *this article is about creating a new application (Gmail) handler for MindsDB and then using that handler to create an email bot that replies to incoming emails interestingly and poetically.*

## Setting up the environment

Since the first task is to develop the Gmail handler, we must set up the environment for development. But before that, I needed to know [how to contribute to this project](https://docs.mindsdb.com/contribute), and [how to install MindsDb for development](https://docs.mindsdb.com/contribute/install). During the installation I faced only one issue related to `libmagic` which was not installed on my Mac by default, so had to install it using `brew install libmagic.`

The next step was to learn the [basics of creating an app handler](https://docs.mindsdb.com/contribute/app-handlers). This gave me a good overview of what I'm supposed to do for creating the Gmail handler.

*Going through the relevant docs and following the mentioned steps is crucial if you want to contribute to any existing project.*

## Running the existing installation

Now it was time to get my hands dirty, and the first step in that direction was to use an existing app handler. But before that, I followed the "Predict Home Rental Prices" tutorial from the "Learning Hub" in the local MindsDB web console, and everything worked fine.

![Predict Home Rental Prices Tutorial](/images/posts/how-to-make-a-gmail-bot-using-openai-gpt-and-mindsdb/b86a2975-1673-45e2-b000-df73cc21b00d-97c33a90f7.png)

Next was the turn of the Twitter handler. I tried creating a tweets database using the below command in the local MindsDB browser console.

```sql
CREATE DATABASE my_twitter 
WITH 
    ENGINE = 'twitter',
    PARAMETERS = {
      "bearer_token": "twitter bearer token",
      "consumer_key": "twitter consumer key",
      "consumer_secret": "twitter consumer key secret",
      "access_token": "twitter access token",
	  "access_token_secret": "twitter access token secret"
    };
```

At least it should error out saying invalid credentials, but instead, I got the below error

`Can't connect to db: Handler 'twitter' can not be used`

Well, that's a bummer. Why it is not working? This is where you start debugging and find out what is happening in the codebase. And how do we do that? I simply searched for the error string `"Can't connect to db"` in the codebase and found the issue to be related to the handler not getting imported. After some more investigation saw that the zsh console has this info message

`Dependencies for the handler 'twitter' are not installed by default. If you want to use "twitter" please install "['tweepy']"`

And there we have it. This gives us a clue that if we want to use any of the other handlers (except the basic ones) we need to install their dependencies manually.

`pip install tweepy` and restarting MindsDB was enough to get the error I was hoping for in the first place

`Can't connect to db: Error connecting to Twitter api: 401 Unauthorized Unauthorized. Check bearer_token`

Now we're all set for development. As the docs said to study the Twitter handler, I simply created a copy of the twitter\_handler folder and renamed it to gmail\_handler. Then replaced "Twitter" with "Gmail" in `__init__.py` and `__about__.py` files along with related method name changes in the `gmail_handler` file. Verified it by executing the same Twitter create database command but replacing the engine with "gmail", and it seemed to call our gmail\_handler.

## Implementing the Gmail Handler

Going by the steps mentioned in [how to create an application handler](https://docs.mindsdb.com/contribute/app-handlers) we need to modify the below methods. Before we can read/write emails we need to authenticate the user, so the first targets were the `connect` and the `check_connection` methods.

![Handler methods to implement](/images/posts/how-to-make-a-gmail-bot-using-openai-gpt-and-mindsdb/29a859f0-b86d-439f-bea4-a341053208a1-903c3f4252.png)

### Setting up a Google project for Gmail APIs

To use the Gmail APIs we need to set up a Google Cloud Project and a Google Account with Gmail enabled. We will also need to enable the Gmail API from the Google Cloud Console.

Then we need to create OAuth Client Ids for authenticating users, and possibly an Auth Consent Screen (if this is the first time we're setting up OAuth)

Setting up OAuth Client Id will give us a credentials file which we will need in our gmail\_handler for connection. You can find more information on [how to set up a Google project for the Gmail APIs here](https://developers.google.com/workspace/gmail/api/quickstart/python).

### Initing the GmailHandler class

We take the connection arguments (which are passed with the CREATE DATABASE command) and store them for future use. We also register an `"emails"` table where we will store our data.

```python
class GmailHandler(APIHandler):
    """A class for handling connections and interactions with the Gmail API.

    Attributes:
        credentials_file (str): The path to the Google Auth Credentials file for authentication
        and interacting with the Gmail API on behalf of the uesr.

        scopes (List[str], Optional): The scopes to use when authenticating with the Gmail API.
    """

    def __init__(self, name=None, **kwargs):
        super().__init__(name)

        self.connection_args = kwargs.get('connection_data', {})
        self.credentials_file = self.connection_args['credentials_file']
        self.scopes = self.connection_args.get('scopes', DEFAULT_SCOPES)
        self.token_file = None
        self.max_page_size = 500
        self.max_batch_size = 100
        self.service = None
        self.is_connected = False

        emails = EmailsTable(self)
        self._register_table('emails', emails)
```

### Handling Google Authentication

Following the link in the previous section, and the MindsDB code requirements, we need to do the following

1. Replace the content of requirements.txt inside the gmail\_handler folder with the following. Do remember to install these modules using the pip install command
    
    ```javascript
    google-api-python-client
    google-auth-httplib2
    google-auth-oauthlib
    ```
    
2. The `connect` method. Here we use the credentials files created in the previous section for authenticating the user.
    
    ```python
    def connect(self):
        """Authenticate with the Gmail API using the credentials file.
    
        Returns
        -------
        service: object
            The authenticated Gmail API service object.
        """
        if self.is_connected is True:
            return self.service
    
        self.service = self.create_connection()
    
        self.is_connected = True
        return self.service
    
    def create_connection(self):
        creds = None
        token_file = os.path.join(os.path.dirname(self.credentials_file), 'token.json')
    
        if os.path.isfile(token_file):
            creds = Credentials.from_authorized_user_file(token_file, self.scopes)
    
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            elif not os.path.isfile(self.credentials_file):
                raise Exception('Credentials must be a file path')
            else:
                flow = InstalledAppFlow.from_client_secrets_file(self.credentials_file, self.scopes)
                creds = flow.run_local_server(port=0, timeout_seconds=120)
    
        # Save the credentials for the next run
        with open(token_file, 'w') as token:
            token.write(creds.to_json())
    
        return build('gmail', 'v1', credentials=creds)
    ```
    
3. The `check_connection` method
    
    ```python
    def check_connection(self) -> StatusResponse:
        """Check connection to the handler.
    
        Returns
        -------
        StatusResponse
            Status confirmation
        """
        response = StatusResponse(False)
    
        try:
            # Call the Gmail API
            service = self.connect()
    
            result = service.users().getProfile(userId='me').execute()
    
            if result and result.get('emailAddress', None) is not None:
                response.success = True
        except HttpError as error:
            response.error_message = f'Error connecting to Gmail api: {error}.'
            log.logger.error(response.error_message)
    
        if response.success is False and self.is_connected is True:
            self.is_connected = False
    
        return response
    ```
    

Now we're ready to run the create database command and authenticate the user (of course we've not decided on the columns of our table but we will come to that). Simply run

```sql
CREATE DATABASE mindsdb_gmail
WITH ENGINE = 'gmail',
PARAMETERS = {
  "credentials_file": "mindsdb/integrations/handlers/gmail_handler/credentials.json"
};
```

### Fetching Emails from the Gmail API

The flow for fetching emails using MindsDB is like this: you execute an `SQL SELECT` query, and the `select` method of the `APITable` class gets called. There you parse the query params and finally call the Gmail API accordingly.

* The `select` method of the EmailsTable
    

```python
class EmailsTable(APITable):
    """Implementation for the emails table for Gmail"""

    def select(self, query: ast.Select) -> Response:
        """Pulls emails from Gmail "users.messages.list" API

        Parameters
        ----------
        query : ast.Select
           Given SQL SELECT query

        Returns
        -------
        pd.DataFrame
            Email matching the query

        Raises
        ------
        NotImplementedError
            If the query contains an unsupported operation or condition
        """

        conditions = extract_comparison_conditions(query.where)

        params = {}
        for op, arg1, arg2 in conditions:

            if op == 'or':
                raise NotImplementedError(f'OR is not supported')

            if arg1 in ['query', 'label_ids', 'include_spam_trash']:
                if op == '=':
                    if arg1 == 'query':
                        params['q'] = arg2
                    elif arg1 == 'label_ids':
                        params['labelIds'] = arg2.split(',')
                    else:
                        params['includeSpamTrash'] = arg2
                else:
                    raise NotImplementedError(f'Unknown op: {op}')

            else:
                raise NotImplementedError(f'Unknown clause: {arg1}')

        if query.limit is not None:
            params['maxResults'] = query.limit.value

        result = self.handler.call_gmail_api(
            method_name='list_messages',
            params=params
        )

        # filter targets
        columns = []
        for target in query.targets:
            if isinstance(target, ast.Star):
                columns = []
                break
            elif isinstance(target, ast.Identifier):
                columns.append(target.parts[-1])
            else:
                raise NotImplementedError(f"Unknown query target {type(target)}")

        if len(columns) == 0:
            columns = self.get_columns()

        # columns to lower case
        columns = [name.lower() for name in columns]

        if len(result) == 0:
            result = pd.DataFrame([], columns=columns)
        else:
            # add absent columns
            for col in set(columns) & set(result.columns) ^ set(columns):
                result[col] = None

            # filter by columns
            result = result[columns]
        return result
```

* The `get_columns` method. These are the columns that our `"EmailsTable"` will have.
    

```python
def get_columns(self):
    """Gets all columns to be returned in pandas DataFrame responses

    Returns
    -------
    List[str]
        List of columns
    """
    return [
        'id',
        'message_id',
        'thread_id',
        'label_ids',
        'from',
        'to',
        'date',
        'subject',
        'snippet',
        'body',
    ]
```

* The `call_gmail_api` method of the `GmailHandler` class. The way the Gmail messages API works is, first it returns a list of the messages that match your query criteria. These messages contain just the threadId & the messageId etc and not the full email. Then using the `"messageIds"` you fetch the full messages separately.
    

```python
def call_gmail_api(self, method_name: str = None, params: dict = None):
    """Call Gmail API and map the data to pandas DataFrame
    Args:
        method_name (str): method name
        params (dict): query parameters
    Returns:
        DataFrame
    """
    service = self.connect()
    if method_name == 'list_messages':
        method = service.users().messages().list
    elif method_name == 'send_message':
        method = service.users().messages().send
    else:
        raise NotImplementedError(f'Unknown method_name: {method_name}')

    left = None
    count_results = None
    if 'maxResults' in params:
        count_results = params['maxResults']

    params['userId'] = 'me'

    data = []
    limit_exec_time = time.time() + 60

    while True:
        if time.time() > limit_exec_time:
            raise RuntimeError('Handler request timeout error')

        if count_results is not None:
            left = count_results - len(data)
            if left == 0:
                break
            elif left < 0:
                # got more results that we need
                data = data[:left]
                break

            if left > self.max_page_size:
                params['maxResults'] = self.max_page_size
            else:
                params['maxResults'] = left

        log.logger.debug(f'Calling Gmail API: {method_name} with params ({params})')

        resp = method(**params).execute()

        if 'messages' in resp:
            self._handle_list_messages_response(data, resp['messages'])
        elif isinstance(resp, dict):
            data.append(resp)

        if count_results is not None and 'nextPageToken' in resp:
            params['pageToken'] = resp['nextPageToken']
        else:
            break

    df = pd.DataFrame(data)

    return df
```

* Inner method `_handle_list_messages_response` and other related methods
    

```python
# Handle the API response by downloading the full messages
# using a Batch Request.
def _handle_list_messages_response(self, data, messages):
    total_pages = len(messages) // self.max_batch_size
    for page in range(total_pages):
        self._get_messages(data, messages[page * self.max_batch_size:(page + 1) * self.max_batch_size])

    # Get the remaining messsages, if any
    if len(messages) % self.max_batch_size > 0:
        self._get_messages(data, messages[total_pages * self.max_batch_size:])

def _get_messages(self, data, messages):
    batch_req = self.service.new_batch_http_request(lambda id, response, exception: self._parse_message(data, response, exception))
    for message in messages:
        batch_req.add(self.service.users().messages().get(userId='me', id=message['id']))

    batch_req.execute()

# This method shows how to parse the full email returned 
# by the Gmail API
def _parse_message(self, data, message, exception):
    if exception:
        log.logger.error(f'Exception in getting full email: {exception}')
        return

    payload = message['payload']
    headers = payload.get("headers")
    parts = payload.get("parts")

    row = {
        'id': message['id'],
        'thread_id': message['threadId'],
        'label_ids': message.get('labelIds', []),
        'snippet': message.get('snippet', ''),
    }

    if headers:
        for header in headers:
            key = header['name'].lower()
            value = header['value']

            if key in ['from', 'to', 'subject', 'date']:
                row[key] = value
            elif key == 'message-id':
                row['message_id'] = value

    row['body'] = self._parse_parts(parts)

    data.append(row)

def _parse_parts(self, parts):
    if not parts:
        return

    body = ''
    for part in parts:
        if part['mimeType'] == 'text/plain':
            part_body = part.get('body', {}).get('data', '')
            body += urlsafe_b64decode(part_body).decode('utf-8')
        elif part['mimeType'] == 'multipart/alternative' or 'parts' in part:
            # Recursively iterate over nested parts to find the plain text body
            body += self._parse_parts(part['parts'])
        else:
            log.logger.debug(f"Unhandled mimeType: {part['mimeType']}")

    return body
```

The above is sufficient to fetch and store the emails of the authenticated user in the database. We can run an SQSL SELECT query like below to fetch the emails. The query parameter supports all the [filter options](https://support.google.com/mail/answer/7190) that are available in the Gmail API

```sql
SELECT *
FROM mindsdb_gmail.emails
WHERE query = 'from:test@example.com OR search_text OR from:test@example1.com'
AND label_ids = "INBOX,UNREAD" 
LIMIT 20;
```

### Sending Emails using the Gmail API

For sending emails through the Gmail API and MindsDB we need to use the `SQL INSERT` query. This in turn calls the insert method of the `EmailsTable` class, we created earlier.

```python
def insert(self, query: ast.Insert):
    """Sends emails using the Gmail "users.messages.send" API

    Parameters
    ----------
    query : ast.Insert
        Given SQL INSERT query

    Raises
    ------
    ValueError
        If the query contains an unsupported condition
    """
    columns = [col.name for col in query.columns]

    if self.handler.connection_args.get('credentials_file', None) is None:
        raise ValueError(
            "Need the Google Auth Credentials file in order to write an email"
        )

    supported_columns = {"message_id", "thread_id", "to_email", "subject", "body"}
    if not set(columns).issubset(supported_columns):
        unsupported_columns = set(columns).difference(supported_columns)
        raise ValueError(
            "Unsupported columns for create email: "
            + ", ".join(unsupported_columns)
        )

    for row in query.values:
        params = dict(zip(columns, row))

        if not 'to_email' in params:
            raise ValueError('"to_email" parameter is required to send an email')

        message = EmailMessage()
        message['To'] = params['to_email']
        message['Subject'] = params['subject'] if 'subject' in params else ''

        content = params['body'] if 'body' in params else ''
        message.set_content(content)

        # If threadId is present then add References and In-Reply-To headers
        # so that proper threading can happen
        if 'thread_id' in params and 'message_id' in params:
            message['In-Reply-To'] = params['message_id']
            message['References'] = params['message_id']

        encoded_message = urlsafe_b64encode(message.as_bytes()).decode()

        message = {
            'raw': encoded_message
        }

        if 'thread_id' in params:
            message['threadId'] = params['thread_id']

        self.handler.call_gmail_api('send_message', {'body': message})
```

This method calls the same `call_gmail_api` we saw earlier to send an email. We can use an `SQL INSERT` query to send an email. The `thread_id` and `message_id` parameter values are only required if we're replying to an incoming email and want that our reply should form a thread with the original email. (The `"subject"` should exactly match the original subject line for it to work)

```sql
INSERT INTO mindsdb_gmail.emails (thread_id, message_id, to_email, subject, body)
VALUES ('187cbdd861350934d', '8e54ccfd-abd0-756b-a12e-f7bc95ebc75b@Spark', 'test@example2.com', 'Trying out MindsDB',
        'This seems awesome. You must try it out whenever you can.')
```

## Creating the Gmail Bot

Now that we're unblocked and can fetch/send emails easily using our shiny new GmailHandler, we're ready to work on our Gmail bot.

### Obtaining an OpenAI API key

Since we're developing this locally we do not have the luxury of using the inbuilt API key provided by MindsDB Cloud. We need to create an account on OpenAI and create an API key.

![Creating an API Key for OpenAI API](/images/posts/how-to-make-a-gmail-bot-using-openai-gpt-and-mindsdb/b83632b7-fc9a-42f4-a746-5f41eb5214c4-585b63482d.png)

### Training the Model using MindsDB

I do not have access to GPT4 APIs, so I'm using the `gpt-3.5-turbo` model itself. We're just telling GPT to respond to the email with a proper salutation and signature and to keep the email tone casual. This is done using the prompt\_template parameter.

```sql
CREATE MODEL mindsdb.gpt_model
PREDICT response
USING
engine = 'openai',
max_tokens = 500,
api_key = '<your_api_key>', 
model_name = 'gpt-3.5-turbo',
prompt_template = 'From input message: {{input_text}}\
by from_user: {{from_email}}\
In less than 500 characters, write an email response to {{from_email}} in the following format:\
Start with proper salutation and respond with a short message in a casual tone, and sign the email with my name mindsdb';
```

Once the training is complete we're ready to see our bot in action. Run the following command

```sql
SELECT response
FROM mindsdb.gpt_model_email
WHERE from_email = "alice@example.com" 
AND input_text = "Hi there, I'm bored. Give me a puzzle to solve";
```

And we get the following response, seems quite all right, isn't it?

![model email response in casual tone](/images/posts/how-to-make-a-gmail-bot-using-openai-gpt-and-mindsdb/6f2a16bf-5bb5-4a5b-99fa-5e7aba3db750-68c4aac1a1.png)

On asking for a new puzzle it says the following

![casual second response by GPT](/images/posts/how-to-make-a-gmail-bot-using-openai-gpt-and-mindsdb/7a64f4f9-9b02-446a-946c-c049362b0ae3-218a96bb25.png)

### Giving the bot a persona

Since our initial experiments seem to work fine, we can get a bit adventurous now. Let's give our bot a combined persona of Master Yoda from the Star Wars movies, and Edgar Allan Poe, the famous poet. We do this by changing the prompt\_template in our earlier command

```sql
CREATE MODEL mindsdb.gpt_model_yodapoe
PREDICT response
USING
engine = 'openai',
max_tokens = 800,
api_key = '<your_api_key>', 
model_name = 'gpt-3.5-turbo', -- you can also use 'text-davinci-003' or 'gpt-3.5-turbo'
prompt_template = 'From input message: {{input_text}}\
by from_user: {{from_email}}\
In less than 500 characters, write an email response to {{from_email}} in the following format:\
<respond with a 4 line poem as if you were Edgar Allan Poe but you are also a wise elder like Master Yoda from the Star Wars movies. The wordings should be like Master Yoda but the format should be like Poe. Do not mention that you are Master Yoda or Edgar Allan Poe. Sign it with a made up quote similar to what Voltaire, Nietzsche etc would say. Do not explain or say anything else about the quote.>';
```

Train the model, and then run the same SELECT queries by changing the model name

```sql
SELECT response
FROM mindsdb.gpt_model_yodapoe
WHERE from_email = "alice@example.com" 
AND input_text = "Hi there, I'm bored. Give me a puzzle to solve";
```

This is what I get

![persona response for a puzzle ](/images/posts/how-to-make-a-gmail-bot-using-openai-gpt-and-mindsdb/9e09c975-adb7-4081-a610-50f1ca4c2ca3-92ffb310b7.png)

On changing the input text to the following

```sql
SELECT response
FROM mindsdb.gpt_model_yodapoe
WHERE from_email = "alice@example.com" 
AND input_text = "Hi there, What's in a hackathon?";
```

we get the following result

![what is in a hackathon response](/images/posts/how-to-make-a-gmail-bot-using-openai-gpt-and-mindsdb/b78bcd53-3d16-4aab-8b70-7e2b7cfe2c37-e7fd240543.png)

Overall this seems to be working fine. We can always fine-tune the persona based on our taste. Now we can connect this response generation with the actual email sending and we may as well create a scheduled job to read emails at regular intervals and reply to them based on some predefined criteria.

## Outcomes

When I started working on this feature, I had the following goals and their respective outcomes at the end

1. Create the Gmail handler: This in my opinion is done. There may be some bugs that I'll need to solve in due course
    
2. Contribute to the MindsDB project: I've already [opened a PR](https://github.com/mindsdb/mindsdb/pull/5889) for my changes and now I'm hoping that it gets merged into the codebase.
    
3. Create a Gmail Bot: We've all the ingredients in place, we just need to deploy it somewhere so that it is always available. I did try deploying the source on a droplet but I'm stuck with an error for which I've raised a [GitHub issue](https://github.com/mindsdb/mindsdb/issues/5892).
    
4. Practice my Python skills: I think I've made good progress on this while working on the feature. Python is not my area of expertise, so I'm quite pumped that I was able to create a working integration in a short span of 7-8 days.
    

## Conclusion

Overall it was quite fun and interesting to create a Gmail Bot and the needed Gmail Handler for MindsDB. During the process, I got to see the inner workings of the MindsDB codebase. I learnt to use the Gmail APIs and how emails are structured behind the scenes and how to parse it. It also allowed me to use the MindsDB integration with OpenAI, and now I too can say AI is eating the world :-).

Hope you liked reading the article. If you've noticed any error or issue anywhere please do let me know in the comments.

*\-- Keep adding the bits, soon you'll have more bytes than you may need.*
