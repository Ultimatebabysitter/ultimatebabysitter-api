**Update User**
----
  Returns JSON data verifying if the user was updated.

* **URL**

  /users/:userId

* **Method:**

  `POST`

*  **URL Params**

  **Required:** `id=[integer]`

* **Data Params**

  **Required:** Authorization Header

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    `{
      "n": 1,
      "nModified": 1,
      "ok": 1
    }`

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:**
    `{
      "message": "auth failed"
    }`

* **Sample Call:**

  ```
  [
    {
    	"propName": "age",
    	"value": 34
    }
  ]
  ```
